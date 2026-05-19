// Display-identity helpers — derive a name, email and initials from the raw
// OIDC user. Kept dependency-free (no React, no context) so both the shared
// ProfileModal and any app's own UserMenu can call them directly.

import type { User } from 'oidc-client-ts';

type Claims = User['profile'] | undefined;

function readClaim(p: Claims, key: string): string | undefined {
  const v = (p as Record<string, unknown> | undefined)?.[key];
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** The user's email, or `''` when unknown. */
export function emailOf(user: User | null | undefined): string {
  return readClaim(user?.profile, 'email') ?? '';
}

/** Best-effort full name (name → given+family → preferred_username). */
export function fullNameOf(user: User | null | undefined): string {
  const p = user?.profile;
  const name = readClaim(p, 'name');
  if (name) return name;
  const given = readClaim(p, 'given_name');
  const family = readClaim(p, 'family_name');
  const combined = [given, family].filter(Boolean).join(' ').trim();
  if (combined) return combined;
  return readClaim(p, 'preferred_username') ?? '';
}

/** Best-effort first name (given_name → first word of full name → email local part). */
export function firstNameOf(user: User | null | undefined): string {
  const given = readClaim(user?.profile, 'given_name');
  if (given) return given;
  const full = fullNameOf(user);
  if (full) {
    const head = full.split(/\s+/)[0];
    if (head) return head;
  }
  const email = emailOf(user);
  if (email.includes('@')) return email.split('@')[0]!;
  return email || 'Account';
}

/** 1–2 letter initials derived from the name, falling back to the email. */
export function initialsOf(user: User | null | undefined): string {
  const source = fullNameOf(user) || emailOf(user);
  if (!source) return '?';
  if (source.includes('@')) return source[0]!.toUpperCase();
  const parts = source.split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
  return letters || source[0]!.toUpperCase();
}

/** The provider-supplied profile picture URL, if any. */
export function pictureOf(user: User | null | undefined): string | null {
  return readClaim(user?.profile, 'picture') ?? null;
}
