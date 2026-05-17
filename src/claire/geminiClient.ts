// Lightweight client for Google's Gemini API, used by Claire — the suite's
// AI parcel assistant. The API key and model are passed in by the consuming
// app (read from its own Vite env) so the shared package stays config-free.

const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';

const GEMINI_ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    key,
  )}`;

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ParcelContextInput {
  properties: Record<string, unknown>;
  enrichment?: Record<string, unknown> | null;
  lngLat: { lng: number; lat: number };
  lv95?: { E: number; N: number } | null;
}

const FIELD_LABELS: Record<string, string> = {
  estimated_price_m2: 'Estimated price per m² (CHF)',
  estimated_price: 'Estimated total value (CHF)',
  price_m2: 'Market price per m² (CHF)',
  price: 'Market price (CHF)',
  area_m2: 'Plot area (m²)',
  parcel_area: 'Plot area (m²)',
  flaeche: 'Plot area (m²)',
  grundflaeche: 'Ground area (m²)',
  bldg_count: 'Building count',
  building_count: 'Building count',
  bldg_size: 'Building footprint (m²)',
  bldg_floors: 'Building floors',
  bldg_height_mean: 'Mean building height (m)',
  bldg_constr_year: 'Construction year',
  construction_year: 'Construction year',
  baujahr: 'Construction year',
  rooms: 'Rooms',
  zimmer: 'Rooms',
  floors: 'Floors',
  geschosse: 'Floors',
  cz_local: 'Local construction zone',
  cz_harmonized: 'Harmonized zone type',
  construction_zone: 'Construction zone',
  bauzone: 'Construction zone',
  nutzungszone: 'Usage zone',
  address: 'Address',
  street: 'Street',
  strasse: 'Street',
  streetname: 'Street',
  cityname: 'City',
  city: 'City',
  ort: 'City',
  gemeinde: 'Municipality',
  municipality: 'Municipality',
  fso_name_2021: 'Municipality (FSO)',
  districtname: 'District',
  plz: 'Postal code',
  zip: 'Postal code',
  canton: 'Canton',
  kanton: 'Canton',
  cz_canton_name: 'Canton',
  parcel_id: 'Parcel ID',
  parcel_local_id: 'Parcel local ID',
  gwr_egid: 'GWR EGID',
  grundstueck_nr: 'Plot number',
  parzelle: 'Parcel number',
  nummer: 'Number',
  owner: 'Owner',
  is_sell: 'Listed for sale',
};

function formatValue(key: string, raw: unknown): string | null {
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw === 'boolean') return raw ? 'yes' : 'no';
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) return null;
    if (key.includes('price') || key.endsWith('_chf')) {
      return Math.round(raw).toLocaleString('en-US');
    }
    if (Number.isInteger(raw)) return raw.toString();
    return raw.toFixed(2);
  }
  return String(raw);
}

export function buildParcelContextSummary(input: ParcelContextInput): string {
  const lines: string[] = [];
  const seen = new Set<string>();
  const props = { ...(input.properties ?? {}) } as Record<string, unknown>;

  // Merge enrichment, prefer existing fields so we don't overwrite layer data.
  if (input.enrichment) {
    for (const [k, v] of Object.entries(input.enrichment)) {
      const lower = k.toLowerCase();
      if (props[lower] === undefined) props[lower] = v;
    }
  }

  for (const [rawKey, value] of Object.entries(props)) {
    const key = rawKey.toLowerCase();
    const label = FIELD_LABELS[key];
    if (!label) continue;
    if (seen.has(label)) continue;
    const formatted = formatValue(key, value);
    if (formatted === null) continue;
    seen.add(label);
    lines.push(`- ${label}: ${formatted}`);
  }

  const { lng, lat } = input.lngLat;
  lines.push(`- WGS84 coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  if (input.lv95) {
    lines.push(`- Swiss LV95 coordinates: E ${input.lv95.E}, N ${input.lv95.N}`);
  }

  return lines.join('\n');
}

function systemInstruction(appName?: string): string {
  const where = appName
    ? `${appName}, a SwissNovo real-estate analytics app`
    : 'a SwissNovo real-estate analytics app';
  return `You are "Claire", the AI parcel assistant embedded inside ${where}. You help investors, developers and property owners understand a single selected parcel.

Tone and format:
- Concise, expert, and grounded in the parcel context provided. Avoid filler.
- Use short paragraphs and tight bullet lists when listing items.
- Prices are in CHF. Areas in m². Use Swiss thousand separators when natural.
- Answer in the same language as the user's question (default English).

Rules:
- Always stay focused on the currently selected parcel below. If the user asks for nearby comparisons, market trends, or legal advice, give helpful general guidance grounded in the parcel context and clearly mark estimates as such.
- Never invent specific cadastral, legal, or pricing figures that aren't supplied. If data is missing, say so briefly and suggest what would be needed.
- Mention regulatory caveats for Switzerland where relevant (e.g. zoning law, Lex Koller, planning permissions) at a high level.
- Do not output disclaimers longer than one short sentence.`;
}

export interface GeminiCallOptions {
  /** Gemini API key — supplied by the consuming app from its Vite env. */
  apiKey: string;
  /** Model id; defaults to gemini-3.1-flash-lite. */
  model?: string;
  /** App name woven into the system prompt (e.g. "Valoo"). */
  appName?: string;
  parcelContext: string;
  history: ChatTurn[];
  signal?: AbortSignal;
}

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
  finishReason?: string;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}

export class GeminiConfigError extends Error {
  constructor() {
    super(
      'Gemini API key missing. Set VITE_GEMINI_API_KEY in the app’s .env file.',
    );
    this.name = 'GeminiConfigError';
  }
}

export async function generateParcelChatReply({
  apiKey,
  model,
  appName,
  parcelContext,
  history,
  signal,
}: GeminiCallOptions): Promise<string> {
  if (!apiKey) throw new GeminiConfigError();
  if (history.length === 0)
    throw new Error('history must contain at least one user message');

  const systemText = `${systemInstruction(appName)}\n\nSelected parcel context:\n${parcelContext}`;

  const contents = history.map((turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }));

  const res = await fetch(
    GEMINI_ENDPOINT(model || DEFAULT_GEMINI_MODEL, apiKey),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { role: 'system', parts: [{ text: systemText }] },
        contents,
        generationConfig: {
          temperature: 0.55,
          topP: 0.9,
          maxOutputTokens: 800,
        },
        safetySettings: [],
      }),
      signal,
    },
  );

  let data: GeminiResponse;
  try {
    data = (await res.json()) as GeminiResponse;
  } catch {
    throw new Error(`Gemini request failed (${res.status})`);
  }

  if (!res.ok) {
    const msg = data?.error?.message ?? `Gemini request failed (${res.status})`;
    throw new Error(msg);
  }

  if (data.promptFeedback?.blockReason) {
    throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
  }

  const text = data.candidates
    ?.flatMap((c) => c.content?.parts ?? [])
    .map((p) => p.text ?? '')
    .join('')
    .trim();

  if (!text) throw new Error('Empty response from Gemini.');
  return text;
}
