import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MoreHorizontal, Share, Trash, Settings } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const NoteEditor = ({ moodEntries, setMoodEntries }) => {
  const navigate = useNavigate();
  const { date } = useParams();
  const location = useLocation();
  const [currentNote, setCurrentNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [entryIndex, setEntryIndex] = useState(-1);
  const [hasChanges, setHasChanges] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);
  const titleRef = useRef(null);
  const originalDataRef = useRef({ title: '', note: '' });

  useEffect(() => {
    const index = moodEntries.findIndex(entry => entry.date === date);
    if (index !== -1) {
      setEntryIndex(index);
      const title = moodEntries[index].title || '';
      const note = moodEntries[index].note || '';
      setNoteTitle(title);
      setCurrentNote(note);
      originalDataRef.current = { title, note };
    } else {
      navigate('/dashboard');
    }
  }, [date, moodEntries, navigate]);

  useEffect(() => {
    const hasChanged = 
      noteTitle !== originalDataRef.current.title || 
      currentNote !== originalDataRef.current.note;
    setHasChanges(hasChanged);
    
    // Count words
    const words = currentNote.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [noteTitle, currentNote]);

  // Auto-save después de 2 segundos de inactividad
  useEffect(() => {
    if (!hasChanges || entryIndex === -1) return;

    const autoSaveTimer = setTimeout(() => {
      const updatedEntries = [...moodEntries];
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        title: noteTitle || 'Sin título',
        note: currentNote,
      };
      setMoodEntries(updatedEntries);
      originalDataRef.current = { title: noteTitle, note: currentNote };
      setHasChanges(false);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [noteTitle, currentNote, hasChanges, entryIndex, moodEntries, setMoodEntries]);

  const formatDate = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `Hoy a las ${timeStr}`;
  };

  const handleGoBack = () => {
    if (hasChanges && entryIndex !== -1) {
      const updatedEntries = [...moodEntries];
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        title: noteTitle || 'Sin título',
        note: currentNote,
      };
      setMoodEntries(updatedEntries);
    }
    navigate(-1);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textareaRef.current?.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white-50 flex flex-col overflow-hidden"
    >
      {/* Top Navigation Bar - Más compacta */}
      <motion.div 
        className="bg-white-50/95 backdrop-blur-xl border-b border-white-200/30 flex-shrink-0"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between px-6 py-3 max-w-none">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-blue-500 font-medium text-base hover:text-blue-600 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Notas</span>
            </motion.button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600ww">
            <span>{formatDate()}</span>
            {hasChanges ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
              >
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span>Editando...</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Guardado</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Listo
            </motion.button>
            <motion.button
              className="p-2 rounded-full hover:bg-white-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share className="w-4 h-4 text-gray-600ww" />
            </motion.button>
            <motion.button
              className="p-2 rounded-full hover:bg-white-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-600ww" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Ocupa toda la pantalla con bordes redondeados completos */}
      <motion.div 
        className="flex-1 overflow-hidden p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="h-full bg-white rounded-3xl shadow-sm border border-gray-200/50 flex flex-col overflow-hidden">
          
          {/* Title Section */}
          <div className="flex-shrink-0 px-12 pt-10 pb-6">
            <input
              ref={titleRef}
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              placeholder="Título"
              className="w-full text-4xl font-bold text-gray-900ww bg-transparent border-none outline-none placeholder-gray-400 leading-tight"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                fontWeight: '700'
              }}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500ww">
                {formatDate()}
              </div>
              <div className="text-sm text-gray-500ww">
                {wordCount} {wordCount === 1 ? 'palabra' : 'palabras'}
              </div>
            </div>
          </div>

          {/* Note Content - Área principal expandida con padding bottom para el redondeo */}
          <div className="flex-1 overflow-hidden">
            <textarea
              ref={textareaRef}
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Empezar a escribir..."
              className="w-full h-full px-12 text-gray-800ww bg-transparent border-none outline-none resize-none text-xl leading-relaxed placeholder-gray-400"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
                lineHeight: '1.7',
                fontSize: '19px'
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Status Bar - Más discreto */}
      <motion.div 
        className="bg-white-50/80 backdrop-blur-sm border-t border-white-200/30 px-6 py-2 flex-shrink-0"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center justify-between text-xs text-gray-500ww">
          <div className="flex items-center gap-4">
            <span>{currentNote.length} caracteres</span>
            {currentNote && <span>•</span>}
            {currentNote && <span>Última edición hace un momento</span>}
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                <span>Auto-guardando...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NoteEditor;