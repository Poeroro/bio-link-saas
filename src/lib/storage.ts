import { DEFAULT_STATE } from "./dummy-data";
import type { AppState } from "./types";

export const STORAGE_KEY = "biolink-saas-state-v1";

export function readStoredState(): AppState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }

  try {
    const parsed = JSON.parse(raw) as AppState;

    if (!parsed.users?.length) {
      return DEFAULT_STATE;
    }

    return parsed;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
    return DEFAULT_STATE;
  }
}

export function writeStoredState(state: AppState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function exportAllData(): string {
  const state = readStoredState();
  return JSON.stringify(state, null, 2);
}

export function importAllData(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json) as Partial<AppState>;

    if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
      return { ok: false, error: "Data tidak valid: minimal satu user diperlukan." };
    }

    const hasRequired = parsed.users.every(
      (u: Record<string, unknown>) => u.id && u.username && u.email,
    );

    if (!hasRequired) {
      return { ok: false, error: "Data tidak valid: user wajib punya id, username, dan email." };
    }

    const state: AppState = {
      users: parsed.users,
      currentUserId: parsed.currentUserId ?? parsed.users[0].id,
      darkMode: parsed.darkMode ?? false,
    };

    writeStoredState(state);
    return { ok: true };
  } catch {
    return { ok: false, error: "JSON tidak valid." };
  }
}

export function clearAllData() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
}
