import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { moodAdvice, moodCategories } from '../utils/moodUtils';

const SupportScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [advice, setAdvice] = useState('');

  const moodColors = {
    'Alegría': 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500',
    'Tristeza': 'bg-blue-400 text-blue-900 hover:bg-blue-500',
    'Ansiedad': 'bg-purple-400 text-purple-900 hover:bg-purple-500',
    'Estrés': 'bg-red-400 text-red-900 hover:bg-red-500',
    'Calma': 'bg-green-400 text-green-900 hover:bg-green-500',
    'Cansancio': 'bg-gray-400 text-gray-900w hover:bg-gray-500',
    'Motivación': 'bg-orange-400 text-orange-900 hover:bg-orange-500',
    'Frustración': 'bg-pink-400 text-pink-900 hover:bg-pink-500'
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    const advices = moodAdvice[mood] || ['No hay consejos disponibles.'];
    const randomIndex = Math.floor(Math.random() * advices.length);
    setAdvice(advices[randomIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 white:to-gray-800 p-4 pt-8">
      <TopNavigation />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white white:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200 white:border-gray-700 text-center"
      >
        <Rocket className="w-16 h-16 text-purple-500 white:text-purple-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800w white:text-white mb-4">Apoyo Personalizado</h2>
        <p className="text-gray-600w white:text-gray-300w mb-6">Selecciona cómo te sientes para recibir un consejo.</p>

        <div className="space-y-6 mb-8">
          {Object.entries(moodCategories).map(([category, moods]) => (
            <div key={category} className="text-left">
              <h3 className="text-xl font-bold text-gray-700w white:text-gray-300w mb-3">{category}</h3>
              <div className="grid grid-cols-2 gap-3">
                {moods.map(mood => (
                  <motion.button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    whileHover={{ scale: 1.05, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${moodColors[mood]} ${selectedMood === mood ? 'ring-2 ring-blue-500 white:ring-blue-400' : ''}`}
                  >
                    {mood}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {advice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 white:bg-blue-900/20 p-6 rounded-xl border border-blue-200 white:border-blue-800 text-left shadow-md"
          >
            <h3 className="text-xl font-bold text-blue-800 white:text-blue-200 mb-3">Consejo para "{selectedMood}":</h3>
            <p className="text-blue-700 white:text-blue-300 leading-relaxed">{advice}</p>
          </motion.div>
        )}

        <Link to="/dashboard">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-8 bg-gray-200 white:bg-gray-700 text-gray-700w white:text-gray-300w py-2 px-4 rounded-xl">
            Volver al Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default SupportScreen;