import { useMemo } from 'react';
import { getMoodBasedRecommendations } from '../utils/aiRecommendations';

/**
 * Hook personalizado para generar recomendaciones basadas en el estado de ánimo del usuario.
 * Utiliza la función getMoodBasedRecommendations para analizar entradas de ánimo y proporcionar
 * actividades sugeridas, consejos, mensajes motivacionales e insights.
 *
 * @param {Array} moodEntries - Array de entradas de estado de ánimo del usuario
 * @param {number} currentMood - Calificación actual del estado de ánimo (1-20)
 * @returns {Object} Objeto con recomendaciones que incluye actividades, consejos, mensaje motivacional e insights
 */
export const useMoodRecommendations = (moodEntries, currentMood) => {
  const recommendations = useMemo(() => {
    if (!moodEntries || !currentMood) {
      return {
        activities: [],
        advice: [],
        motivationalMessage: '',
        insights: []
      };
    }
    return getMoodBasedRecommendations(moodEntries, currentMood);
  }, [moodEntries, currentMood]);

  return recommendations;
};