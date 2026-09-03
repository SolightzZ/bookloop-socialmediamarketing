/**
 * Types and utilities for Commerce Authentication Gates.
 */

export type PendingAction =
  | {
      type: 'add-to-cart';
      bookId: string;
    }
  | {
      type: 'buy-now';
      bookId: string;
    };

export const PENDING_ACTION_STORAGE_KEY = 'bookloop_pending_action';

export function savePendingAction(action: PendingAction): void {
  try {
    sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, JSON.stringify(action));
  } catch (e) {
    console.warn('Could not save pending commerce action', e);
  }
}

export function getPendingAction(): PendingAction | null {
  try {
    const raw = sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      (parsed.type === 'add-to-cart' || parsed.type === 'buy-now') &&
      typeof parsed.bookId === 'string'
    ) {
      return parsed as PendingAction;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearPendingAction(): void {
  try {
    sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear pending commerce action', e);
  }
}
