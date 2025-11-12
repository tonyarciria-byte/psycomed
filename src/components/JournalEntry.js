import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Calendar } from 'lucide-react';

const JournalEntry = ({ entry, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 text-left"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-600w">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">{entry.date}</span>
        </div>
        <motion.button
          onClick={() => onEdit(entry)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
        >
          <Edit className="w-5 h-5" />
        </motion.button>
      </div>
      <p className="text-gray-800w leading-relaxed whitespace-pre-wrap">{entry.content}</p>
      {entry.moodRating && (
        <p className="text-sm text-gray-500w mt-4">
          Ánimo registrado ese día: {entry.moodRating}/10 {entry.moodEmoji}
        </p>
      )}
    </motion.div>
  );
};

export default JournalEntry;