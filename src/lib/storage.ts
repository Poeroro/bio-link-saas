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
