import type { Profile } from '../models/profile';

const PROFILE_STORAGE_KEY = 'de-la-fonte:profile';

const DEFAULT_PROFILE: Profile = {
  displayName: '',
};

export function getProfile(): Profile {
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  return JSON.parse(raw) as Profile;
}

export function setDisplayName(displayName: string): Profile {
  const profile: Profile = { displayName };
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}