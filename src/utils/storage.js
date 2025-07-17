const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      // Try to parse as JSON, but return the raw string if that fails
      try {
        return JSON.parse(item);
      } catch (e) {
        // If it's not valid JSON, just return the string value
        return item;
      }
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      // Handle string vs object values
      const valueToStore =
        typeof value === "string" ? value : JSON.stringify(value);

      localStorage.setItem(key, valueToStore);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },
};

export { storage };
