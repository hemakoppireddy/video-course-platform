export function getLocal(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

export function setLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
