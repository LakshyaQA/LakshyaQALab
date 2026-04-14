import { useState } from 'react'

/**
 * A custom hook to sync state with either localStorage or sessionStorage.
 * Useful for testing data persistence scenarios.
 *
 * @param {string} key - The storage key
 * @param {any} initialValue - Default value if nothing in storage
 * @param {string} storageType - 'local' | 'session'
 */
export function useStorage(key, initialValue, storageType = 'local') {
  const getStorage = () => (storageType === 'session' ? window.sessionStorage : window.localStorage)

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const storage = getStorage()
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      const storage = getStorage()
      if (valueToStore === undefined || valueToStore === null) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error configuring storage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
