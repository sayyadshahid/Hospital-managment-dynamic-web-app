import { useState } from "react";

const useLocalStorage = (key, defaultValue) => {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  const setLocalStorageStateValue = (valueOrFn) => {
    const newValue =
      typeof valueOrFn === "function"
        ? valueOrFn(localStorageValue)
        : valueOrFn;

    try {
      localStorage.setItem(key, JSON.stringify(newValue));
      setLocalStorageValue(newValue);
    } catch (error) {
      console.error("Failed to set localStorage:", error);
    }
  };

  const remove = () => {
    localStorage.removeItem(key);
    setLocalStorageValue(null);
  };

  return [localStorageValue, setLocalStorageStateValue, remove];
};

export default useLocalStorage;
