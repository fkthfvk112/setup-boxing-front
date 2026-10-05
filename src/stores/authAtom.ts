import { atom } from 'jotai';
import { UserProfile } from '../types/combo';

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('boxing_access_token');
  }
  return null;
};

const getInitialUser = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('boxing_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  return null;
};

export const accessTokenAtom = atom<string | null>(getInitialToken());
export const userProfileAtom = atom<UserProfile | null>(getInitialUser());

export const isAuthenticatedAtom = atom((get) => {
  return !!get(accessTokenAtom);
});

export const loginActionAtom = atom(
  null,
  (
    get,
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
      localStorage.setItem('boxing_access_token', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('boxing_refresh_token', data.refreshToken);
      }
      localStorage.setItem('boxing_user', JSON.stringify(data.user));
    }
  }
);

export const logoutActionAtom = atom(null, (get, set) => {
  set(accessTokenAtom, null);
  set(userProfileAtom, null);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('boxing_access_token');
    localStorage.removeItem('boxing_refresh_token');
    localStorage.removeItem('boxing_user');
  }
});
