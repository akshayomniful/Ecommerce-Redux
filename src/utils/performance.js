// Batch processing utility for large datasets
export const processBatch = (items, batchSize, processFn) => {
  return new Promise((resolve) => {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    let currentBatch = 0;

    const processNextBatch = () => {
      if (currentBatch >= batches.length) {
        resolve();
        return;
      }

      const batch = batches[currentBatch++];

      // Use requestIdleCallback to process during idle periods
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          processFn(batch);
          processNextBatch();
        });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(() => {
          processFn(batch);
          processNextBatch();
        }, 0);
      }
    };

    processNextBatch();
  });
};

// Debounce function
export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// Throttle function
export const throttle = (fn, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < limit) return;
    lastCall = now;
    return fn.apply(this, args);
  };
};

// Memoize function results
export const memoize = (fn) => {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};
