import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, ExternalLink, Shield, Heart, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import TopNavigation from './TopNavigation';

const ProfileScreen = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  
  // Debug: Log profile changes
  console.log('ProfileScreen render - notifications:', userProfile.notifications, 'reminders:', userProfile.reminders);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-8">
      <TopNavigation />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border border-gray-200 text-center"
      >
        <motion.button
          onClick={() => navigate('/settings')}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 p-3 rounded-full bg-gray-200 text-gray-700w  shadow-lg hover:shadow-xl transition-all duration-300 z-10"
          title="Configuración General"
        >
          <Settings className="w-6 h-6 text-gray-700ww-24" />
        </motion.button>

        <User className="w-20 h-20 text-purple-600 text-purple-400 mx-auto mb-6 p-2 bg-purple-100 rounded-full" />
        <h2 className="text-4xl font-extrabold text-gray-700ww  mb-4">¡Hola, {userProfile.name}!</h2>
        <p className="text-lg text-gray-400ww-24 mb-8">Aquí puedes ver tu información personal y acceder a las configuraciones.</p>

        {/* Información del Perfil - Solo Lectura */}
        <div className="text-left space-y-4 mb-8 bg-gray-50 border border-gray-200 shadow-xl rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700ww-24">Edad:</span>
            <span className="text-gray-800ww-24">{userProfile.age} años</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700ww-24">País:</span>
            <span className="text-gray-800ww-24 ">{userProfile.country}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700ww-24">Diagnóstico:</span>
            <span className="text-gray-800ww-24 italic">{userProfile.diagnosis}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700ww-24">Idioma:</span>
            <span className="text-gray-800ww-24">{userProfile.language}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700ww-24">Notificaciones:</span>
            <span className={`font-bold flex items-center gap-2 ${userProfile.notifications ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              <Bell className="w-4 h-4" />
              {userProfile.notifications ? 'Activadas' : 'Desactivadas'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700ww-24">Recordatorios:</span>
            <span className={`font-bold flex items-center gap-2 ${userProfile.reminders ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              <Heart className="w-4 h-4" />
              {userProfile.reminders ? 'Activados' : 'Desactivados'}
            </span>
          </div>
          {userProfile.reminders && (
            <div className="flex items-center gap-3 pl-8">
              <span className="font-semibold text-gray-700ww-24">Hora:</span>
              <span className="text-gray-800ww-24">{userProfile.reminderTime || 'No configurada'}</span>
            </div>
          )}
        </div>

        {/* Configuraciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <User className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Editar Perfil</h3>
                <p className="text-sm opacity-90">Información personal</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/settings?section=security')}
            className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-4 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Seguridad</h3>
                <p className="text-sm opacity-90">Contraseña y privacidad</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/settings?section=notifications')}
            className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white p-4 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Notificaciones</h3>
                <p className="text-sm opacity-90">Recordatorios y alertas</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/settings?section=appearance')}
            className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-4 rounded-2xl shadow-lg cursor-pointer transition-all hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Apariencia</h3>
                <p className="text-sm opacity-90">Tema y personalización</p>
              </div>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </div>
          </motion.div>
        </div>
        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-gray-200 text-gray-700w font-bold py-2 px-4 rounded-xl hover:bg-gray-300 transition-all duration-300"
          >
            Volver al Dashboard
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;