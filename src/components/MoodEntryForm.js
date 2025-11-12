import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Edit, Check, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { validateMoodEntry, sanitizeInput } from '../utils/security';

// Constants moved outside component for better performance
const MOOD_EMOJIS = [
  '😭', '😖', '😓', '😔', '😞', '😟', '🙁', '😕', '😑', '😐',
  '🙂', '😊', '😌', '😃', '😄',  '😁', '😆', '😂', '🤩', '🤗'
];

const SLEEP_EMOJIS = ['😴', '😪', '😑', '😊', '😎'];

const CATEGORIZED_TAGS = {
  Felicidad: [
    'Felicidad', 'Alegría', 'Euforia', 'Entusiasmo', 'Satisfacción', 'Placer', 'Contento', 'Optimista',
    'Motivado', 'Energético', 'Animado', 'Radiante', 'Exultante', 'Jubiloso', 'Regocijado', 'Triunfante',
    'Excitado', 'Encantado', 'Feliz', 'Gozo'
  ],
  Tristeza: [
    'Tristeza', 'Melancolía', 'Depresión', 'Desánimo', 'Soledad', 'Desesperación', 'Angustia', 'Pesar',
    'Desconsuelo', 'Aflicción', 'Lágrimas', 'Nostalgia', 'Desilusión', 'Abatimiento', 'Desolación', 'Dolor',
    'Triste', 'Apesadumbrado', 'Lamentable', 'Desalentado'
  ],
  Furia: [
    'Furia', 'Ira', 'Enojo', 'Rabioso', 'Furioso', 'Colérico', 'Indignado', 'Exasperado',
    'Irritado', 'Enfurecido', 'Encolerizado', 'Airado', 'Furibundo', 'Rabioso', 'Violento', 'Agresivo',
    'Hostil', 'Beligerante', 'Enfado', 'Iracundo'
  ],
  Miedo: [
    'Miedo', 'Terror', 'Pánico', 'Ansiedad', 'Preocupación', 'Inquietud', 'Temeroso', 'Asustado',
    'Aterrorizado', 'Petrificado', 'Espantado', 'Horrorizado', 'Amedrentado', 'Cobarde', 'Tímido', 'Aprensivo',
    'Nervioso', 'Inseguro', 'Paranoico', 'Fóbico'
  ]
};

const EMOJI_VARIANTS = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.3
    }
  }
};

const MoodEntryForm = memo(({ onSaveMood }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    moodRating: 10,
    selectedTags: [],
    note: '',
    sleepQuality: 3
  });

  const [uiState, setUiState] = useState({
    emojiKey: 0,
    expandedCategories: {},
    isSubmitting: false,
    errors: {}
  });

  // Memoized handlers for performance
  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'note' ? sanitizeInput(value) : value
    }));

    // Clear errors when user starts typing
    if (uiState.errors[field]) {
      setUiState(prev => ({
        ...prev,
        errors: { ...prev.errors, [field]: null }
      }));
    }
  }, [uiState.errors]);

  const handleTagToggle = useCallback((tag) => {
    setFormData(prev => {
      const isSelected = prev.selectedTags.includes(tag);
      if (isSelected) {
        return {
          ...prev,
          selectedTags: prev.selectedTags.filter(t => t !== tag)
        };
      } else if (prev.selectedTags.length < 5) {
        return {
          ...prev,
          selectedTags: [...prev.selectedTags, tag]
        };
      }
      return prev;
    });
  }, []);

  const toggleCategory = useCallback((category) => {
    setUiState(prev => ({
      ...prev,
      expandedCategories: {
        ...prev.expandedCategories,
        [category]: !prev.expandedCategories[category]
      }
    }));
  }, []);

  // Animate emojis when values change
  useEffect(() => {
    setUiState(prev => ({ ...prev, emojiKey: prev.emojiKey + 1 }));
  }, [formData.moodRating, formData.sleepQuality]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    setUiState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const newMoodEntry = {
        rating: formData.moodRating,
        tags: formData.selectedTags,
        note: sanitizeInput(formData.note.trim()),
        sleepQuality: formData.sleepQuality,
        date: new Date().toISOString().split('T')[0],
      };

      // Validate entry
      const validationErrors = validateMoodEntry(newMoodEntry);
      if (validationErrors.length > 0) {
        setUiState(prev => ({
          ...prev,
          errors: { general: validationErrors.join(', ') },
          isSubmitting: false
        }));
        return;
      }

      await onSaveMood(newMoodEntry);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving mood entry:', error);
      setUiState(prev => ({
        ...prev,
        errors: { general: 'Error al guardar la entrada. Inténtalo de nuevo.' },
        isSubmitting: false
      }));
    }
  }, [formData, onSaveMood, navigate]);

  // Error display
  const renderErrors = () => {
    if (!uiState.errors.general) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
      >
        {uiState.errors.general}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white  rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200 "
    >
      <h2 className="text-3xl font-bold text-gray-800ww  mb-6 text-center">
        {t('howDoYouFeel')}
      </h2>

      {renderErrors()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Rating */}
        <div>
          <label className="block text-gray-700ww  text-lg font-semibold mb-3">
            1. {t('moodLevel')}: <span className="text-blue-600">{formData.moodRating}/20 </span>
            <motion.span
              key={`mood-${uiState.emojiKey}`}
              variants={EMOJI_VARIANTS}
              initial="hidden"
              animate="visible"
              className="inline-block text-2xl"
            >
              {MOOD_EMOJIS[formData.moodRating - 1]}
            </motion.span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={formData.moodRating}
            onChange={(e) => handleFormChange('moodRating', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200  rounded-lg appearance-none cursor-pointer accent-blue-500"
            disabled={uiState.isSubmitting}
          />
          <div className="flex justify-between text-sm text-gray-500ww  mt-2">
            <span>{t('veryBad')}</span>
            <span>{t('excellent')}</span>
          </div>
        </div>

        {/* Tags - Categorizados */}
        <div>
          <label className="block text-gray-700ww  text-lg font-semibold mb-3">
            2. {t('whatEmotions')} ({t('maxEmotions')})
          </label>
          <div className="space-y-2">
            {Object.entries(CATEGORIZED_TAGS).map(([category, tags]) => (
              <div key={category} className="border border-gray-200  rounded-lg overflow-hidden">
                <motion.button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50  hover:bg-gray-100  transition-colors"
                  whileTap={{ scale: 0.98 }}
                  disabled={uiState.isSubmitting}
                >
                  <h4 className="text-md font-semibold text-gray-800ww ">{category}</h4>
                  <motion.div
                    animate={{ rotate: uiState.expandedCategories[category] ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600ww " />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {uiState.expandedCategories[category] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-3 pb-3"
                    >
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <motion.button
                            key={tag}
                            type="button"
                            onClick={() => handleTagToggle(tag)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={uiState.isSubmitting}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1
                              ${formData.selectedTags.includes(tag)
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700ww  hover:bg-gray-200 '
                              }`}
                          >
                            <Tag className="w-3 h-3" /> {tag}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Add Detailed Note Button */}
        <div>
          <label className="block text-gray-700ww  text-lg font-semibold mb-3">
            3. {t('addDetailedNote')}
          </label>
          <motion.button
            type="button"
            onClick={() => {
              const newMoodEntry = {
                rating: formData.moodRating,
                tags: formData.selectedTags,
                note: '',
                sleepQuality: formData.sleepQuality,
                date: new Date().toISOString().split('T')[0],
              };
              onSaveMood(newMoodEntry);
              const today = new Date().toISOString().split('T')[0];
              navigate(`/edit-note/${today}`, { state: { from: '/register-mood' } });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uiState.isSubmitting}
            className="w-full p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Edit className="w-5 h-5" /> {t('addDetailedNoteButton')}
          </motion.button>
        </div>

        {/* Sleep Quality */}
        <div>
          <label className="block text-gray-700ww  text-lg font-semibold mb-3">
            4. {t('howDidYouSleep')} <span className="text-green-600">{formData.sleepQuality}/5 </span>
            <motion.span
              key={`sleep-${uiState.emojiKey}`}
              variants={EMOJI_VARIANTS}
              initial="hidden"
              animate="visible"
              className="inline-block text-2xl"
            >
              {SLEEP_EMOJIS[formData.sleepQuality - 1]}
            </motion.span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.sleepQuality}
            onChange={(e) => handleFormChange('sleepQuality', parseInt(e.target.value))}
            className="w-full h-3 bg-gray-200  rounded-lg appearance-none cursor-pointer accent-green-500"
            disabled={uiState.isSubmitting}
          />
          <div className="flex justify-between text-sm text-gray-500ww  mt-2">
            <span>{t('veryTired')}</span>
            <span>{t('veryEnergetic')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-200 ">
          <motion.button
            type="button"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uiState.isSubmitting}
            className="px-6 py-3 rounded-xl font-semibold text-gray-700ww  bg-gray-200  hover:bg-gray-300  transition-all duration-200 disabled:opacity-50"
          >
            {t('cancel')}
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={uiState.isSubmitting}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uiState.isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Check className="inline-block w-5 h-5" /> {t('saveMood')}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
});

export default MoodEntryForm;