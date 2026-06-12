// Cross-app PRM client. Hits proom's serverless API directly — proom owns the
// `prm_records` table and the Zitadel-authenticated REST surface. Other suite
// apps (scoore, valoo, …) read/write through this client so saves are
// idempotent on (zitadel_sub, parcel_id) and edits made anywhere flow back
// to proom's Kanban in real time.
//
// CORS: proom's edge handlers respond with `Access-Control-Allow-Origin: *`,
// so cross-origin POST/PATCH/DELETE from both *.aireon.ch and legacy
// swissnovo-*.vercel.app domains works without a proxy.

const PROOM_API_BASE = 'https://proom.aireon.ch/api';

export type PrmState =
  | 'new'
  | 'contacted'
  | 'negotiation'
  | 'due_diligence'
  | 'closed'
  | 'rejected';
export type PrmPriority = 'low' | 'medium' | 'high' | 'urgent';

// The pipeline tracks the four ACTIVE stages only. The terminal `closed` /
// `rejected` states remain in the PrmState type (so legacy records still
// typecheck) but are intentionally omitted from this list so they no longer
// appear as categories anywhere in the suite UI (grid, filters, selectors).
export const PRM_STATES: { value: PrmState; color: string; bg: string }[] = [
  { value: 'new', color: 'text-sky-400', bg: 'bg-sky-500' },
  { value: 'contacted', color: 'text-amber-400', bg: 'bg-amber-500' },
  { value: 'negotiation', color: 'text-orange-400', bg: 'bg-orange-500' },
  { value: 'due_diligence', color: 'text-teal-400', bg: 'bg-teal-500' },
];

export const PRM_PRIORITIES: { value: PrmPriority; color: string }[] = [
  { value: 'low', color: 'text-slate-400' },
  { value: 'medium', color: 'text-sky-400' },
  { value: 'high', color: 'text-orange-400' },
  { value: 'urgent', color: 'text-red-400' },
];

export interface CreatePrmInput {
  parcel_id: string;
  parcel_label: string;
  parcel_municipality: string;
  parcel_area: number;
  parcel_lng: number;
  parcel_lat: number;
}

export interface PrmRecord {
  id: string;
  parcel_id: string;
  user_id: string;
  state: PrmState;
  priority: PrmPriority;
  tags: string[];
  parcel_label: string;
  parcel_municipality: string;
  parcel_area: number;
  parcel_lng: number;
  parcel_lat: number;
  created_at: string;
  updated_at: string;
}

export class AuthRequiredError extends Error {
  constructor() {
    super('Sign in required to track parcels');
    this.name = 'AuthRequiredError';
  }
}

async function prmFetch<T>(
  path: string,
  init: RequestInit,
  token: string | null,
): Promise<T> {
  if (!token) throw new AuthRequiredError();
  const res = await fetch(`${PROOM_API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json())?.error ?? '';
    } catch {
      /* non-JSON body */
    }
    throw new Error(
      `${res.status} ${res.statusText}${detail ? `: ${detail}` : ''}`,
    );
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export function fetchPrmByParcel(
  token: string | null,
  parcelId: string,
): Promise<PrmRecord | null> {
  return prmFetch<PrmRecord | null>(
    `/prm-records?parcel_id=${encodeURIComponent(parcelId)}`,
    { method: 'GET' },
    token,
  );
}

export function createPrmRecord(
  token: string | null,
  input: CreatePrmInput,
): Promise<PrmRecord> {
  return prmFetch<PrmRecord>(
    '/prm-records',
    { method: 'POST', body: JSON.stringify(input) },
    token,
  );
}

export function fetchPrmRecords(token: string | null): Promise<PrmRecord[]> {
  return prmFetch<PrmRecord[]>('/prm-records', { method: 'GET' }, token);
}

export function updatePrmState(
  token: string | null,
  id: string,
  state: PrmState,
): Promise<PrmRecord> {
  return prmFetch<PrmRecord>(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify({ state }) },
    token,
  );
}

export function updatePrmPriority(
  token: string | null,
  id: string,
  priority: PrmPriority,
): Promise<PrmRecord> {
  return prmFetch<PrmRecord>(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify({ priority }) },
    token,
  );
}

export function updatePrmTags(
  token: string | null,
  id: string,
  tags: string[],
): Promise<PrmRecord> {
  return prmFetch<PrmRecord>(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify({ tags }) },
    token,
  );
}

export async function deletePrmRecord(
  token: string | null,
  id: string,
): Promise<void> {
  await prmFetch<{ success: boolean }>(
    `/prm-records/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
    token,
  );
}

export const PROOM_APP_URL = 'https://proom.aireon.ch';
export const TOOLBOX_APP_URL = 'https://hub.aireon.ch';
export const GEOPOOL_APP_URL = 'https://geopool.aireon.ch';

export const LEGACY_PROOM_APP_URL = 'https://swissnovo-proom.vercel.app';
export const LEGACY_TOOLBOX_APP_URL = 'https://swissnovo-toolbox.vercel.app';
export const LEGACY_GEOPOOL_APP_URL = 'https://swissnovo-geopool.vercel.app';
