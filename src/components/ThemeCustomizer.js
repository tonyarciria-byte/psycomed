import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Save, Download, Upload, Trash2, Check, X, Sun, Moon, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import themeManager, { THEMES } from '../utils/themeManager';

const ThemeCustomizer = memo(({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState(themeManager.getCurrentTheme());
  const [customThemes, setCustomThemes] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [newTheme, setNewTheme] = useState({
    name: '',
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
    }
  });
  const [autoSwitch, setAutoSwitch] = useState(themeManager.isAutoSwitchEnabled());

  useEffect(() => {
    if (isOpen) {
      setSelectedTheme(themeManager.getCurrentTheme());
      setCustomThemes(themeManager.customThemes);
      setAutoSwitch(themeManager.isAutoSwitchEnabled());
    }
  }, [isOpen]);

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    themeManager.setTheme(themeName);
  };

  const handleAutoSwitchToggle = () => {
    const newValue = !autoSwitch;
    setAutoSwitch(newValue);
    themeManager.setAutoSwitch(newValue);
  };

  const handleCreateTheme = () => {
    if (!newTheme.name.trim()) return;

    try {
      const themeName = themeManager.createCustomTheme(newTheme.name, {
        name: newTheme.name,
        colors: newTheme.colors
      });

      setCustomThemes(prev => ({ ...prev, [themeName]: themeManager.getTheme(themeName) }));
      setSelectedTheme(themeName);
      setIsCreating(false);
      setNewTheme({
        name: '',
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
        }
      });
    } catch (error) {
      alert('Error al crear el tema: ' + error.message);
    }
  };

  const handleDeleteTheme = (themeName) => {
    if (window.confirm(`¿Eliminar el tema "${themeName}"?`)) {
      themeManager.deleteCustomTheme(themeName);
      setCustomThemes(prev => {
        const updated = { ...prev };
        delete updated[themeName];
        return updated;
      });

      if (selectedTheme === themeName) {
        setSelectedTheme('light');
        themeManager.setTheme('light');
      }
    }
  };

  const handleExportTheme = (themeName) => {
    const themeData = themeManager.exportTheme(themeName);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeName = themeManager.importTheme(e.target.result);
        setCustomThemes(prev => ({ ...prev, [themeName]: themeManager.getTheme(themeName) }));
        alert('Tema importado exitosamente');
      } catch (error) {
        alert('Error al importar el tema: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const renderColorPicker = (label, colorKey, value, onChange) => (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700w  min-w-20">
        {label}:
      </label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(colorKey, e.target.value)}
        className="w-10 h-10 rounded border border-gray-300  cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(colorKey, e.target.value)}
        className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white  text-gray-900w"
        placeholder="#000000"
      />
    </div>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white  rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900w">
              Personalizar Tema
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Sidebar - Theme List */}
          <div className="w-96 border-r border-gray-200 dark:border-gray-700 p-8 overflow-y-auto">
            <div className="space-y-4">
              {/* Auto Switch Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900w ">Cambio Automático</p>
                    <p className="text-sm text-gray-600w ">Cambia a oscuro por la noche</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSwitch}
                    onChange={handleAutoSwitchToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Built-in Themes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900w mb-3">Temas Predefinidos</h3>
                <div className="space-y-2">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeSelect(key)}
                      className={`w-full p-3 rounded-2xl border-2 transition-all ${
                        selectedTheme === key
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <span className="font-medium text-gray-900w ">{theme.name}</span>
                        </div>
                        {selectedTheme === key && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Themes */}
              {Object.keys(customThemes).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900w mb-3">Temas Personalizados</h3>
                  <div className="space-y-2">
                    {Object.entries(customThemes).map(([key, theme]) => (
                      <motion.button
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleThemeSelect(key)}
                        className={`w-full p-3 rounded-2xl border-2 transition-all ${
                          selectedTheme === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <span className="font-medium text-gray-900w ">{theme.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExportTheme(key);
                              }}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTheme(key);
                              }}
                              className="p-1 hover:bg-red-200 dark:hover:bg-red-900/30 rounded text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            {selectedTheme === key && <Check className="w-4 h-4 text-blue-500" />}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create New Theme */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <AnimatePresence>
                  {!isCreating ? (
                    <motion.button
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsCreating(true)}
                      className="w-full p-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
                    >
                      + Crear Tema Personalizado
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Nombre del tema"
                        value={newTheme.name}
                        onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white text-gray-900w "
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreateTheme}
                          disabled={!newTheme.name.trim()}
                          className="flex-1 px-3 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600 disabled:opacity-50"
                        >
                          <Save className="w-4 h-4 inline mr-2" />
                          Crear
                        </button>
                        <button
                          onClick={() => setIsCreating(false)}
                          className="px-3 py-2 bg-gray-500 text-white rounded font-medium hover:bg-gray-600"
                        >
                          <X className="w-4 h-4 inline mr-2" />
                          Cancelar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Import/Export */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportTheme}
                    className="hidden"
                  />
                  <div className="w-full p-3 border-2 border-dashed border-gray-300  rounded-2xl text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400w" />
                    <span className="text-sm text-gray-600w ">Importar Tema</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content - Color Customization */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence>
              {isCreating ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-gray-900w">Personalizar Colores</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderColorPicker('Primario', 'primary', newTheme.colors.primary,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Secundario', 'secondary', newTheme.colors.secondary,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Fondo', 'background', newTheme.colors.background,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Superficie', 'surface', newTheme.colors.surface,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Texto', 'text', newTheme.colors.text,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Texto Secundario', 'textSecondary', newTheme.colors.textSecondary,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Bordes', 'border', newTheme.colors.border,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Éxito', 'success', newTheme.colors.success,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Advertencia', 'warning', newTheme.colors.warning,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                    {renderColorPicker('Error', 'error', newTheme.colors.error,
                      (key, value) => setNewTheme(prev => ({
                        ...prev,
                        colors: { ...prev.colors, [key]: value }
                      }))
                    )}
                  </div>

                  {/* Preview */}
                  <div className="mt-8 p-6 rounded-lg border border-gray-200 "
                       style={{ backgroundColor: newTheme.colors.surface }}>
                    <h4 className="text-lg font-semibold mb-4"
                        style={{ color: newTheme.colors.text }}>
                      Vista Previa
                    </h4>
                    <div className="space-y-3">
                      <div className="h-4 rounded"
                           style={{ backgroundColor: newTheme.colors.primary }} />
                      <p style={{ color: newTheme.colors.text }}>
                        Texto principal con color 
                      <span style={{ color: newTheme.colors.secondary }}>secundario</span>.
                      </p>
                      <p style={{ color: newTheme.colors.textSecondary }}>
                        Texto secundario
                      </p>
                      <button
                        className="px-4 py-2 rounded text-white"
                        style={{ backgroundColor: newTheme.colors.accent }}
                      >
                        Botón de Acento
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center py-12"
                >
                  <Palette className="w-16 h-16 text-gray-400w mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900w mb-2">
                    Selecciona un Tema
                  </h3>
                  <p className="text-gray-600w ">
                    Elige un tema de la lista o crea uno personalizado para personalizar tu experiencia.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ThemeCustomizer.displayName = 'ThemeCustomizer';

export default ThemeCustomizer;