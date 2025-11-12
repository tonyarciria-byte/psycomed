// Advanced Theme Management System
export const THEMES = {
  light: {
    name: 'Claro',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      accent: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      success: '#10B981'
    },
    gradients: {
      primary: 'from-blue-500 to-purple-600',
      secondary: 'from-green-500 to-blue-500',
      surface: 'from-white to-gray-50'
    }
  },
  dark: {
    name: 'Oscuro',
    colors: {
      primary: '#60A5FA',
      secondary: '#A78BFA',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      accent: '#34D399',
      error: '#F87171',
      warning: '#FBBF24',
      success: '#34D399'
    },
    gradients: {
      primary: 'from-blue-600 to-purple-700',
      secondary: 'from-green-600 to-blue-600',
      surface: 'from-gray-900 to-gray-800'
    }
  },
  nature: {
    name: 'Naturaleza',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      background: '#FEFEFE',
      surface: '#F0FDF4',
      text: '#064E3B',
      textSecondary: '#065F46',
      border: '#A7F3D0',
      accent: '#16A34A',
      error: '#DC2626',
      warning: '#D97706',
      success: '#16A34A'
    },
    gradients: {
      primary: 'from-emerald-600 to-teal-600',
      secondary: 'from-green-500 to-emerald-500',
      surface: 'from-green-50 to-emerald-100'
    }
  },
  ocean: {
    name: 'Océano',
    colors: {
      primary: '#0369A1',
      secondary: '#0284C7',
      background: '#FEFEFE',
      surface: '#EFF6FF',
      text: '#0C4A6E',
      textSecondary: '#075985',
      border: '#93C5FD',
      accent: '#0284C7',
      error: '#DC2626',
      warning: '#D97706',
      success: '#059669'
    },
    gradients: {
      primary: 'from-blue-700 to-blue-500',
      secondary: 'from-cyan-500 to-blue-500',
      surface: 'from-blue-50 to-cyan-50'
    }
  },
  sunset: {
    name: 'Atardecer',
    colors: {
      primary: '#DC2626',
      secondary: '#EA580C',
      background: '#FEFEFE',
      surface: '#FEF2F2',
      text: '#7F1D1D',
      textSecondary: '#9A3412',
      border: '#FECACA',
      accent: '#F97316',
      error: '#DC2626',
      warning: '#EA580C',
      success: '#059669'
    },
    gradients: {
      primary: 'from-red-600 to-orange-600',
      secondary: 'from-orange-500 to-red-500',
      surface: 'from-red-50 to-orange-50'
    }
  },
  lavender: {
    name: 'Lavanda',
    colors: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      background: '#FEFEFE',
      surface: '#F3E8FF',
      text: '#581C87',
      textSecondary: '#7C2D92',
      border: '#D8B4FE',
      accent: '#8B5CF6',
      error: '#DC2626',
      warning: '#D97706',
      success: '#059669'
    },
    gradients: {
      primary: 'from-violet-600 to-purple-600',
      secondary: 'from-purple-500 to-violet-500',
      surface: 'from-purple-50 to-violet-50'
    }
  }
};

class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.autoSwitch = false;
    this.customThemes = {};
    this.autoSwitchInterval = null;
    this.isInitialized = false;
  }

  // Initialize theme system
  init() {
    // Check if document exists before initialization
    if (typeof document === 'undefined') {
      console.warn('ThemeManager: Document not available, skipping initialization');
      return;
    }

    try {
      // Load saved theme
      const savedTheme = localStorage.getItem('app-theme') || 'light';
      const savedAutoSwitch = localStorage.getItem('theme-auto-switch') === 'true';

      this.currentTheme = savedTheme;
      this.autoSwitch = savedAutoSwitch;

      this.applyTheme(savedTheme);

      if (savedAutoSwitch) {
        this.setupAutoSwitch();
      }

      // Load custom themes
      const customThemes = localStorage.getItem('custom-themes');
      if (customThemes) {
        this.customThemes = JSON.parse(customThemes);
      }

      this.isInitialized = true;
    } catch (error) {
      console.warn('ThemeManager: Error during initialization:', error);
    }
  }

  // Apply theme to DOM
  applyTheme(themeName) {
    // Check if document and documentElement exist
    if (typeof document === 'undefined' || !document.documentElement) {
      return;
    }

    try {
      // Handle "auto" theme - resolve to actual theme first
      const actualThemeName = themeName === 'auto' ?
        (new Date().getHours() >= 18 || new Date().getHours() <= 6 ? 'dark' : 'light') :
        themeName;
      
      const theme = this.getTheme(actualThemeName);
      if (!theme) return;

      const root = document.documentElement;

      // Apply CSS custom properties for all colors
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      // Apply white/dark classes based on theme
      const isDarkTheme = this.isDarkTheme(actualThemeName);
      if (isDarkTheme) {
        root.classList.remove('white');
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('white');
      }

      // Apply background and text colors globally
      root.style.setProperty('--bg-primary', theme.colors.background);
      root.style.setProperty('--bg-secondary', theme.colors.surface);
      root.style.setProperty('--text-primary', theme.colors.text);
      root.style.setProperty('--text-secondary', theme.colors.textSecondary);
      root.style.setProperty('--border-color', theme.colors.border);

      // Store current theme (keep "auto" if that's what was selected)
      this.currentTheme = themeName;
      localStorage.setItem('app-theme', themeName);
    } catch (error) {
      console.warn('ThemeManager: Error applying theme:', error);
    }
  }

  // Check if theme is dark
  isDarkTheme(themeName) {
    // Handle "auto" theme - determine dark/light based on current time
    if (themeName === 'auto') {
      const hour = new Date().getHours();
      return hour >= 18 || hour <= 6;
    }
    
    const theme = this.getTheme(themeName);
    if (!theme) return false;

    // Consider a theme dark if background is dark
    const bgColor = theme.colors.background;
    return bgColor === '#111827' || bgColor === '#1F2937' || themeName === 'dark';
  }

  // Get theme configuration
  getTheme(themeName) {
    // Handle "auto" theme - should not be stored as a theme itself
    if (themeName === 'auto') {
      // Return current theme based on time if auto is selected
      const hour = new Date().getHours();
      return hour >= 18 || hour <= 6 ? THEMES.dark : THEMES.light;
    }
    return this.customThemes[themeName] || THEMES[themeName] || THEMES.light;
  }

  // Set theme
  setTheme(themeName) {
    // Check if document exists
    if (typeof document === 'undefined' || !document.documentElement) {
      return;
    }

    try {
      // Handle "auto" theme - resolve to actual theme based on time
      if (themeName === 'auto') {
        const hour = new Date().getHours();
        const autoTheme = hour >= 18 || hour <= 6 ? 'dark' : 'light';
        this.applyTheme(autoTheme);
        this.currentTheme = 'auto';
        localStorage.setItem('app-theme', 'auto');
        return;
      }
      
      this.applyTheme(themeName);
    } catch (error) {
      console.warn('ThemeManager: Error setting theme:', error);
    }
  }

  // Get all available themes
  getAllThemes() {
    return { ...THEMES, ...this.customThemes };
  }

  // Create custom theme
  createCustomTheme(name, config) {
    // Validate theme configuration
    if (!this.validateThemeConfig(config)) {
      throw new Error('Invalid theme configuration');
    }

    this.customThemes[name] = {
      name: config.name || name,
      colors: { ...THEMES.light.colors, ...config.colors },
      gradients: { ...THEMES.light.gradients, ...config.gradients }
    };

    // Save to localStorage
    localStorage.setItem('custom-themes', JSON.stringify(this.customThemes));

    return name;
  }

  // Delete custom theme
  deleteCustomTheme(name) {
    if (this.customThemes[name]) {
      delete this.customThemes[name];
      localStorage.setItem('custom-themes', JSON.stringify(this.customThemes));

      // Switch to default if current theme was deleted
      if (this.currentTheme === name) {
        this.setTheme('light');
      }
    }
  }

  // Validate theme configuration
  validateThemeConfig(config) {
    const requiredColors = ['primary', 'background', 'text'];
    return requiredColors.every(color => config.colors && config.colors[color]);
  }

  // Setup automatic theme switching based on time
  setupAutoSwitch() {
    // Clear existing interval first
    this.clearAutoSwitch();
    
    const checkTime = () => {
      // Check if document still exists
      if (typeof document === 'undefined' || !document.documentElement) {
        this.clearAutoSwitch();
        return;
      }

      try {
        const hour = new Date().getHours();
        const isNight = hour >= 18 || hour <= 6;

        if (isNight && this.currentTheme !== 'dark') {
          this.setTheme('dark');
        } else if (!isNight && this.currentTheme === 'dark') {
          this.setTheme('light');
        }
      } catch (error) {
        console.warn('ThemeManager: Error in auto-switch check:', error);
        this.clearAutoSwitch();
      }
    };

    // Check immediately
    checkTime();

    // Check every hour
    this.autoSwitchInterval = setInterval(checkTime, 60 * 60 * 1000);
  }

  // Clear auto-switch interval
  clearAutoSwitch() {
    if (this.autoSwitchInterval) {
      clearInterval(this.autoSwitchInterval);
      this.autoSwitchInterval = null;
    }
  }

  // Toggle auto-switch
  setAutoSwitch(enabled) {
    this.autoSwitch = enabled;
    localStorage.setItem('theme-auto-switch', enabled.toString());

    if (enabled) {
      this.setupAutoSwitch();
    } else {
      this.clearAutoSwitch();
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Check if auto-switch is enabled
  isAutoSwitchEnabled() {
    return this.autoSwitch;
  }

  // Export theme for sharing
  exportTheme(themeName) {
    const theme = this.getTheme(themeName);
    return JSON.stringify(theme, null, 2);
  }

  // Import theme
  importTheme(themeData) {
    try {
      const theme = JSON.parse(themeData);
      if (this.validateThemeConfig(theme)) {
        return this.createCustomTheme(theme.name || 'Imported Theme', theme);
      }
    } catch (error) {
      throw new Error('Invalid theme data');
    }
  }

  // Cleanup method to be called on app unmount
  cleanup() {
    this.clearAutoSwitch();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();
export default themeManager;