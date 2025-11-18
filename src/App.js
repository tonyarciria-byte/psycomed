import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, LayoutDashboard, Smile, Plus, User, Settings, Trash, Check, X, Music, BookOpen, Rocket, Upload, Play, Pause, ListMusic, Lock, Globe, Volume2, VolumeX, ArrowLeft, ArrowRight, Shuffle, Edit, Calendar, Search, Bell, MessageSquare, Clock, Key, LogOut, Download, Trash2, HelpCircle, Info, PlusCircle, Shield } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMoodEmoji, moodAdvice, moodCategories, motivationalMessages } from './utils/moodUtils';
import { encryptData, decryptData, validateMoodEntry, validateUserProfile, secureStorage } from './utils/security';
import { requestNotificationPermission, scheduleDailyReminder, setupNotificationClickHandler } from './utils/notifications';

// Lazy load components for performance
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const DashboardContent = lazy(() => import('./components/DashboardContent'));
const MoodEntryForm = lazy(() => import('./components/MoodEntryForm'));
const TopNavigation = lazy(() => import('./components/TopNavigation'));
const NoteEditor = lazy(() => import('./components/NoteEditor'));
const JournalEntry = lazy(() => import('./components/JournalEntry'));
const RelaxationScreen = lazy(() => import('./components/RelaxationScreen'));
const JournalScreen = lazy(() => import('./components/JournalScreen'));
const SupportScreen = lazy(() => import('./components/SupportScreen'));
const SettingsPanel = lazy(() => import('./components/settings/SettingsPanel'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));
const PremiumFeatures = lazy(() => import('./components/premiumFeatures'));
const ThemeCustomizer = lazy(() => import('./components/ThemeCustomizer'));
const MedicationLog = lazy(() => import('./components/MedicationLog'));

function App() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  // Function to open theme customizer from settings
  useEffect(() => {
    window.openThemeCustomizer = () => setShowThemeCustomizer(true);
    return () => {
      delete window.openThemeCustomizer;
    };
  }, []);

  const [moodEntries, setMoodEntries] = useState([
    { date: '2024-07-15', rating: 6, note: 'Día normal.', tags: ['Calma'], sleepQuality: true },
    { date: '2024-07-16', rating: 8, note: 'Muy productivo.', tags: ['Felicidad'], sleepQuality: true },
    { date: '2024-07-17', rating: 3, note: 'Día difícil.', tags: ['Ansiedad'], sleepQuality: false },
    { date: '2024-07-18', rating: 5, note: 'Mejor que ayer.', tags: ['Cansancio'], sleepQuality: false },
    { date: '2024-07-19', rating: 9, note: 'Excelente día.', tags: ['Felicidad'], sleepQuality: true },
    { date: '2024-07-20', rating: 7, note: 'Día tranquilo.', tags: ['Calma'], sleepQuality: true },
  ]);

  const [userProfile, setUserProfile] = useState(() => {
    // Cargar estado premium desde localStorage
    const savedProfile = localStorage.getItem('psicomed_userProfile');
    const defaultProfile = {
      name: 'Andrea',
      age: 28,
      country: 'Colombia',
      diagnosis: 'Ansiedad Generalizada (Opcional)',
      language: 'Español',
      notifications: true,
      reminders: true,
      reminderTime: '09:00',
      isPremium: false, // Estado inicial sin premium
      // Nuevos campos de seguridad y emergencias
      email: '',
      phone: '',
      emergencyContacts: [],
      recoveryEmail: '',
      twoFactorEnabled: false,
      biometricEnabled: false,
      // Campos de apariencia
      theme: 'light', // 'light', 'dark', o 'auto'
      autoTheme: false, // Boolean - mantener por compatibilidad
      customTheme: null,
      fontSize: 'medium',
      animationsEnabled: true,
      highContrast: false,
    };

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Combinar perfil guardado con valores por defecto
        return { ...defaultProfile, ...parsed };
      } catch (error) {
        console.error('Error loading user profile:', error);
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    // Inicializar theme manager primero
    import('./utils/themeManager').then(({ themeManager }) => {
      themeManager.init();
      
      // Configurar auto-switch basado en userProfile.autoTheme
      if (userProfile.autoTheme) {
        themeManager.setAutoSwitch(true);
      }
      
      const currentTheme = themeManager.getCurrentTheme();
      setTheme(currentTheme);
    });

    // Cleanup function to be called on unmount
    return () => {
      import('./utils/themeManager').then(({ themeManager }) => {
        themeManager.cleanup();
      });
    };

    // Cargar idioma guardado
    const savedLanguage = localStorage.getItem('i18nextLng') || 'es';
    i18n.changeLanguage(savedLanguage);

    // Solicitar permisos de notificación
    requestNotificationPermission();

    // Configurar manejador de clics en notificaciones
    setupNotificationClickHandler((action) => {
      if (action === 'register') {
        window.location.href = '/register-mood';
      }
    });
  }, [i18n]);

  const applyTheme = (newTheme) => {
    // Theme is now handled by themeManager
    import('./utils/themeManager').then(({ themeManager }) => {
      themeManager.setTheme(newTheme);
    });
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update userProfile theme as well
    setUserProfile(prev => ({ ...prev, theme: newTheme }));
    
    applyTheme(newTheme);
  };

  const handleSaveMood = (newEntry) => {
    // Validar entrada antes de guardar
    const validationErrors = validateMoodEntry(newEntry);
    if (validationErrors.length > 0) {
      alert('Errores de validación: ' + validationErrors.join(', '));
      return;
    }

    setMoodEntries(prevEntries => {
      const today = new Date().toISOString().split('T')[0];
      const existingIndex = prevEntries.findIndex(entry => entry.date === today);

      if (existingIndex !== -1) {
        const updatedEntries = [...prevEntries];
        updatedEntries[existingIndex] = { ...updatedEntries[existingIndex], ...newEntry };
        return updatedEntries;
      } else {
        return [newEntry, ...prevEntries];
      }
    });

    // Programar recordatorio diario si está activado
    if (userProfile.reminders && userProfile.reminderTime) {
      scheduleDailyReminder(
        userProfile.reminderTime,
        'Recordatorio de ánimo diario',
        '¿Cómo te has sentido hoy? Registra tu estado de ánimo.'
      );
    }
  };

  const handleUpdateProfile = (updatedProfile) => {
    // Validar perfil antes de actualizar
    const validationErrors = validateUserProfile(updatedProfile);
    if (validationErrors.length > 0) {
      alert('Errores de validación: ' + validationErrors.join(', '));
      return;
    }

    setUserProfile(updatedProfile);

    // Persistir perfil en localStorage
    try {
      localStorage.setItem('psicomed_userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }

    // Actualizar idioma si cambió
    if (updatedProfile.language !== userProfile.language) {
      i18n.changeLanguage(updatedProfile.language === 'Español' ? 'es' : 'en');
    }
  };

  return (
    <Router>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>}>
        <Routes>
          <Route path="/" element={<WelcomeScreen setUserProfile={setUserProfile} />} />
          <Route path="/dashboard" element={<DashboardScreen moodEntries={moodEntries} setMoodEntries={setMoodEntries} userProfile={userProfile} />} />
          <Route path="/register-mood" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-gray-900 p-4">
              <TopNavigation />
              <MoodEntryForm onSaveMood={handleSaveMood} />
            </div>
          } />
          <Route path="/profile" element={<ProfileScreen userProfile={userProfile} setUserProfile={handleUpdateProfile} />} />
          <Route path="/edit-note/:date" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-gray-900 p-4">
              <TopNavigation />
              <NoteEditor moodEntries={moodEntries} setMoodEntries={setMoodEntries} />
            </div>
          } />
          <Route path="/settings" element={<SettingsPanel theme={theme} onThemeChange={handleThemeChange} userProfile={userProfile} setUserProfile={handleUpdateProfile} moodEntries={moodEntries} onClose={() => window.history.back()} />} />
          <Route path="/relaxation" element={<RelaxationScreen userProfile={userProfile} />} />
          <Route path="/journal" element={<JournalScreen moodEntries={moodEntries} setMoodEntries={setMoodEntries} userProfile={userProfile} />} />
          <Route path="/support" element={<SupportScreen />} />
          <Route path="/premium" element={<PremiumFeatures userProfile={userProfile} setUserProfile={handleUpdateProfile} />} />
          <Route path="/medications" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-gray-900 p-4">
              <TopNavigation />
              <MedicationLog userProfile={userProfile} />
            </div>
          } />
        </Routes>

        {/* Modals */}
        <AnimatePresence>
          {showThemeCustomizer && (
            <ThemeCustomizer
              isOpen={showThemeCustomizer}
              onClose={() => setShowThemeCustomizer(false)}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
          )}
        </AnimatePresence>


      </Suspense>
    </Router>
  );
}


const DashboardScreen = ({ moodEntries, setMoodEntries, userProfile }) => {
  const navigate = useNavigate();

  const handleRegisterMoodClick = () => {
    navigate('/register-mood');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <TopNavigation />
      <DashboardContent
        moodEntries={moodEntries}
        setMoodEntries={setMoodEntries}
        onRegisterMoodClick={handleRegisterMoodClick}
        userProfile={userProfile}
      />
    </div>
  );
};





export default App;