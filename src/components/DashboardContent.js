import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Plus } from 'lucide-react';
import MoodHistory from './MoodHistory';
import MoodChart from './MoodChart';

const DashboardContent = ({ moodEntries, setMoodEntries, onRegisterMoodClick, userProfile }) => {
  // Buscar entrada de hoy
  const todayMood =
    moodEntries.find(entry => entry.date === new Date().toISOString().split('T')[0]) || {
      rating: 10,
      emoji: '😐',
      message: 'Aún no has registrado tu ánimo hoy.'
    };

  // Emojis y mensajes dinámicos - Ahora con 20 frases exactas para cada ranking
  if (todayMood.rating) {
    const moodEmojis = [
      '😭', '😖', '😓', '😔', '😞', '😟', '🙁', '😕', '😑', '😐',
      '🙂', '😊', '😌', '😃', '😄',  '😁', '😆', '😂', '🤩', '🤗' // 20 niveles completos para máxima precisión
    ];

    const moodMessages = [ // 20 frases únicas, una por ranking, con emojis para vibe
      'Hoy todo se siente pesado como una nube de tormenta, pero un rayito de sol está por asomarse. ☁️',
      'Un día nublado en el corazón. Respira hondo, el viento cambia pronto. 💨',
      'Agotado pero luchando. Recuerda: los héroes también tienen días duros. 🦸‍♂️',
      'Bajo de batería emocional. Enciéndete con una canción que te levante. 🎶',
      'Tristeza ligera, como lluvia fina. Un café caliente lo arregla un poco. ☕',
      'No es el mejor día, pero estás aquí. Eso ya cuenta como victoria. 🏆',
      'Un poco desanimado, pero mañana pinta mejor. Confía en el giro. 🔄',
      'Neutro total, como un día sin estaciones. ¡Hora de crear tu propio sol! ☀️',
      'Mejorando poquito a poco. Sonríe un segundo, se siente bien. 😏',
      'Equilibrado y calmado. Fluyes como un río tranquilo. 🌊',
      '¡Subiendo el ánimo! Siente esa chispa interna creciendo. ✨',
      'Bastante bueno, como un abrazo inesperado. Disfrútalo. 🤗',
      'Relajado y en paz. El universo está de tu lado hoy. 🌌',
      '¡Energía positiva a tope! Baila por dentro, el día es tuyo. 💃',
      'Radiante como el sol de mediodía. Brilla sin parar. 🌞',
      'Risa fácil y corazón ligero. ¡La vida te guiña el ojo! 😉',
      'Felicidad que burbujea. Comparte un poco con el mundo. 🫧',
      '¡Euforia en el aire! Salta, grita, conquista lo que venga. 🚀',
      'Estrellas en los ojos, todo es mágico. Vive el momento al máximo. ⭐',
      '¡Pico de la montaña! Eres invencible, el mundo celebra contigo. 🎉'
    ];

    todayMood.emoji = moodEmojis[todayMood.rating - 1];
    todayMood.message = moodMessages[todayMood.rating - 1];
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-b from-gray-50w to-gray-50w rounded-3xl shadow-xl p-8 max-w-3xl w-full border border-gray-200 text-center"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800www">
          Bienvenido de nuevo 👋
        </h2>
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg"
        >
          <Smile className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Estado de ánimo de hoy */}
      <div className="text-center mb-10">
        <p className="text-gray-600ww  text-lg mb-4">Tu estado de ánimo hoy:</p>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, delay: 0.4 }}
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center
            bg-gradient-to-br from-green-100 to-blue-100 border-4 border-green-300  shadow-inner"
        >
          <span className="text-6xl">{todayMood.emoji}</span>
        </motion.div>
        <p className="text-xl font-semibold text-gray-700www mt-4 leading-relaxed text-center">
          {todayMood.message}
        </p>
      </div>

      {/* Botón registrar ánimo */}
      <motion.button
        onClick={onRegisterMoodClick}
        whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 text-lg"
      >
        <Plus className="w-6 h-6" />
        Registrar mi ánimo
      </motion.button>

      {/* Gráficos e historial */}
      <div className="mt-10 space-y-8">
        <MoodChart moodEntries={moodEntries} userProfile={userProfile} />
        <MoodHistory
          moodEntries={moodEntries}
          onClearHistory={() => setMoodEntries([])}
          onAddNewMood={onRegisterMoodClick}
        />
      </div>
    </motion.div>
  );
};

export default DashboardContent;