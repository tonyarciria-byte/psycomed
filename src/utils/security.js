import CryptoJS from 'crypto-js';

// Encryption utilities
export const encryptData = (data, key = 'psicomed-secret-key') => {
  if (data === null || data === undefined) {
    return null;
  }
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptData = (encryptedData, key = 'psicomed-secret-key') => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Data validation
export const validateMoodEntry = (entry) => {
  const errors = [];

  if (!entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
    errors.push('Invalid date format');
  }

  if (!entry.rating || entry.rating < 1 || entry.rating > 20) {
    errors.push('Rating must be between 1 and 20');
  }

  if (entry.tags && !Array.isArray(entry.tags)) {
    errors.push('Tags must be an array');
  }

  if (entry.tags && entry.tags.length > 5) {
    errors.push('Maximum 5 tags allowed');
  }

  if (entry.sleepQuality && (entry.sleepQuality < 1 || entry.sleepQuality > 5)) {
    errors.push('Sleep quality must be between 1 and 5');
  }

  return errors;
};

export const validateUserProfile = (profile) => {
  const errors = [];

  if (!profile.name || profile.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!profile.age || profile.age < 13 || profile.age > 120) {
    errors.push('Age must be between 13 and 120');
  }

  if (!profile.country || profile.country.trim().length < 2) {
    errors.push('Country is required');
  }

  return errors;
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
};

// Rate limiting (simple implementation)
const requestCounts = new Map();

export const checkRateLimit = (identifier, maxRequests = 10, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!requestCounts.has(identifier)) {
    requestCounts.set(identifier, []);
  }

  const requests = requestCounts.get(identifier);
  const recentRequests = requests.filter(time => time > windowStart);

  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  recentRequests.push(now);
  requestCounts.set(identifier, recentRequests);

  return true; // Within limits
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = encryptData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  },

  getItem: (key) => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decryptData(encrypted);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};