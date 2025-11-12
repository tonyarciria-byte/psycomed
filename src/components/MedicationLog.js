import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill, Clock, Heart, Plus, Edit, Trash2, Calendar, Smile, Frown, Meh, AlertCircle,
  Search, Filter, SortAsc, SortDesc, BarChart3, CalendarDays, TrendingUp,
  CheckCircle, XCircle, Star, FilterX, Bell, Timer
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MedicationLog = ({ userProfile }) => {
  const { t } = useTranslation();
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescription: '',
    notes: '',
    alarmEnabled: false,
    alarmTime: '08:00',
    alarmDays: [] // Array de días de la semana [0-6]
  });
  
  // New state for enhanced features
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'
  const [medicationFilter, setMedicationFilter] = useState('all'); // 'all', 'pending', 'completed'

  const [logEntries, setLogEntries] = useState([]);
  const [showEmotionModal, setShowEmotionModal] = useState(false);
  const [selectedMedicationForMood, setSelectedMedicationForMood] = useState(null);
  const [moodType, setMoodType] = useState('before'); // 'before' or 'after'

  // Helper functions defined first
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad': return <Frown className="w-5 h-5 text-red-500" />;
      case 'neutral': return <Meh className="w-5 h-5 text-yellow-500" />;
      case 'anxious': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <Meh className="w-5 h-5 text-gray-500ww" />;
    }
  };

  const getMedicationById = (id) => {
    return medications.find(med => med.id === id);
  };

  const toggleAlarmDay = (dayIndex) => {
    setNewMedication(prev => ({
      ...prev,
      alarmDays: prev.alarmDays.includes(dayIndex)
        ? prev.alarmDays.filter(d => d !== dayIndex)
        : [...prev.alarmDays, dayIndex]
    }));
  };

  // Check if medication has a log entry today
  const hasLogEntryToday = (medication) => {
    const today = new Date().toDateString();
    return logEntries.some(entry => {
      const entryDate = new Date(entry.timestamp).toDateString();
      return entry.medicationId === medication.id &&
             entryDate === today &&
             entry.moodAfter;
    });
  };

  // Check if medication has any log entry today (pending or completed)
  const hasAnyLogEntryToday = (medication) => {
    const today = new Date().toDateString();
    return logEntries.some(entry => {
      const entryDate = new Date(entry.timestamp).toDateString();
      return entry.medicationId === medication.id && entryDate === today;
    });
  };

  // Check if medication has an active alarm today
  const isAlarmActiveToday = (medication) => {
    if (!medication.alarmEnabled || !medication.alarmTime || !medication.alarmDays) return false;
    
    const today = new Date().getDay();
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes(); // Formato HHMM
    
    // Verificar si la alarma es para hoy
    const isTodayAlarm = medication.alarmDays.includes(today);
    if (!isTodayAlarm) return false;
    
    // Convertir hora de alarma a formato HHMM
    const [hours, minutes] = medication.alarmTime.split(':').map(Number);
    const alarmTime = hours * 100 + minutes;
    
    // La alarma está activa si no ha pasado la hora o si estamos en los primeros 15 minutos después
    return currentTime <= alarmTime + 15;
  };

  useEffect(() => {
    // Load medications and log entries from localStorage
    const savedMedications = localStorage.getItem('medications');
    const savedLogEntries = localStorage.getItem('medicationLog');

    if (savedMedications) {
      setMedications(JSON.parse(savedMedications));
    }

    if (savedLogEntries) {
      setLogEntries(JSON.parse(savedLogEntries));
    }
  }, []);

  const saveMedications = (meds) => {
    localStorage.setItem('medications', JSON.stringify(meds));
    setMedications(meds);
  };

  const saveLogEntries = (entries) => {
    localStorage.setItem('medicationLog', JSON.stringify(entries));
    setLogEntries(entries);
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication = {
        id: Date.now(),
        ...newMedication,
        createdAt: new Date().toISOString()
      };
      saveMedications([...medications, medication]);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        prescription: '',
        notes: '',
        alarmEnabled: false,
        alarmTime: '08:00',
        alarmDays: []
      });
      setShowAddForm(false);
    }
  };

  const handleEditMedication = (medication) => {
    setEditingMedication(medication);
    setNewMedication(medication);
    setShowAddForm(true);
  };

  const handleUpdateMedication = () => {
    if (editingMedication) {
      const updatedMedications = medications.map(med =>
        med.id === editingMedication.id ? { ...med, ...newMedication } : med
      );
      saveMedications(updatedMedications);
      setEditingMedication(null);
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        prescription: '',
        notes: '',
        alarmEnabled: false,
        alarmTime: '08:00',
        alarmDays: []
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteMedication = (id) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    saveMedications(updatedMedications);
  };

  const handleLogMedication = (medicationId, moodBefore, moodAfter, notes) => {
    const entry = {
      id: Date.now(),
      medicationId,
      timestamp: new Date().toISOString(),
      moodBefore,
      moodAfter,
      notes,
      followUpTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours later
    };
    saveLogEntries([...logEntries, entry]);
  };

  // Nuevo sistema de registro inteligente por clicks con modal de emociones
  const handleSmartMedicationLog = (medication) => {
    const today = new Date().toDateString();
    
    // Buscar entrada existente del día
    const todayEntry = logEntries.find(entry => {
      const entryDate = new Date(entry.timestamp).toDateString();
      return entry.medicationId === medication.id && entryDate === today;
    });

    // Si no existe entrada, crear nueva con moodBefore
    if (!todayEntry) {
      setSelectedMedicationForMood(medication);
      setMoodType('before');
      setShowEmotionModal(true);
      return;
    }

    // Si ya existe entrada con moodBefore pero sin moodAfter, agregar moodAfter
    if (todayEntry && todayEntry.moodBefore && !todayEntry.moodAfter) {
      setSelectedMedicationForMood(medication);
      setMoodType('after');
      setShowEmotionModal(true);
      return;
    }

    // Si ya está completo, no hacer nada
  };

  const handleEmotionSelect = (emotion) => {
    if (!selectedMedicationForMood) return;

    const today = new Date().toDateString();
    const todayEntry = logEntries.find(entry => {
      const entryDate = new Date(entry.timestamp).toDateString();
      return entry.medicationId === selectedMedicationForMood.id && entryDate === today;
    });

    if (moodType === 'before') {
      // Crear nueva entrada con moodBefore
      handleLogMedication(selectedMedicationForMood.id, emotion, null, '');
    } else if (moodType === 'after') {
      // Actualizar entrada existente con moodAfter
      const updatedEntries = logEntries.map(entry =>
        entry.id === todayEntry.id ? { ...entry, moodAfter: emotion } : entry
      );
      saveLogEntries(updatedEntries);
    }

    setShowEmotionModal(false);
    setSelectedMedicationForMood(null);
    setMoodType('before');
  };

  const emotions = [
    { id: 'happy', name: 'Feliz', icon: '😊', color: 'bg-green-500' },
    { id: 'sad', name: 'Triste', icon: '😢', color: 'bg-blue-500' },
    { id: 'neutral', name: 'Neutral', icon: '😐', color: 'bg-gray-500' },
    { id: 'anxious', name: 'Ansioso', icon: '😰', color: 'bg-orange-500' }
  ];

  const handleDeleteLogEntry = (entryId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro de medicamento?')) {
      const updatedEntries = logEntries.filter(entry => entry.id !== entryId);
      saveLogEntries(updatedEntries);
    }
  };

  // Enhanced filtering and sorting
  const filteredAndSortedMedications = useMemo(() => {
    let filtered = medications.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           med.prescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFrequency = filterFrequency === 'all' || med.frequency.toLowerCase().includes(filterFrequency);
      return matchesSearch && matchesFrequency;
    });

    // Sort medications
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [medications, searchTerm, filterFrequency, sortBy, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const totalMedications = medications.length;
    const pendingToday = medications.filter(med => {
      // If medication is completed, it cannot be pending
      if (hasLogEntryToday(med)) {
        return false;
      }
      const hasPendingEntry = hasAnyLogEntryToday(med) && !hasLogEntryToday(med);
      const hasActiveAlarm = isAlarmActiveToday(med);
      return hasPendingEntry || hasActiveAlarm;
    }).length;
    const completedToday = medications.filter(med => hasLogEntryToday(med)).length;

    return { totalMedications, pendingToday, completedToday };
  }, [medications, logEntries]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Filter medications by pending/completed status
  const getFilteredMedications = () => {
    let filtered = filteredAndSortedMedications;
    
    if (medicationFilter === 'pending') {
      // Pending: medications that have any log entry today but are not completed OR have active alarm today
      // IMPORTANT: Exclude completed medications from pending list
      filtered = filtered.filter(med => {
        if (hasLogEntryToday(med)) {
          return false; // Never show completed medications in pending
        }
        const hasPendingEntry = hasAnyLogEntryToday(med) && !hasLogEntryToday(med);
        const hasActiveAlarm = isAlarmActiveToday(med);
        return hasPendingEntry || hasActiveAlarm;
      });
    } else if (medicationFilter === 'completed') {
      // Completed: medications that have a completed entry today
      filtered = filtered.filter(med => {
        return hasLogEntryToday(med);
      });
    }
    
    return filtered;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-8 bg-white dark:bg-purple-400:bg-gray-800 rounded-3xl shadow-2xl border border-white/20 dark:bg-purple-400:border-gray-700 backdrop-blur-sm"
    >
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 dark:bg-purple-400:from-blue-600 dark:bg-purple-400:to-purple-700 rounded-2xl shadow-lg">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900ww dark:bg-purple-400:text-white">
                {t('medicationLog', 'Registro de Medicamentos')}
              </h2>
              <p className="text-gray-600ww dark:bg-purple-400:text-gray-400ww text-sm mt-1">
                {t('trackYourMedications', 'Gestiona tus medicamentos de forma inteligente')}
              </p>
            </div>
          </motion.div>
          <motion.button
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddForm(true)}
            className="p-3 bg-gradient-to-r from-emerald-500 to-blue-500 dark:bg-purple-400:from-emerald-600 dark:bg-purple-400:to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            title={t('addMedication', 'Agregar Medicamento')}
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Statistics Cards - Clickable as Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMedicationFilter('all')}
            className={`p-4 rounded-2xl text-white shadow-lg transition-all duration-300 ${
              medicationFilter === 'all'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:bg-purple-400:from-blue-700 dark:bg-purple-400:to-blue-800 shadow-xl'
                : 'bg-gradient-to-br from-blue-500 to-blue-600 dark:bg-purple-400:from-blue-600 dark:bg-purple-400:to-blue-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 dark:bg-purple-400:text-blue-200 text-sm">Total Medicamentos</p>
                <p className="text-2xl font-bold">{stats.totalMedications}</p>
              </div>
              <Pill className="w-8 h-8 text-blue-200 dark:bg-purple-400:text-blue-300" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 25px -5px rgba(245, 158, 11, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMedicationFilter('pending')}
            className={`p-4 rounded-2xl text-white shadow-lg transition-all duration-300 ${
              medicationFilter === 'pending'
                ? 'bg-gradient-to-br from-orange-600 to-red-600 dark:bg-purple-400:from-orange-700 dark:bg-purple-400:to-red-700 shadow-xl'
                : 'bg-gradient-to-br from-yellow-500 to-orange-500 dark:bg-purple-400:from-yellow-600 dark:bg-purple-400:to-orange-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 dark:bg-purple-400:text-orange-200 text-sm">Pendientes Hoy</p>
                <p className="text-2xl font-bold">{stats.pendingToday}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200 dark:bg-purple-400:text-orange-300" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMedicationFilter('completed')}
            className={`p-4 rounded-2xl text-white shadow-lg transition-all duration-300 ${
              medicationFilter === 'completed'
                ? 'bg-gradient-to-br from-emerald-600 to-green-600 dark:bg-purple-400:from-emerald-700 dark:bg-purple-400:to-green-700 shadow-xl'
                : 'bg-gradient-to-br from-green-500 to-emerald-500 dark:bg-purple-400:from-green-600 dark:bg-purple-400:to-emerald-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 dark:bg-purple-400:text-emerald-200 text-sm">Completados Hoy</p>
                <p className="text-2xl font-bold">{stats.completedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-200 dark:bg-purple-400:text-emerald-300" />
            </div>
          </motion.button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 dark:bg-purple-400:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50 dark:bg-purple-400:border-gray-600/50 shadow-lg"
        >
          <div className="flex justify-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400ww dark:bg-purple-400:text-gray-500ww w-5 h-5" />
              <input
                type="text"
                placeholder={t('searchMedications', 'Buscar medicamentos...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-xl bg-white/80 dark:bg-purple-400:bg-gray-800/80 text-gray-900ww dark:bg-purple-400:text-white placeholder-gray-500 dark:bg-purple-400:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400ww dark:bg-purple-400:text-gray-500ww hover:text-gray-600ww dark:bg-purple-400:hover:text-gray-300ww transition-colors"
                  title="Limpiar búsqueda"
                >
                  <FilterX className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Medication Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mb-8 p-6 bg-white dark:bg-purple-400:bg-gray-700 rounded-2xl shadow-xl border border-white/50 dark:bg-purple-400:border-gray-600 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 dark:bg-purple-400:from-blue-600 dark:bg-purple-400:to-purple-700 rounded-xl">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900ww dark:bg-purple-400:text-white">
              {editingMedication ? t('editMedication', 'Editar Medicamento') : t('addMedication', 'Agregar Medicamento')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww">
                {t('medicationName', 'Nombre del medicamento')}
              </label>
              <input
                type="text"
                placeholder={t('medicationName', 'Ej: Paracetamol')}
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                className="w-full p-4 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-xl bg-white dark:bg-purple-400:bg-gray-800 text-gray-900ww dark:bg-purple-400:text-white placeholder-gray-500 dark:bg-purple-400:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww">
                {t('dosage', 'Dosis')}
              </label>
              <input
                type="text"
                placeholder={t('dosage', 'Ej: 500mg')}
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                className="w-full p-4 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-xl bg-white dark:bg-purple-400:bg-gray-800 text-gray-900ww dark:bg-purple-400:text-white placeholder-gray-500 dark:bg-purple-400:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww">
                {t('frequency', 'Frecuencia')}
              </label>
              <input
                type="text"
                placeholder={t('frequency', 'Ej: Cada 8 horas')}
                value={newMedication.frequency}
                onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                className="w-full p-4 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-xl bg-white dark:bg-purple-400:bg-gray-800 text-gray-900ww dark:bg-purple-400:text-white placeholder-gray-500 dark:bg-purple-400:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww">
                {t('prescription', 'Receta')}
              </label>
              <input
                type="text"
                placeholder={t('prescription', 'Ej: Dr. García - 2024')}
                value={newMedication.prescription}
                onChange={(e) => setNewMedication({...newMedication, prescription: e.target.value})}
                className="w-full p-4 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-xl bg-white dark:bg-purple-400:bg-gray-800 text-gray-900ww dark:bg-purple-400:text-white placeholder-gray-500 dark:bg-purple-400:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="space-y-2 mt-6">
            <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww">
              {t('notes', 'Notas adicionales')}
            </label>
            <textarea
              placeholder={t('notes', 'Información adicional sobre el medicamento...')}
              value={newMedication.notes}
              onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
              className="w-full p-4 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-xl bg-white dark:bg-purple-400:bg-gray-800 text-gray-900ww dark:bg-purple-400:text-white placeholder-gray-500 dark:bg-purple-400:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows="4"
            />
          </div>

          {/* Simple Alarm Section */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-purple-400:bg-blue-900/20 rounded-xl border border-blue-200 dark:bg-purple-400:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-blue-600 dark:bg-purple-400:text-blue-400" />
                <h4 className="text-lg font-semibold text-gray-900ww dark:bg-purple-400:text-white">Recordatorio de Medicamento</h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newMedication.alarmEnabled}
                  onChange={(e) => setNewMedication({...newMedication, alarmEnabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-purple-400:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-purple-400:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:bg-purple-400:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-purple-400:peer-checked:bg-blue-500"></div>
              </label>
            </div>

            {newMedication.alarmEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww mb-2 block">
                    Hora del recordatorio
                  </label>
                  <div className="flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-gray-400ww dark:bg-purple-400:text-gray-500ww" />
                    <input
                      type="time"
                      value={newMedication.alarmTime}
                      onChange={(e) => setNewMedication({...newMedication, alarmTime: e.target.value})}
                      className="px-3 py-2 border border-gray-200 dark:bg-purple-400:border-gray-600 rounded-lg bg-white dark:bg-purple-400:bg-gray-800 text-gray-900ww dark:bg-purple-400:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww mb-2 block">
                    Días de la semana
                  </label>
                  <div className="flex space-x-2">
                    {dayNames.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleAlarmDay(index)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                          newMedication.alarmDays.includes(index)
                            ? 'bg-blue-500 dark:bg-purple-400:bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-purple-400:bg-gray-600 text-gray-600ww dark:bg-purple-400:text-gray-300ww hover:bg-gray-300 dark:bg-purple-400:hover:bg-gray-500'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {newMedication.alarmDays.length === 0 && (
                  <p className="text-sm text-amber-600 dark:bg-purple-400:text-amber-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Selecciona al menos un día para el recordatorio</span>
                  </p>
                )}
              </motion.div>
            )}
          </div>

          <div className="flex space-x-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={editingMedication ? handleUpdateMedication : handleAddMedication}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 dark:bg-purple-400:from-green-600 dark:bg-purple-400:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {editingMedication ? t('update', 'Actualizar') : t('add', 'Agregar')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(107, 114, 128, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowAddForm(false);
                setEditingMedication(null);
                setNewMedication({
                  name: '',
                  dosage: '',
                  frequency: '',
                  prescription: '',
                  notes: '',
                  alarmEnabled: false,
                  alarmTime: '08:00',
                  alarmDays: []
                });
              }}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 dark:bg-purple-400:from-gray-600 dark:bg-purple-400:to-gray-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              {t('cancel', 'Cancelar')}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Enhanced Medications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 dark:bg-purple-400:from-emerald-600 dark:bg-purple-400:to-teal-700 rounded-xl">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900ww dark:bg-purple-400:text-white">
                {t('myMedications', 'Mis Medicamentos')}
              </h3>
              <p className="text-gray-600ww dark:bg-purple-400:text-gray-400ww text-sm">
                {getFilteredMedications().length} de {medications.length} medicamentos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-gray-600ww dark:bg-purple-400:text-gray-400ww text-sm">
                {getFilteredMedications().length} de {medications.length} medicamentos
              </p>
            </div>
          </div>
        </div>

        {getFilteredMedications().length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-purple-400:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Pill className="w-12 h-12 text-gray-400ww dark:bg-purple-400:text-gray-500ww" />
            </div>
            <h4 className="text-xl font-semibold text-gray-700ww dark:bg-purple-400:text-gray-300ww mb-2">
              {searchTerm || medicationFilter !== 'all'
                ? 'No se encontraron medicamentos'
                : 'No tienes medicamentos aún'
              }
            </h4>
            <p className="text-gray-500ww dark:bg-purple-400:text-gray-400ww mb-6">
              {searchTerm || medicationFilter !== 'all'
                ? 'Intenta con otros términos de búsqueda o filtros'
                : 'Comienza agregando tu primer medicamento'
              }
            </p>
            {(!searchTerm && medicationFilter === 'all') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 dark:bg-purple-400:from-blue-600 dark:bg-purple-400:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                {t('addMedication', 'Agregar Medicamento')}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {getFilteredMedications().map((medication, index) => {
              const hasCompletedEntry = hasLogEntryToday(medication);
              const hasAnyEntry = hasAnyLogEntryToday(medication);
              const hasActiveAlarm = isAlarmActiveToday(medication);
              const isPending = (hasAnyEntry && !hasCompletedEntry) || hasActiveAlarm;

              return (
                <motion.div
                  key={medication.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`group relative p-6 bg-white dark:bg-purple-400:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 dark:bg-purple-400:border-gray-700 backdrop-blur-sm overflow-hidden ${
                    viewMode === 'list' ? 'flex items-center space-x-4' : ''
                  }`}
                >
                  {/* Status indicator */}
                  {hasCompletedEntry ? (
                    <div className="absolute top-2 right-2 bg-green-100 dark:bg-purple-400:bg-green-900 text-green-800 dark:bg-purple-400:text-green-200 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completado</span>
                    </div>
                  ) : isPending ? (
                    <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-purple-400:bg-yellow-900 text-yellow-800 dark:bg-purple-400:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Pendiente</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 bg-gray-100 dark:bg-purple-400:bg-gray-700 text-gray-800w dark:bg-purple-400:text-gray-200w px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Pill className="w-3 h-3" />
                      <span>Sin registro hoy</span>
                    </div>
                  )}

                  {/* Decorative elements - behind content */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:bg-purple-400:from-blue-400/5 dark:bg-purple-400:to-purple-400/5 rounded-full -mr-10 -mt-10 -z-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 dark:bg-purple-400:from-emerald-400/5 dark:bg-purple-400:to-teal-400/5 rounded-full -ml-8 -mb-8 -z-10"></div>
                  
                  {/* Enhanced List View */}
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Enhanced Icon Section */}
                    <div className="relative flex-shrink-0">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 dark:bg-purple-400:from-blue-600 dark:bg-purple-400:to-purple-700 rounded-2xl shadow-xl flex items-center justify-center">
                        <Pill className="w-7 h-7 text-white" />
                      </div>
                      {/* Decorative glow */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 dark:bg-purple-400:from-blue-600 dark:bg-purple-400:to-purple-700 rounded-2xl opacity-20 dark:bg-purple-400:opacity-10 blur animate-pulse"></div>
                    </div>
                    
                    {/* Enhanced Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with name and actions */}
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-gray-900ww dark:bg-purple-400:text-white text-xl truncate pr-4">{medication.name}</h4>
                        <div className="flex space-x-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.15, boxShadow: "0 5px 15px -3px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditMedication(medication)}
                            className="p-2 bg-blue-100 dark:bg-purple-400:bg-blue-900 text-blue-600 dark:bg-purple-400:text-blue-300 hover:text-blue-800 dark:bg-purple-400:hover:text-blue-200 hover:bg-blue-200 dark:bg-purple-400:hover:bg-blue-800 rounded-xl transition-all duration-200 shadow-md"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15, boxShadow: "0 5px 15px -3px rgba(239, 68, 68, 0.3)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteMedication(medication.id)}
                            className="p-2 bg-red-100 dark:bg-purple-400:bg-red-900 text-red-600 dark:bg-purple-400:text-red-300 hover:text-red-800 dark:bg-purple-400:hover:text-red-200 hover:bg-red-200 dark:bg-purple-400:hover:bg-red-800 rounded-xl transition-all duration-200 shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Enhanced Info Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 dark:bg-purple-400:bg-blue-400 rounded-full shadow-sm"></div>
                          <span className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww"><strong>Dosis:</strong> {medication.dosage}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 dark:bg-purple-400:bg-emerald-400 rounded-full shadow-sm"></div>
                          <span className="text-sm font-medium text-gray-700ww dark:bg-purple-400:text-gray-300ww"><strong>Frecuencia:</strong> {medication.frequency}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400:bg-purple-400 rounded-full shadow-sm"></div>
                          <span className="text-sm font-medium text-gray-700ww "><strong>Receta:</strong> {medication.prescription}</span>
                        </div>
                        {medication.alarmEnabled && (
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-500  rounded-full shadow-sm"></div>
                            <span className="text-sm font-medium text-gray-700ww"><strong>Alarma:</strong> {medication.alarmTime}</span>
                            <Bell className="w-3 h-3 text-yellow-500w" />
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Notes */}
                      {medication.notes && (
                        <div className="bg-gray-50 border border-gray-200  rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700ww leading-relaxed">
                            <span className="font-medium text-gray-600ww ">Notas:</span> {medication.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Action Button */}
                    <div className="flex-shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -8px rgba(0, 0, 0, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSmartMedicationLog(medication)}
                        className={`px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center space-x-3 min-w-[140px] ${
                          hasCompletedEntry
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 '
                            : isPending
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 '
                        }`}
                      >
                        {hasCompletedEntry ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-white" />
                            <span className="text-sm text-white">Registrado Hoy</span>
                          </>
                        ) : isPending ? (
                          <>
                            <Clock className="w-5 h-5 text-white" />
                            <span className="text-sm text-white">Segundo Click - Después</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-white" />
                            <span className="text-sm text-white">Primer Click - Antes</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Medication Log Entries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900ww">
            {t('medicationHistory', 'Historial de Medicamentos')}
          </h3>
        </div>
        <div className="space-y-6">
          {logEntries.map((entry, index) => {
            const medication = getMedicationById(entry.medicationId);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                className="relative p-4 bg-white rounded-2xl shadow-lg border border-white/50 "
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Pill className="w-5 h-5 text-blue-500 " />
                    <span className="font-semibold text-gray-900ww ">
                      {medication ? medication.name : t('unknownMedication', 'Medicamento desconocido')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500ww">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteLogEntry(entry.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50  rounded-lg transition-colors"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600ww mb-1">
                      <strong>{t('moodBefore', 'Estado de ánimo antes')}:</strong>
                      <span className="ml-2">{getMoodIcon(entry.moodBefore)}</span>
                    </p>
                    {entry.moodAfter && (
                      <p className="text-sm text-gray-600ww">
                        <strong>{t('moodAfter', 'Estado de ánimo después')}:</strong>
                        <span className="ml-2">{getMoodIcon(entry.moodAfter)}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600ww">
                      <strong>{t('followUpTime', 'Hora de seguimiento')}:</strong> {new Date(entry.followUpTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                {entry.notes && (
                  <p className="text-sm text-gray-600ww mt-2">
                    <strong>{t('notes', 'Notas')}:</strong> {entry.notes}
                  </p>
                )}
                {!entry.moodAfter && (
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(168, 85, 247, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const moodAfter = prompt(t('moodAfterTaking', 'Estado de ánimo después de tomar (happy/sad/neutral/anxious):'));
                      const notes = prompt(t('followUpNotes', 'Notas de seguimiento:'));
                      if (moodAfter) {
                        const updatedEntries = logEntries.map(e =>
                          e.id === entry.id ? { ...e, moodAfter, notes: notes || e.notes } : e
                        );
                        saveLogEntries(updatedEntries);
                      }
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{t('updateFollowUp', 'Actualizar Seguimiento')}</span>
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Enhanced Modal de Selección de Emociones */}
      <AnimatePresence>
        {showEmotionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(0, 0, 0, 0.4)' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotateX: -15, y: 50 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotateX: 15, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6
              }}
              className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border border-white/20 overflow-hidden"
            >
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500-z-10"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-purple-500/10 dark:from-purple-300/15 dark:to-purple-400/15 rounded-full blur-xl -z-10 opacity-10"></div>
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-green-400/10 to-emerald-400/10 dark:from-green-300/15 dark:to-emerald-300/15 rounded-full blur-xl -z-10 opacity-10"></div>
              
              <div className="relative text-center mb-8">
                <motion.h3
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-extrabold text-gray-800ww mb-2"
                >
                  Estado de Ánimo {moodType === 'before' ? 'Antes' : 'Después'}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600ww font-medium"
                >
                  {selectedMedicationForMood?.name}
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-3"
                ></motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {emotions.map((emotion, index) => (
                  <motion.button
                    key={emotion.id}
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.4 + (index * 0.1),
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    whileHover={{
                      scale: 1.08,
                      y: -5,
                      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmotionSelect(emotion.id)}
                    className={`relative group p-6 rounded-3xl ${emotion.color} text-white shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col items-center space-y-3 overflow-hidden border border-white/20`}
                  >
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className={`absolute -inset-1 ${emotion.color} rounded-3xl opacity-0 group-hover:opacity-30 blur transition-opacity duration-500`}></div>
                    
                    {/* Emoji with Glow */}
                    <div className="relative">
                      <span className="text-5xl filter drop-shadow-lg">{emotion.icon}</span>
                    </div>
                    
                    <span className="relative font-bold text-lg tracking-wide">{emotion.name}</span>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"></div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEmotionModal(false)}
                className="w-full relative p-4 bg-gray-100/80 text-gray-700ww rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm border border-gray-200/50 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative">Cancelar</span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-gray-300/30 to-transparent transform skew-x-12"></div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MedicationLog;