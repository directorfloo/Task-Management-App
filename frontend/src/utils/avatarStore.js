// The backend's User entity has no avatar column and no upload endpoint,
// so profile pictures are stored locally, keyed by username, as data URLs.
// This survives logout/login on the same browser, but won't sync across
// devices unless the backend adds real support for it later.

const AVATARS_KEY = "taskmanager_avatars";

const loadAll = () => {
  try {
    return JSON.parse(localStorage.getItem(AVATARS_KEY)) || {};
  } catch {
    return {};
  }
};

export const getAvatar = (username) => {
  if (!username) return null;
  return loadAll()[username.toLowerCase()] || null;
};

export const saveAvatar = (username, dataUrl) => {
  if (!username) return;
  const all = loadAll();
  all[username.toLowerCase()] = dataUrl;
  localStorage.setItem(AVATARS_KEY, JSON.stringify(all));
};
