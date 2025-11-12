import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WelcomeScreen = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-gray-200 white:border-gray-700"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <Heart className="w-16 h-16 text-blue-500 dark:text-blue-400" />
        </motion.div>
        <h1 className="text-4xl font-extrabold text-gray-900w mb-4 leading-tight">
          {t('welcome')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">PSICOMED</span>
        </h1>
        <p className="text-lg text-gray-200w dark:text-gray-600w mb-8">
          {t('welcomeMessage')}
        </p>
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600  text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t('startJourney')}
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;