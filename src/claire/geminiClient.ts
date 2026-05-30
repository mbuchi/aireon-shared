// Lightweight client for Google's Gemini API, used by Claire — the suite's
// AI parcel assistant. The API key and model are passed in by the consuming
// app (read from its own Vite env) so the shared package stays config-free.

import {
  SWISSNOVO_SUITE_BLURB,
  SWISSNOVO_APP_CATALOG,
} from './claireAppCatalog';
import { fetchGeminiWithFallback } from '../gemini/fallback';

const GEMINI_ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    key,
  )}`;

// Streaming uses the same v1beta resource with the SSE wire format. Gemini
// returns one `data: {…}` frame per delta; the SSE stream ends with a
// `data: [DONE]` line (some models omit it — we tolerate both).
const GEMINI_STREAM_ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
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
  
  // Noise-specific keys for boom app
  noise_source: 'Noise source type',
  noise_period: 'Noise evaluation period',
  noise_layer: 'Environmental noise model layer',
  noise_band: 'Sampled noise exposure level (dB(A))',
  noise_sensitivity: 'Zoning noise sensitivity level (ES)',
  noise_limits: 'Legal noise limit values (Planning/Immission/Alarm)',
  noise_verdict: 'Noise limit compliance verdict',

  // Solar-specific keys for soolar app
  dominantklasse: 'Roof solar suitability level (1-5)',
  totalaream2: 'Suitable roof area for solar (m²)',
  totalyieldkwhyr: 'Estimated annual PV solar yield (kWh/yr)',
  meanirradiationkwhm2yr: 'Mean annual solar irradiation (kWh/m²/yr)',
  totalrevenuechfyr: 'Estimated annual solar revenue (CHF/yr)',
  roof_count: 'Total roof surfaces on building',

  // Building footprint / 3D height keys for footprint app
  rf_volume_lod22: 'Building 3D volume (m³)',
  rf_area: 'Building footprint area (m²)',
  rf_nr_floors: 'Building floor count',
  rf_h_roof_ridge: 'Roof ridge elevation (m)',
  rf_h_roof_max: 'Max roof elevation (m)',
  rf_h_roof_70p: '70th-percentile roof height (m)',
  rf_h_roof_50p: '50th-percentile roof height (m)',
  rf_h_roof_min: 'Min roof elevation (m)',
  rf_h_roof_eaves: 'Eaves elevation (m)',
  rf_h_ground: 'Ground elevation (m)',
  derived_height: 'Derived building height (m)',

  // Geopool-specific keys (Zoning, taxes, vacancy, accessibility)
  tax_sum: 'Total local municipal tax rate (‰)',
  tax_canton: 'Canton tax factor',
  tax_fso_name: 'Tax municipality name',
  cz_util_now: 'Current zoning utilization ratio',
  cz_util_est_score: 'Zoning utilization score',
  gfa_now: 'Current Gross Floor Area (GFA) (m²)',
  gfa_max: 'Maximum allowed Gross Floor Area (GFA) (m²)',
  vol_max: 'Maximum allowed building volume (m³)',
  ratio_s: 'Built parcel ratio (%)',
  ratio_s_free: 'Free/available built parcel ratio (%)',
  ratio_v: 'Volume parcel ratio (%)',
  ratio_v_free: 'Free/available volume parcel ratio (%)',
  acc_ewap_pubt: 'Public transit accessibility travel time (min)',
  acc_ewap_road: 'Private vehicle accessibility travel time (min)',
  tt_agglo_pubt_score: 'Transit accessibility quality score',
  tt_agglo_road_score: 'Road accessibility quality score',
  vac_all: 'Local overall vacancy rate (%)',
  vac_new: 'Local vacancy rate for new construction (%)',
  vac_old: 'Local vacancy rate for existing buildings (%)',
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
  const currentApp = appName ?? 'the current app';
  return `You are "Claire", the AI parcel assistant embedded inside ${where}. You help investors, developers and property owners understand a single selected parcel.

Tone and format:
- Concise, expert, and grounded in the parcel context provided. Avoid filler.
- Use short paragraphs and tight bullet lists when listing items.
- Prices are in CHF. Areas in m². Use Swiss thousand separators when natural.
- Answer in the same language as the user's question (default English).

Rules:
- Always stay focused on the currently selected parcel below. If the user asks for nearby comparisons, market trends, or legal advice, give helpful general guidance grounded in the parcel context and clearly mark estimates as such.
- Never invent specific cadastral, legal, or pricing figures that aren't supplied. If data is missing, say so briefly and suggest what would be needed.
- When the user asks about the neighbourhood (schools, transit, shops, restaurants, parks, services), draw from the "Surrounding location & amenities" block if present — quote names and distances faithfully and do not invent POIs not listed.
- If a "Location-accessibility score" is present, treat it as the parcel's scoore walkability score: it runs 0–6, where 6 means key amenities are at the doorstep. Cite it as "<n>/6" and explain weak categories using the per-category breakdown.
- Mention regulatory caveats for Switzerland where relevant (e.g. zoning law, Lex Koller, planning permissions) at a high level.
- When another SwissNovo app would clearly serve the user's need better than this one, recommend it by name with its URL — usually a single suggestion. Never recommend ${currentApp} itself (it is the app they are already using). Point users to the toolbox dashboard when they want to browse the whole suite.
- Do not output disclaimers longer than one short sentence.

About the SwissNovo suite:
${SWISSNOVO_SUITE_BLURB}

${SWISSNOVO_APP_CATALOG}`;
}

export interface GeminiCallOptions {
  /** Gemini API key — supplied by the consuming app from its Vite env. */
  apiKey: string;
  /**
   * Preferred model id. If supplied, it is tried first; on 429/5xx the call
   * falls through the default chain (gemini-3.5-flash → gemini-3.1-flash-lite
   * → gemini-3-flash-preview). Omit to use only the default chain.
   */
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

// Shared between the unary + streaming call paths so the prompt, generation
// config and safety settings stay byte-identical.
function buildClaireRequestBody(
  appName: string | undefined,
  parcelContext: string,
  history: ChatTurn[],
): string {
  const systemText = `${systemInstruction(appName)}\n\nSelected parcel context:\n${parcelContext}`;
  const contents = history.map((turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }));
  return JSON.stringify({
    systemInstruction: { role: 'system', parts: [{ text: systemText }] },
    contents,
    generationConfig: {
      temperature: 0.55,
      topP: 0.9,
      // The Gemini 3.x flash models in the fallback chain emit hidden
      // "thinking" tokens that count against maxOutputTokens. At 800 the
      // reasoning pass alone could exhaust the budget, so the visible answer
      // was cut off mid-sentence (finishReason MAX_TOKENS) — both the unary
      // apps and streaming Studio share this body, so both were affected.
      // 2048 leaves ample room for the answer after thinking. Billing is on
      // tokens actually generated, so the higher ceiling is free for the
      // concise replies the system prompt asks for.
      maxOutputTokens: 2048,
    },
    safetySettings: [],
  });
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

  const body = buildClaireRequestBody(appName, parcelContext, history);

  const { response: res } = await fetchGeminiWithFallback({
    apiKey,
    model,
    buildUrl: (m, k) => GEMINI_ENDPOINT(m, k),
    requestInit: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    },
    signal,
  });

  let data: GeminiResponse;
  try {
    data = (await res.json()) as GeminiResponse;
  } catch {
    throw new Error(`Gemini request failed (${res.status})`);
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

export interface StreamParcelChatReplyOptions extends GeminiCallOptions {
  /**
   * Called for each token (or token group) as Gemini emits it. Frame
   * boundaries are not stable — buffer the result yourself if you need
   * the complete reply once the stream ends.
   */
  onDelta: (delta: string) => void;
}

/**
 * Streaming variant of {@link generateParcelChatReply}. Invokes `onDelta`
 * for every incremental chunk Gemini emits over SSE and resolves with the
 * full concatenated reply once the stream closes.
 *
 * Same fallback chain semantics as the unary call: if the first model
 * returns a retriable failure before the body opens, the next model in the
 * chain takes over (fetchGeminiWithFallback handles this transparently).
 * Once the body is open and tokens have started flowing, mid-stream
 * failures surface as an error — we don't restart from the top.
 *
 * Note: Gemini does not stream prompt-feedback blocks, so a blocked
 * response shows up as an empty body + a non-200 status, which the
 * fallback layer surfaces as an error before any delta fires.
 */
export async function streamParcelChatReply({
  apiKey,
  model,
  appName,
  parcelContext,
  history,
  signal,
  onDelta,
}: StreamParcelChatReplyOptions): Promise<string> {
  if (!apiKey) throw new GeminiConfigError();
  if (history.length === 0)
    throw new Error('history must contain at least one user message');

  const body = buildClaireRequestBody(appName, parcelContext, history);

  const { response: res } = await fetchGeminiWithFallback({
    apiKey,
    model,
    buildUrl: (m, k) => GEMINI_STREAM_ENDPOINT(m, k),
    requestInit: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body,
    },
    signal,
    // The whole stream can legitimately take >15 s for long answers; the
    // per-attempt timeout in the fallback layer would abort us mid-reply.
    // The caller's `signal` is the only abort mechanism for streaming.
    timeoutMs: 0,
  });

  if (!res.body) {
    throw new Error('Gemini streaming response has no body.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let fullText = '';

  // Standard SSE framing: events are separated by a blank line. Inside an
  // event, lines starting with `data: ` carry the payload; we ignore
  // `event:` / `id:` / `retry:` and any comment lines.
  const consumeEvent = (raw: string) => {
    const lines = raw.split('\n');
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      let frame: GeminiResponse;
      try {
        frame = JSON.parse(payload) as GeminiResponse;
      } catch {
        continue;
      }
      if (frame.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${frame.promptFeedback.blockReason}`);
      }
      const delta = frame.candidates
        ?.flatMap((c) => c.content?.parts ?? [])
        .map((p) => p.text ?? '')
        .join('');
      if (delta) {
        fullText += delta;
        onDelta(delta);
      }
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // Split on the SSE event delimiter — a blank line. Hold any partial
      // trailing event back for the next chunk.
      let sep: number;
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const eventChunk = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        if (eventChunk.trim()) consumeEvent(eventChunk);
      }
    }
    if (buffer.trim()) consumeEvent(buffer);
  } finally {
    try {
      reader.releaseLock();
    } catch {
      /* noop */
    }
  }

  const trimmed = fullText.trim();
  if (!trimmed) throw new Error('Empty response from Gemini.');
  return trimmed;
}
