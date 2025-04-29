import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then
  // parse stored json or if undefined, return initialValue
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  // State to hold the current value
  const [value, setValue] = useState<T>(initial);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setStoredValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setValue((prevValue) => {
        const newValue = value instanceof Function ? value(prevValue) : value;
        localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    },
    [key] // Only recreate setStoredValue when key changes
  );

  return [value, setStoredValue] as const;
}
