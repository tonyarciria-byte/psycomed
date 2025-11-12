import {
  encryptData,
  decryptData,
  validateMoodEntry,
  validateUserProfile,
  sanitizeInput
} from '../security';

describe('Security Utils', () => {
  describe('Data Encryption', () => {
    test('should encrypt and decrypt data correctly', () => {
      const testData = { message: 'Hello World', number: 42 };
      const encrypted = encryptData(testData);
      const decrypted = decryptData(encrypted);

      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(JSON.stringify(testData));
      expect(decrypted).toEqual(testData);
    });

    test('should handle encryption errors gracefully', () => {
      const result = encryptData(null);
      expect(result).toBeNull();
    });

    test('should handle decryption errors gracefully', () => {
      const result = decryptData('invalid-encrypted-data');
      expect(result).toBeNull();
    });
  });

  describe('Data Validation', () => {
    test('should validate correct mood entry', () => {
      const validEntry = {
        rating: 10,
        tags: ['feliz', 'motivado'],
        note: 'Día excelente',
        sleepQuality: 4,
        date: '2024-01-01'
      };

      const errors = validateMoodEntry(validEntry);
      expect(errors).toHaveLength(0);
    });

    test('should reject invalid mood rating', () => {
      const invalidEntry = {
        rating: 25, // Invalid rating
        tags: ['feliz'],
        note: 'Test',
        sleepQuality: 3,
        date: '2024-01-01'
      };

      const errors = validateMoodEntry(invalidEntry);
      expect(errors).toContain('Rating must be between 1 and 20');
    });

    test('should reject too many tags', () => {
      const invalidEntry = {
        rating: 10,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'], // Too many tags
        note: 'Test',
        sleepQuality: 3,
        date: '2024-01-01'
      };

      const errors = validateMoodEntry(invalidEntry);
      expect(errors).toContain('Maximum 5 tags allowed');
    });

    test('should validate correct user profile', () => {
      const validProfile = {
        name: 'Juan Pérez',
        age: 30,
        country: 'Colombia'
      };

      const errors = validateUserProfile(validProfile);
      expect(errors).toHaveLength(0);
    });

    test('should reject invalid user profile', () => {
      const invalidProfile = {
        name: 'A', // Too short
        age: 150, // Too old
        country: '' // Empty
      };

      const errors = validateUserProfile(invalidProfile);
      expect(errors).toContain('Name must be at least 2 characters');
      expect(errors).toContain('Age must be between 13 and 120');
      expect(errors).toContain('Country is required');
    });
  });

  describe('Input Sanitization', () => {
    test('should sanitize malicious input', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const sanitized = sanitizeInput(maliciousInput);

      expect(sanitized).toBe('Hello World');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
    });

    test('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });

    test('should trim whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeInput(input);

      expect(sanitized).toBe('Hello World');
    });
  });
});