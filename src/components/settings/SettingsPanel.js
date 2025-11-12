import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, Palette, Bell, Globe, Key, Info, HelpCircle,
  Check, X, ChevronRight, ChevronDown, Phone, Mail,
  Eye, EyeOff, Smartphone, Fingerprint, Save, ArrowLeft,
  CheckCircle, AlertTriangle, Clock, Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { contactsManager } from '../../utils/contactsManager';
import { themeManager } from '../../utils/themeManager';

// Lazy load sub-panels for better performance
const ProfilePanel = lazy(() => import('./ProfilePanel'));
// Security panel implementation
const SecurityPanel = ({ userProfile, setUserProfile, onUnsavedChanges }) => {
  const { t } = useTranslation();
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(userProfile.twoFactorEnabled || false);
  const [biometricEnabled, setBiometricEnabled] = useState(userProfile.biometricEnabled || false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedProfile(userProfile);
    setTwoFactorEnabled(userProfile.twoFactorEnabled || false);
    setBiometricEnabled(userProfile.biometricEnabled || false);
  }, [userProfile]);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    onUnsavedChanges(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validatePasswordChange = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validatePasswordChange()) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        setUserProfile(prev => ({
          ...prev,
          twoFactorEnabled,
          biometricEnabled,
          lastPasswordChange: new Date().toISOString()
        }));
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onUnsavedChanges(false);
        setIsSaving(false);
      }, 1000);
    }
  };

  const handleTwoFactorToggle = () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    setUserProfile(prev => ({ ...prev, twoFactorEnabled: newValue }));
    onUnsavedChanges(true);
  };

  const handleBiometricToggle = () => {
    const newValue = !biometricEnabled;
    setBiometricEnabled(newValue);
    setUserProfile(prev => ({ ...prev, biometricEnabled: newValue }));
    onUnsavedChanges(true);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleViewActiveSessions = () => {
    // Simular vista de sesiones activas
    const sessions = [
      { id: 1, device: 'iPhone 13', location: 'Bogotá, Colombia', lastActive: 'Ahora', isActive: true },
      { id: 2, device: 'Chrome en Windows', location: 'Medellín, Colombia', lastActive: 'Hace 2 horas', isActive: true },
      { id: 3, device: 'Safari en Mac', location: 'Cali, Colombia', lastActive: 'Hace 1 día', isActive: false }
    ];

    const sessionList = sessions.map(session =>
      `• ${session.device}\n  📍 ${session.location}\n  🕐 ${session.lastActive}\n  ${session.isActive ? '🟢 Activa' : '🔴 Inactiva'}\n`
    ).join('\n');

    const message = `Sesiones Activas de tu Cuenta:\n\n${sessionList}\n¿Deseas cerrar todas las sesiones excepto la actual?`;
    
    if (window.confirm(message)) {
      alert('Todas las sesiones han sido cerradas. Solo mantienes la sesión actual activa.');
    }
  };

  const handleViewSecurityHistory = () => {
    // Simular historial de seguridad
    const history = [
      { id: 1, action: 'Cambio de contraseña', date: '2024-11-08 14:30', ip: '192.168.1.100', status: 'Exitosa' },
      { id: 2, action: 'Inicio de sesión', date: '2024-11-08 09:15', ip: '192.168.1.100', status: 'Exitosa' },
      { id: 3, action: 'Activación 2FA', date: '2024-11-07 16:45', ip: '192.168.1.100', status: 'Exitosa' },
      { id: 4, action: 'Intento de acceso fallido', date: '2024-11-06 22:30', ip: '203.0.113.42', status: 'Bloqueada' },
      { id: 5, action: 'Exportación de datos', date: '2024-11-05 11:20', ip: '192.168.1.100', status: 'Exitosa' }
    ];

    const historyList = history.map(event =>
      `• ${event.action}\n  📅 ${event.date}\n  🌐 ${event.ip}\n  ${event.status === 'Exitosa' ? '✅' : '❌'} ${event.status}\n`
    ).join('\n');

    alert(`Historial de Seguridad:\n\n${historyList}\nLos eventos más antiguos se eliminan automáticamente después de 90 días por seguridad.`);
  };

  const handleExportData = () => {
    // Simular exportación de datos del usuario
    const userData = {
      profile: userProfile,
      exportDate: new Date().toISOString(),
      dataTypes: [
        'Información personal y diagnóstico',
        'Historial de estados de ánimo',
        'Entradas de diario',
        'Configuración y preferencias',
        'Contactos de emergencia',
        'Registro de medicación',
        'Estadísticas de uso'
      ]
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `psicomed-data-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    alert('📁 Datos exportados exitosamente!\n\nSe ha descargado un archivo JSON con toda tu información personal, incluyendo:\n• Perfil y configuración\n• Historial médico\n• Preferencias de usuario\n• Datos de actividad\n\nPor seguridad, este archivo contiene información sensible. Guárdalo en un lugar seguro.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
      role="main"
      aria-labelledby="security-title"
    >
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-blue-500" aria-hidden="true" />
        <h2 id="security-title" className="text-2xl font-bold text-gray-900www">
          Seguridad
        </h2>
      </div>

      {/* Change Password Section */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-700www-24 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-gray-500www-24" aria-hidden="true" />
          Cambiar Contraseña
        </h3>
        <div className="space-y-4" role="form" aria-labelledby="password-form">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-600ww mb-2">
              Contraseña Actual*
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                aria-invalid={errors.currentPassword ? 'true' : 'false'}
                aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } bg-white  text-gray-900ww dark:text-white`}
                placeholder="Ingresa tu contraseña actual"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400ww hover:text-gray-600ww dark:text-gray-300w dark:hover:text-gray-100w focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={showPasswords.current ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p id="current-password-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-600ww mb-2">
              Nueva Contraseña*
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                aria-invalid={errors.newPassword ? 'true' : 'false'}
                aria-describedby={errors.newPassword ? 'new-password-error' : undefined}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300 '
                } bg-whitetext-gray-900ww dark:text-white`}
                placeholder="Ingresa tu nueva contraseña"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400ww hover:text-gray-600ww dark:text-gray-300w dark:hover:text-gray-100w focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={showPasswords.new ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p id="new-password-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-600ww mb-2">
              Confirmar Nueva Contraseña*
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } bg-white text-gray-900ww dark:text-white`}
                placeholder="Confirma tu nueva contraseña"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400ww hover:text-gray-600ww dark:text-gray-300w dark:hover:text-gray-100w focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={showPasswords.confirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="text-red-500 text-sm mt-1" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www-24 mb-4 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-green-500" aria-hidden="true" />
          Autenticación de Dos Factores
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700www">
              {twoFactorEnabled ? 'Activada' : 'Desactivada'}
            </p>
            <p className="text-sm text-gray-500www">
              Agrega una capa adicional de seguridad a tu cuenta
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
              className="sr-only peer"
              aria-describedby="twofactor-description"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p id="twofactor-description" className="sr-only">
          {twoFactorEnabled ? 'La autenticación de dos factores está activada' : 'La autenticación de dos factores está desactivada'}
        </p>
      </div>

      {/* Biometric Authentication */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www-24 mb-4 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-purple-500" aria-hidden="true" />
          Autenticación Biométrica
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700www">
              {biometricEnabled ? 'Activada' : 'Desactivada'}
            </p>
            <p className="text-sm text-gray-600www">
              Usa tu huella digital o reconocimiento facial
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={biometricEnabled}
              onChange={handleBiometricToggle}
              className="sr-only peer"
              aria-describedby="biometric-description"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <p id="biometric-description" className="sr-only">
          {biometricEnabled ? 'La autenticación biométrica está activada' : 'La autenticación biométrica está desactivada'}
        </p>
      </div>

      {/* Security Actions */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www  mb-4">
          Acciones de Seguridad
        </h3>
        <div className="space-y-3" role="group" aria-label="Acciones de seguridad">
          <button
            onClick={handleViewActiveSessions}
            className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:bg-gray-50  transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ver sesiones activas y dispositivos conectados"
          >
            <p className="font-medium text-gray-900www ">Ver sesiones activas</p>
            <p className="text-sm text-gray-600www ">Administra dispositivos conectados a tu cuenta</p>
          </button>
          <button
            onClick={handleViewSecurityHistory}
            className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ver historial de cambios de seguridad"
          >
            <p className="font-medium text-gray-900www ">Historial de seguridad</p>
            <p className="text-sm text-gray-600www">Revisa cambios recientes en tu cuenta</p>
          </button>
          <button
            onClick={handleExportData}
            className="w-full p-3 text-left bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Exportar y descargar mis datos"
          >
            <p className="font-medium text-gray-900www">Exportar datos</p>
            <p className="text-sm text-gray-600www ">Descarga una copia de tus datos</p>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-700 ">
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: isSaving ? 1 : 1.05 }}
          whileTap={{ scale: isSaving ? 1 : 0.95 }}
          className="px-6 py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          aria-describedby="save-button-description"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" aria-hidden="true" />
              Guardar Cambios
            </>
          )}
        </motion.button>
        <p id="save-button-description" className="sr-only">
          {isSaving ? 'Guardando configuración de seguridad' : 'Guardar cambios en la configuración de seguridad'}
        </p>
      </div>
    </motion.div>
  );
};

const AppearancePanel = ({ theme, onThemeChange, userProfile, setUserProfile, onUnsavedChanges }) => {
  const { t } = useTranslation();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localFontSize, setLocalFontSize] = useState(userProfile.fontSize || 'medium');
  const [localAnimations, setLocalAnimations] = useState(userProfile.animationsEnabled !== false);
  const [localHighContrast, setLocalHighContrast] = useState(userProfile.highContrast || false);
  const [isApplyingTheme, setIsApplyingTheme] = useState(false);

  // Synchronize local state with props
  useEffect(() => {
    setLocalTheme(theme);
    setLocalFontSize(userProfile.fontSize || 'medium');
    setLocalAnimations(userProfile.animationsEnabled !== false);
    setLocalHighContrast(userProfile.highContrast || false);
  }, [theme, userProfile]);

  // Theme change handler with error handling and feedback
  const handleThemeChange = async (newTheme) => {
    setIsApplyingTheme(true);
    setLocalTheme(newTheme);
    
    try {
      // Apply theme using themeManager
      await themeManager.setTheme(newTheme);
      
      // Update user profile for persistence
      setUserProfile(prev => ({ ...prev, preferredTheme: newTheme }));
      
      // Notify parent of unsaved changes
      onUnsavedChanges(true);
      
      // Show feedback during transition
      setTimeout(() => {
        setIsApplyingTheme(false);
        onUnsavedChanges(false);
      }, 300);
    } catch (error) {
      console.error('Error applying theme:', error);
      setIsApplyingTheme(false);
    }
  };

  // Font size change handler
  const handleFontSizeChange = (event) => {
    const newSize = event.target.value;
    setLocalFontSize(newSize);
    
    // Update user profile
    setUserProfile(prev => ({ ...prev, fontSize: newSize }));
    
    // Notify parent of changes
    onUnsavedChanges(true);
  };

  // Animations toggle handler
  const handleAnimationsToggle = () => {
    const newValue = !localAnimations;
    setLocalAnimations(newValue);
    
    // Update user profile
    setUserProfile(prev => ({ ...prev, animationsEnabled: newValue }));
    
    // Notify parent of changes
    onUnsavedChanges(true);
  };

  // High contrast toggle handler
  const handleHighContrastToggle = () => {
    const newValue = !localHighContrast;
    setLocalHighContrast(newValue);
    
    // Update user profile
    setUserProfile(prev => ({ ...prev, highContrast: newValue }));
    
    // Notify parent of changes
    onUnsavedChanges(true);
  };

  // Open theme customizer handler
  const openThemeCustomizer = () => {
    if (window.openThemeCustomizer) {
      window.openThemeCustomizer();
    }
  };

  // Theme preview colors generator
  const previewThemeColors = (themeName) => {
    const themeColorMap = {
      light: { primary: 'bg-blue-500', secondary: 'bg-gray-100', accent: 'bg-green-500' },
      dark: { primary: 'bg-blue-600', secondary: 'bg-gray-800', accent: 'bg-green-600' },
      nature: { primary: 'bg-emerald-600', secondary: 'bg-emerald-50', accent: 'bg-green-500' },
      ocean: { primary: 'bg-blue-700', secondary: 'bg-blue-50', accent: 'bg-cyan-500' },
      sunset: { primary: 'bg-red-600', secondary: 'bg-red-50', accent: 'bg-orange-500' },
      lavender: { primary: 'bg-violet-600', secondary: 'bg-purple-50', accent: 'bg-purple-500' }
    };
    
    return themeColorMap[themeName] || themeColorMap.light;
  };

  return (
    <div className="space-y-8">
      {/* Header Section - Removed to let SettingsPanel handle navigation */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-900www text-2xl font-bold">Personaliza cómo se ve </p>
          <p className="text-gray-600www text-2xl ">y se siente tu aplicación</p>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-500" />
          Tema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Light Theme Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeChange('light')}
            disabled={isApplyingTheme}
            className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
              localTheme === 'light'
                ? 'border-cyan-500 bg-gradient-to-br from-cyan-400 to-blue-500'
                : 'border-gray-200 hover:border-cyan-300 hover:bg-gradient-to-br hover:from-cyan-100 hover:to-blue-100 text-gray-700ww'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                <span className="font-medium text-cyan-300">
                  Claro
                </span>
              </div>
              {localTheme === 'light' && !isApplyingTheme && (
                <CheckCircle className="w-4 h-4 text-cyan-100" />
              )}
            </div>
            <p className="text-sm text-cyan-300/90">Tema luminoso y fresco</p>
          </motion.button>

          {/* Dark Theme Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeChange('dark')}
            disabled={isApplyingTheme}
            className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
              localTheme === 'dark'
                ? 'border-purple-500 bg-gradient-to-br from-purple-600 to-purple-800'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-100 hover:to-purple-200 text-gray-700ww'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-800"></div>
                <span className="font-medium text-purple-600">
                  Oscuro
                </span>
              </div>
              {localTheme === 'dark' && !isApplyingTheme && (
                <CheckCircle className="w-4 h-4 text-purple-100" />
              )}
            </div>
            <p className="text-sm text-purple-400/90">Tema de fácil lectura</p>
          </motion.button>

          {/* Auto Theme Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleThemeChange('auto')}
            disabled={isApplyingTheme}
            className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
              localTheme === 'auto'
                ? 'border-gray-400 bg-gradient-to-br from-gray-400 to-gray-600'
                : 'border-gray-200 hover:border-gray-400 hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-300 text-gray-700ww'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-500 border border-gray-400"></div>
                <span className="font-medium text-gray-300w">Automático</span>
              </div>
              {localTheme === 'auto' && !isApplyingTheme && (
                <Clock className="w-4 h-4 text-gray-100w" />
              )}
            </div>
            <p className="text-sm text-gray-400ww/90">Cambia con el horario</p>
          </motion.button>
        </div>

        {/* Advanced Theme Customizer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openThemeCustomizer}
            disabled={isApplyingTheme}
            className="w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isApplyingTheme ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Aplicando tema...
              </>
            ) : (
              <>
                <Palette className="w-5 h-5" />
                Personalizar Tema Avanzado
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Typography Settings */}
      <div className="bg-white rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-500"/>
          <span className="text-2xl">Tipografía</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700www mb-2">
              Tamaño de Fuente
            </label>
            <select
              value={localFontSize}
              onChange={handleFontSizeChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900www">
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
              <option value="extra-large">Extra Grande</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-green-500" />
          Accesibilidad
        </h3>
        <div className="space-y-4">
          {/* High Contrast Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900www">Alto Contraste</p>
              <p className="text-sm text-gray-600www">
                Mejora la legibilidad para personas con dificultades visuales
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localHighContrast}
                onChange={handleHighContrastToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Animations Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900www">Animaciones</p>
              <p className="text-sm text-gray-600www">
                Activa o desactiva las transiciones y animaciones
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localAnimations}
                onChange={handleAnimationsToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900www mb-4">Vista Previa</h3>
        
        <div
          className={`p-4 rounded-lg border ${
            localHighContrast
              ? 'bg-black border-white'
              : 'bg-gray-50 text-gray-900www border-gray-300'
          }`}
          style={{
            fontSize: localFontSize === 'small' ? '14px' :
                     localFontSize === 'medium' ? '16px' :
                     localFontSize === 'large' ? '18px' :
                     localFontSize === 'extra-large' ? '20px' : '16px'
          }}
        >
          <h4 className="font-bold mb-2">Título de Ejemplo</h4>
          <p className="mb-2">Este es un párrafo de ejemplo para mostrar cómo se verá el texto con la configuración actual.</p>
          <button className="px-4 py-2 text-white rounded transition-colors bg-blue-500 hover:bg-blue-600">
            Botón de Ejemplo
          </button>
        </div>
        
        {/* Theme Status Indicator */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium">
              Tema actual: {localTheme === 'auto' ? 'Automático' : localTheme.charAt(0).toUpperCase() + localTheme.slice(1)}
            </span>
            {isApplyingTheme && (
              <div className="ml-auto flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                <span className="text-xs">Aplicando...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications panel implementation
const NotificationsPanel = ({ userProfile, setUserProfile, onUnsavedChanges }) => {
  const { t } = useTranslation();
  
  // Initialize state with proper fallbacks
  const [notifications, setNotifications] = useState({
    moodReminders: typeof userProfile.notifications === 'boolean' ? userProfile.notifications : userProfile.notifications?.moodReminders || true,
    medicationReminders: typeof userProfile.reminders === 'boolean' ? userProfile.reminders : userProfile.notifications?.medicationReminders || false,
    appointmentReminders: userProfile.notifications?.appointmentReminders || false,
    emergencyAlerts: userProfile.notifications?.emergencyAlerts || true,
    progressUpdates: userProfile.notifications?.progressUpdates || true,
    weeklyReports: userProfile.notifications?.weeklyReports || false,
    motivationalTips: userProfile.notifications?.motivationalTips || true,
    customReminders: userProfile.notifications?.customReminders || []
  });
  
  const [notificationTime, setNotificationTime] = useState(
    userProfile.notifications?.time || '09:00'
  );
  
  const [quietHours, setQuietHours] = useState({
    enabled: userProfile.notifications?.quietHours?.enabled || false,
    start: userProfile.notifications?.quietHours?.start || '22:00',
    end: userProfile.notifications?.quietHours?.end || '08:00'
  });

  useEffect(() => {
    setNotifications({
      moodReminders: typeof userProfile.notifications === 'boolean' ? userProfile.notifications : userProfile.notifications?.moodReminders || true,
      medicationReminders: typeof userProfile.reminders === 'boolean' ? userProfile.reminders : userProfile.notifications?.medicationReminders || false,
      appointmentReminders: userProfile.notifications?.appointmentReminders || false,
      emergencyAlerts: userProfile.notifications?.emergencyAlerts || true,
      progressUpdates: userProfile.notifications?.progressUpdates || true,
      weeklyReports: userProfile.notifications?.weeklyReports || false,
      motivationalTips: userProfile.notifications?.motivationalTips || true,
      customReminders: userProfile.notifications?.customReminders || []
    });
    setNotificationTime(userProfile.notifications?.time || '09:00');
    setQuietHours({
      enabled: userProfile.notifications?.quietHours?.enabled || false,
      start: userProfile.notifications?.quietHours?.start || '22:00',
      end: userProfile.notifications?.quietHours?.end || '08:00'
    });
  }, [userProfile]);

  const handleNotificationToggle = (type) => {
    const newValue = !notifications[type];
    
    setNotifications(prev => ({ ...prev, [type]: newValue }));
    setUserProfile(prev => {
      const updatedProfile = { ...prev };
      
      // Update top-level properties for ProfileScreen compatibility
      if (type === 'moodReminders') {
        updatedProfile.notifications = newValue; // Top-level notifications property
      } else if (type === 'medicationReminders') {
        updatedProfile.reminders = newValue; // Top-level reminders property
      }
      
      // Also update nested structure for internal consistency
      if (type === 'moodReminders' || type === 'medicationReminders') {
        // Keep both top-level boolean and nested structure in sync
        const nestedNotifications = {
          ...prev.notifications,
          [type]: newValue,
          moodReminders: type === 'moodReminders' ? newValue : (typeof prev.notifications === 'object' ? prev.notifications.moodReminders : prev.notifications),
          medicationReminders: type === 'medicationReminders' ? newValue : (typeof prev.notifications === 'object' ? prev.notifications.medicationReminders : prev.reminders)
        };
        updatedProfile.notifications = nestedNotifications;
      }
      
      return updatedProfile;
    });
    onUnsavedChanges(true);
  };

  const handleTimeChange = (field, value) => {
    if (field === 'time') {
      setNotificationTime(value);
      setUserProfile(prev => ({
        ...prev,
        notifications: { ...prev.notifications, time: value }
      }));
    } else {
      setQuietHours(prev => ({ ...prev, [field]: value }));
      setUserProfile(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          quietHours: { ...prev.notifications?.quietHours, [field]: value }
        }
      }));
    }
    onUnsavedChanges(true);
  };

  const handleQuietHoursToggle = () => {
    const newValue = !quietHours.enabled;
    setQuietHours(prev => ({ ...prev, enabled: newValue }));
    setUserProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        quietHours: { ...prev.notifications?.quietHours, enabled: newValue }
      }
    }));
    onUnsavedChanges(true);
  };

  const addCustomReminder = () => {
    const newReminder = {
      id: Date.now(),
      title: '',
      time: '12:00',
      days: [],
      enabled: true
    };
    
    setNotifications(prev => ({
      ...prev,
      customReminders: [...prev.customReminders, newReminder]
    }));
    onUnsavedChanges(true);
  };

  const updateCustomReminder = (id, field, value) => {
    setNotifications(prev => ({
      ...prev,
      customReminders: prev.customReminders.map(reminder =>
        reminder.id === id ? { ...reminder, [field]: value } : reminder
      )
    }));
    onUnsavedChanges(true);
  };

  const removeCustomReminder = (id) => {
    setNotifications(prev => ({
      ...prev,
      customReminders: prev.customReminders.filter(reminder => reminder.id !== id)
    }));
    onUnsavedChanges(true);
  };

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900ww">
          Notificaciones
        </h2>
      </div>

      {/* Notification Types */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900ww mb-4">
          Notificaciones Principales
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700ww">Notificaciones</p>
              <p className="text-sm text-gray-500ww">
                Recordatorios de estado de ánimo
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.moodReminders}
                onChange={() => handleNotificationToggle('moodReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700ww">Recordatorios</p>
              <p className="text-sm text-gray-500ww">
                Alertas de medicación
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.medicationReminders}
                onChange={() => handleNotificationToggle('medicationReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Additional Notification Types */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900ww mb-4">
          Otras Notificaciones
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-600ww">Recordatorios de Citas</p>
              <p className="text-sm text-gray-400ww">
                Notifica sobre próximas citas médicas
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.appointmentReminders}
                onChange={() => handleNotificationToggle('appointmentReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-600ww">Recordatorios de Citas</p>
              <p className="text-sm text-gray-400ww">
                Notifica sobre próximas citas médicas
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.appointmentReminders}
                onChange={() => handleNotificationToggle('appointmentReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-600ww ">Alertas de Emergencia</p>
              <p className="text-sm text-gray-400ww">
                Notificaciones urgentes de crisis
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emergencyAlerts}
                onChange={() => handleNotificationToggle('emergencyAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-600ww ">Actualizaciones de Progreso</p>
              <p className="text-sm text-gray-400ww">
                Resúmenes de tu progreso y mejoras
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.progressUpdates}
                onChange={() => handleNotificationToggle('progressUpdates')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-600ww ">Reportes Semanales</p>
              <p className="text-sm text-gray-400ww ">
                Resumen semanal de tu bienestar
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weeklyReports}
                onChange={() => handleNotificationToggle('weeklyReports')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-600ww">Tips Motivacionales</p>
              <p className="text-sm text-gray-400ww ">
                Consejos diarios para tu bienestar mental
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.motivationalTips}
                onChange={() => handleNotificationToggle('motivationalTips')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900wwmb-4">
          Horario de Notificaciones
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400ww mb-2">
              Hora Predeterminada
            </label>
            <input
              type="time"
              value={notificationTime}
              onChange={(e) => handleTimeChange('time', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900ww "
            />
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700ww mb-3">Horas de Silencio</h4>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600ww">
                Activar horas de silencio
              </p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={quietHours.enabled}
                  onChange={handleQuietHoursToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-600"></div>
              </label>
            </div>
            
            {quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700wwmb-1">
                    Desde
                  </label>
                  <input
                    type="time"
                    value={quietHours.start}
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900ww dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700ww dark:text-gray-300w mb-1">
                    Hasta
                  </label>
                  <input
                    type="time"
                    value={quietHours.end}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900ww dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Reminders */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900ww">
            Recordatorios Personalizados
          </h3>
          <motion.button
            onClick={addCustomReminder}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
          >
            Agregar
          </motion.button>
        </div>
        
        <div className="space-y-3">
          {notifications.customReminders.map((reminder) => (
            <div key={reminder.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700ww mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={reminder.title}
                    onChange={(e) => updateCustomReminder(reminder.id, 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900ww dark:text-white"
                    placeholder="Recordatorio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700ww mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateCustomReminder(reminder.id, 'time', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900ww dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700ww mb-1">
                    Días
                  </label>
                  <div className="flex gap-1">
                    {daysOfWeek.map((day, index) => (
                      <button
                        key={day}
                        onClick={() => {
                          const newDays = reminder.days.includes(index)
                            ? reminder.days.filter(d => d !== index)
                            : [...reminder.days, index];
                          updateCustomReminder(reminder.id, 'days', newDays);
                        }}
                        className={`w-8 h-8 rounded text-xs font-medium ${
                          reminder.days.includes(index)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700ww'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.enabled}
                      onChange={(e) => updateCustomReminder(reminder.id, 'enabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <button
                    onClick={() => removeCustomReminder(reminder.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {notifications.customReminders.length === 0 && (
            <p className="text-gray-500ww text-center py-4">
              No hay recordatorios personalizados. Haz clic en "Agregar" para crear uno.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Emergency contacts panel implementation
const EmergencyPanel = ({ userProfile, setUserProfile, onUnsavedChanges }) => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState(
    userProfile.emergencyContacts || [
      { id: 1, name: '', phone: '', relationship: '', isActive: true }
    ]
  );
  const [quickDialEnabled, setQuickDialEnabled] = useState(
    userProfile.quickDialEnabled || false
  );

  useEffect(() => {
    setContacts(
      userProfile.emergencyContacts || [
        { id: 1, name: '', phone: '', relationship: '', isActive: true }
      ]
    );
    setQuickDialEnabled(userProfile.quickDialEnabled || false);
  }, [userProfile]);

  const addContact = () => {
    const newContact = {
      id: Date.now(),
      name: '',
      phone: '',
      relationship: '',
      isActive: true
    };
    
    setContacts(prev => [...prev, newContact]);
    onUnsavedChanges(true);
  };

  const updateContact = (id, field, value) => {
    setContacts(prev => prev.map(contact =>
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
    onUnsavedChanges(true);
  };

  const removeContact = (id) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    onUnsavedChanges(true);
  };

  const toggleContactActive = (id) => {
    setContacts(prev => prev.map(contact =>
      contact.id === id ? { ...contact, isActive: !contact.isActive } : contact
    ));
    onUnsavedChanges(true);
  };

  const handleQuickDialToggle = () => {
    const newValue = !quickDialEnabled;
    setQuickDialEnabled(newValue);
    setUserProfile(prev => ({ ...prev, quickDialEnabled: newValue }));
    onUnsavedChanges(true);
  };

  const testCall = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    }
  };

  const handleSave = () => {
    const validContacts = contacts.filter(contact =>
      contact.name.trim() && contact.phone.trim()
    );
    
    setUserProfile(prev => ({
      ...prev,
      emergencyContacts: validContacts,
      quickDialEnabled
    }));
    onUnsavedChanges(false);
  };

  const relationships = [
    'Familiar',
    'Amigo',
    'Cónyuge/Pareja',
    'Hijo/a',
    'Padre/Madre',
    'Hermano/a',
    'Tío/a',
    'Abuelo/a',
    'Psicólogo',
    'Psiquiatra',
    'Doctor',
    'Otro'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <Phone className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900ww">
          Emergencias
        </h2>
      </div>

      {/* Quick Dial Toggle */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900ww mb-2">
              Marcación Rápida
            </h3>
            <p className="text-sm text-gray-600ww">
              Permite acceso rápido a llamadas de emergencia desde cualquier pantalla
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={quickDialEnabled}
              onChange={handleQuickDialToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-gray-50 rounded-xl p-6 border-t border-gray-200 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900ww">
            Mis Contactos de Emergencia
          </h3>
          <motion.button
            onClick={addContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Agregar Contacto
          </motion.button>
        </div>

        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className={`bg-white rounded-lg p-4 border-2 transition-all ${
              contact.isActive ? 'border-green-200' : 'border-gray-200'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700ww mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900ww"
                    placeholder="Nombre del contacto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700ww mb-1">
                    Teléfono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400ww" />
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => updateContact(contact.id, 'phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900ww"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700ww mb-1">
                    Relación
                  </label>
                  <select
                    value={contact.relationship}
                    onChange={(e) => updateContact(contact.id, 'relationship', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900ww"
                  >
                    <option value="">Seleccionar</option>
                    {relationships.map((rel) => (
                      <option key={rel} value={rel}>{rel}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => testCall(contact.phone)}
                    disabled={!contact.phone}
                    className="flex-1 p-3 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Phone className="w-4 h-4" />
                    Probar
                  </button>
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="p-3 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contact.isActive}
                      onChange={() => toggleContactActive(contact.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                  <span className="text-sm text-gray-600ww">
                    {contact.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                {contact.isActive && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Check className="w-4 h-4" />
                    Listo para emergencias
                  </div>
                )}
              </div>
            </div>
          ))}

          {contacts.length === 0 && (
            <div className="text-center py-8">
              <Phone className="w-16 h-16 mx-auto mb-4 text-gray-300w" />
              <h4 className="text-lg font-medium text-gray-700ww mb-2">
                No hay contactos de emergencia
              </h4>
              <p className="text-gray-500ww mb-4">
                Agrega al menos un contacto de emergencia para poder contactarte rápidamente en caso de necesidad.
              </p>
              <motion.button
                onClick={addContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
              >
                <Phone className="w-5 h-5" />
                Agregar Primer Contacto
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-200 shadow-xl">
        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Instrucciones de Emergencia
        </h3>
        <div className="text-sm text-red-700 space-y-2">
          <p>• <strong>En una crisis:</strong> Presiona el botón de emergencia en cualquier pantalla para llamar automáticamente al primer contacto activo.</p>
          <p>• <strong>Marcación rápida:</strong> Con la función activada, siempre tendrás acceso rápido a los números de emergencia.</p>
          <p>• <strong>Testing:</strong> Usa el botón "Probar" para verificar que los números funcionan correctamente.</p>
          <p>• <strong>Mantenimiento:</strong> Actualiza regularmente la información de tus contactos.</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar Contactos
        </motion.button>
      </div>
    </motion.div>
  );
};

const SettingsPanel = ({
  theme,
  onThemeChange,
  userProfile,
  setUserProfile,
  moodEntries,
  onClose
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Get section from URL parameters on mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionFromUrl = urlParams.get('section');
    const validSections = ['profile', 'security', 'appearance', 'notifications', 'emergency'];
    
    if (sectionFromUrl && validSections.includes(sectionFromUrl)) {
      setActiveSection(sectionFromUrl);
    }
  }, []);
  
  const [activeSection, setActiveSection] = useState('profile');
  const [expandedSections, setExpandedSections] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const sections = [
    {
      id: 'profile',
      title: 'Editar Perfil',
      icon: User,
      description: 'Información personal y diagnóstico',
      component: ProfilePanel
    },
    {
      id: 'security',
      title: 'Seguridad',
      icon: Shield,
      description: 'Contraseña, autenticación y privacidad',
      component: SecurityPanel
    },
    {
      id: 'appearance',
      title: 'Apariencia',
      icon: Palette,
      description: 'Tema, colores y personalización',
      component: AppearancePanel
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      icon: Bell,
      description: 'Recordatorios y alertas',
      component: NotificationsPanel
    },
    {
      id: 'emergency',
      title: 'Contactos de Emergencia',
      icon: Phone,
      description: 'Personas a contactar en crisis',
      component: EmergencyPanel
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSectionChange = (sectionId) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('¿Tienes cambios sin guardar. ¿Deseas continuar?');
      if (!confirmChange) return;
    }
    setActiveSection(sectionId);
    setHasUnsavedChanges(false);
    
    // Update URL without page refresh
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('section', sectionId);
    window.history.replaceState({}, '', newUrl);
  };

  const handleSave = () => {
    // Save logic would be handled by individual panels
    setHasUnsavedChanges(false);
  };

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800ww">
                Configuración
              </h1>
              <p className="text-gray-600ww">
                Personaliza tu experiencia en PSICOMED
              </p>
            </div>
          </div>
  
          {hasUnsavedChanges && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </motion.button>
          )}
        </div>

       <div className="flex min-h-screen justify-start items-start p-6">
          {/* Enhanced Sidebar Navigation */}
          <div className="w-96 h-fit bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 flex-shrink-0 sticky top-6">
            {/* Sidebar Header */}
            <div className="mb-6 pb-3 border-b border-gray-200 ">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900ww">Configuración</h3>
                  <p className="text-sm text-gray-500ww">Personaliza tu experiencia</p>
                </div>
              </div>
            </div> 

            <nav className="space-y-2">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => handleSectionChange(section.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group w-full p-3 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25'
                        : 'hover:bg-white text-gray-700ww hover:shadow-lg border border-transparent hover:border-gray-200'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100  text-gray-600ww group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-gray-600 dark:group-hover:text-blue-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm leading-tight ${
                          isActive ? 'text-white' : 'text-gray-900ww '
                        }`}>
                          {section.title}
                        </div>
                        <div className={`text-xs mt-0.5 leading-relaxed ${
                          isActive ? 'text-blue-100' : 'text-gray-500ww dark:text-gray-400ww'
                        }`}>
                          {section.description}
                        </div>
                      </div>
                      
                      <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                        isActive
                          ? 'text-white rotate-90'
                          : 'text-gray-400ww group-hover:text-gray-600ww dark:group-hover:text-gray-300w group-hover:translate-x-1'
                      }`} />
                    </div>

                    {/* Hover effect overlay */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 " />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900ww ">Configuración guardada</p>
                    <p className="text-xs text-gray-500ww">Todos los cambios están seguros</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl p-6 min-h-[600px]"
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                }
              >
                {ActiveComponent && (
                  <ActiveComponent
                    theme={theme}
                    onThemeChange={onThemeChange}
                    userProfile={userProfile}
                    setUserProfile={setUserProfile}
                    moodEntries={moodEntries}
                    onUnsavedChanges={setHasUnsavedChanges}
                  />
                )}
              </Suspense>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default SettingsPanel;