import { atom, createStore } from 'jotai';
import { UserProfile } from '../types/combo';

const TOKEN_KEY = 'boxing_access_token';
const REFRESH_TOKEN_KEY = 'boxing_refresh_token';
const USER_KEY = 'boxing_user';

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

const getInitialUser = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return null;
};

/** Single in-memory session. React and non-React callers (401 interceptor) share this store. */
export const authStore = createStore();

export const accessTokenAtom = atom<string | null>(getInitialToken());
export const userProfileAtom = atom<UserProfile | null>(getInitialUser());

export const isAuthenticatedAtom = atom((get) => {
  return !!get(accessTokenAtom);
});

export const loginActionAtom = atom(
  null,
  (
    _get,
    set,
    data: {
      accessToken: string;
      refreshToken?: string;
      user: UserProfile;
    }
  ) => {
    set(accessTokenAtom, data.accessToken);
    set(userProfileAtom, data.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
  }
);

export const logoutActionAtom = atom(null, (_get, set) => {
  set(accessTokenAtom, null);
  set(userProfileAtom, null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
});

export function updateSessionUser(user: UserProfile) {
  authStore.set(userProfileAtom, user);
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function clearAuthSession() {
  authStore.set(logoutActionAtom);
}
