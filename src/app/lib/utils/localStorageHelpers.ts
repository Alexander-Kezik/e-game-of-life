export const setItem = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItem = (key: string) => {
  return JSON.parse(localStorage.getItem(key) as string);
}

export const resetItems = (key: string) => {
  localStorage.removeItem(key);
}
