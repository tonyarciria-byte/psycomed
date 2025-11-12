import React from 'react';
import { motion } from 'framer-motion';
import { User, Music, BookOpen, Crown, Home, Pill } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopNavigation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="w-full max-w-2xl flex justify-around items-center bg-white/80 p-4 backdrop-blur-md rounded-full shadow-lg border border-gray-200  mb-8"
    >
      <Link to="/relaxation">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
        >
          <Music className="w-6 h-6" />
        </motion.button>
      </Link>

      <Link to="/journal">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
        >
          <BookOpen className="w-6 h-6" />
        </motion.button>
      </Link>

      {/* Botón Home - Centro y más destacado */}
      <Link to="/dashboard">
        <motion.button
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.85 }}
          className="p-4 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-lg border-2 border-white"
        >
          <Home className="w-7 h-7" />
        </motion.button>
      </Link>

      <Link to="/premium">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md"
        >
          <Crown className="w-6 h-6" />
        </motion.button>
      </Link>

      <Link to="/medications">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-md"
        >
          <Pill className="w-6 h-6" />
        </motion.button>
      </Link>

      <Link to="/profile">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md"
        >
          <User className="w-6 h-6" />
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default TopNavigation;