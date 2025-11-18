import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Search, Calendar, X, Edit, Trash, Eye, ArrowRight, Lock } from 'lucide-react';
import TopNavigation from './TopNavigation';
import NoteEditor from './NoteEditor';
import JournalEntry from './JournalEntry';

const JournalScreen = ({ moodEntries, setMoodEntries, userProfile }) => {
  const navigate = useNavigate();
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const getMoodEmoji = (rating) => {
    const moodEmojis = ['😞', '😔', '😟', '😐', '🙂', '😊', '😄', '😁', '😃', '🤩'];
    return moodEmojis[rating - 1] || '😐';
  };

  useEffect(() => {
    // Datos de ejemplo mejorados
    const savedEntries = [
      { 
        id: 'j1', 
        date: '2024-07-19', 
        title: 'Reflexiones del día', 
        content: 'Hoy fue un día de muchas reflexiones. Me di cuenta de que es importante tomarse un momento para pensar en todo lo que está pasando a nuestro alrededor. La vida puede ser muy intensa a veces.', 
        moodRating: 9, 
        wordCount: 35,
        createdAt: '2024-07-19T14:30:00'
      },
      { 
        id: 'j2', 
        date: '2024-07-17', 
        title: 'Día difícil pero productivo', 
        content: 'Me costó concentrarme al principio, pero después de tomar un café y organizar mi espacio de trabajo, pude ser bastante productivo. A veces solo necesitamos ajustar nuestro ambiente.', 
        moodRating: 6, 
        wordCount: 32,
        createdAt: '2024-07-17T16:45:00'
      },
      { 
        id: 'j3', 
        date: '2024-07-15', 
        title: 'Pensamientos sobre el futuro', 
        content: 'He estado pensando mucho sobre mis metas a largo plazo y qué dirección quiero tomar en mi carrera. Es emocionante pero también un poco abrumador pensar en todas las posibilidades.', 
        moodRating: 7, 
        wordCount: 38,
        createdAt: '2024-07-15T19:20:00'
      }
    ];

    // Combinar entradas guardadas con entradas de humor
    const combinedEntries = moodEntries.map(moodEntry => {
      const existingJournalEntry = savedEntries.find(je => je.date === moodEntry.date);
      if (existingJournalEntry) {
        return {
          ...existingJournalEntry,
          moodRating: moodEntry.rating,
          moodEmoji: getMoodEmoji(moodEntry.rating)
        };
      } else if (moodEntry.note && moodEntry.note.trim()) {
        const wordCount = moodEntry.note.trim().split(/\s+/).filter(word => word.length > 0).length;
        return {
          id: `mood-${moodEntry.date}`,
          date: moodEntry.date,
          title: moodEntry.title || moodEntry.note.substring(0, 30) + (moodEntry.note.length > 30 ? '...' : ''),
          content: moodEntry.note,
          moodRating: moodEntry.rating,
          moodEmoji: getMoodEmoji(moodEntry.rating),
          wordCount: wordCount,
          createdAt: moodEntry.date + 'T12:00:00',
          isMoodNote: true,
        };
      }
      return null;
    }).filter(Boolean);

    // Agregar entradas guardadas que no estén ya incluidas
    savedEntries.forEach(savedEntry => {
      if (!combinedEntries.some(ce => ce.id === savedEntry.id)) {
        combinedEntries.push({
          ...savedEntry,
          moodEmoji: getMoodEmoji(savedEntry.moodRating)
        });
      }
    });

    // Ordenar por fecha (más recientes primero)
    combinedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    setJournalEntries(combinedEntries);
  }, [moodEntries]);

  const handleCreateNewEntry = () => {
    navigate('/register-mood');
  };

  const handleEditEntry = (entry) => {
    // Asegurarse de que la entrada existe en moodEntries
    const existingEntry = moodEntries.find(e => e.date === entry.date);
    if (!existingEntry) {
      const newMoodEntry = {
        date: entry.date,
        rating: entry.moodRating || 5,
        note: entry.content || '',
        title: entry.title || '',
      };
      setMoodEntries(prev => [newMoodEntry, ...prev.filter(e => e.date !== entry.date)]);
    }
    
    navigate(`/edit-note/${entry.date}`);
  };

  const handleDeleteEntry = (entryId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      const entryToDelete = journalEntries.find(e => e.id === entryId);
      if (entryToDelete) {
        // Eliminar de moodEntries si es una entrada de humor
        if (entryToDelete.isMoodNote) {
          setMoodEntries(prev => prev.filter(e => e.date !== entryToDelete.date));
        }
        // Actualizar journalEntries localmente
        setJournalEntries(prev => prev.filter(e => e.id !== entryId));
      }
    }
  };

  // Filtrar entradas
  let filteredEntries = journalEntries.filter(entry => {
    const matchesDate = selectedDate ? entry.date === selectedDate : true;
    const matchesSearch = searchQuery ?
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesDate && matchesSearch;
  });

  // Limitar a 30 entradas para usuarios free
  if (!userProfile?.isPremium) {
    filteredEntries = filteredEntries.slice(0, 30);
  }

  // Ordenar entradas
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'mood':
        return (b.moodRating || 0) - (a.moodRating || 0);
      case 'words':
        return (b.wordCount || 0) - (a.wordCount || 0);
      case 'date':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getPreviewText = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-8">
      <TopNavigation />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-gray-100 from-gray-50 to-gray-50 rounded-3xl shadow-xl p-8 max-w-4xl w-full border border-gray-200 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <BookOpen className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold from-purple-600 to-purple-800 bg-clip-text text-purple-600 mb-3">
            Mis Notas de Diario
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Registra tus pensamientos, emociones y reflexiones diarias
          </p>
        </motion.div>

        {/* Controles superiores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-50 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <motion.button
              onClick={handleCreateNewEntry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <PlusCircle className="w-6 h-6 text-white" />
              Nueva Nota de Diario
            </motion.button>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en mis notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 min-w-[250px]"
                />
              </div>

              {/* Filtro por fecha */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                />
                {selectedDate && (
                  <motion.button
                    onClick={() => setSelectedDate('')}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* Ordenar */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
              >
                <option value="date">Más recientes</option>
                <option value="title">Por título</option>
                <option value="mood">Por estado de ánimo</option>
                <option value="words">Por extensión</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Lista de notas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {!userProfile?.isPremium && journalEntries.length > 30 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800">Límite alcanzado</p>
                  <p className="text-sm text-yellow-700">Actualiza a Premium para ver todas tus notas ilimitadas.</p>
                </div>
              </div>
            </motion.div>
          )}
          {sortedEntries.length === 0 ? (
            <motion.div 
              className="backdrop-blur-xl border border-gray-200/50 rounded-3xl p-16 text-center shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <BookOpen className="w-16 h-16 text-blue-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedDate || searchQuery ? 'No se encontraron notas' : '¡Empieza tu diario!'}
              </h3>
              <p className="text-gray-500 text-lg mb-8">
                {selectedDate || searchQuery 
                  ? 'Intenta con otros filtros de búsqueda'
                  : 'Crea tu primera nota de diario y comienza a documentar tus pensamientos y experiencias'
                }
              </p>
              {(!selectedDate && !searchQuery) && (
                <motion.button
                  onClick={handleCreateNewEntry}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 font-bold py-3 px-6 rounded-xl shadow-lg"
                >
                  Crear Primera Nota
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {sortedEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group bg-gray-50 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50 mb-2"
                          >
                            <span className="text-2xl">{entry.moodEmoji}</span>
                          </motion.div>
                          {entry.moodRating && (
                            <div className="text-sm text-gray-600 text-center">
                              {entry.moodRating}/20
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 text-left">
                              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {entry.title}
                              </h3>
                              {entry.moodRating && (
                                <div className="text-sm text-gray-600 mb-2">
                                  Ánimo: {entry.moodRating}/20
                                </div>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="font-medium">{formatDate(entry.date)}</span>
                                <span>•</span>
                                <span>{entry.wordCount || 0} palabras</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4">
                              <motion.button
                                onClick={() => handleEditEntry(entry)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="Editar nota"
                              >
                                <Edit className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteEntry(entry.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Eliminar nota"
                              >
                                <Trash className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {getPreviewText(entry.content)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {entry.isMoodNote && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Nota de Estado de Ánimo
                            </span>
                          )}
                        </div>

                        <motion.button
                          onClick={() => handleEditEntry(entry)}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                        >
                          <span>Leer más</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Botón para volver */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-200/80 backdrop-blur-sm text-gray-700 font-medium py-3 px-8 rounded-xl border border-gray-300/50 hover:bg-gray-300/80 transition-all duration-300"
            >
              Volver al Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JournalScreen;