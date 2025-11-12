import { moodAdvice, motivationalMessages } from './moodUtils';

// AI-powered recommendations based on mood patterns
export const getMoodBasedRecommendations = (moodEntries, currentMood) => {
  const recommendations = {
    activities: [],
    advice: [],
    motivationalMessage: '',
    insights: []
  };

  // Analyze mood patterns
  const recentEntries = moodEntries.slice(-7); // Last 7 days
  const averageMood = recentEntries.reduce((sum, entry) => sum + entry.rating, 0) / recentEntries.length;

  // Activity recommendations based on current mood
  if (currentMood <= 5) {
    recommendations.activities = [
      'Practica respiración profunda por 5 minutos',
      'Escucha música relajante o sonidos de naturaleza',
      'Toma un baño caliente o ducha relajante',
      'Escribe en tu diario sobre lo que sientes',
      'Camina lentamente en un parque o jardín',
      'Prepara una infusión de hierbas calmantes',
      'Lee un libro inspirador o motivacional'
    ];
  } else if (currentMood <= 10) {
    recommendations.activities = [
      'Haz ejercicio moderado como yoga o tai chi',
      'Conecta con un amigo cercano',
      'Organiza tu espacio personal',
      'Aprende algo nuevo en línea',
      'Prepara una comida saludable',
      'Meditación guiada de 10 minutos',
      'Escribe metas pequeñas para el día'
    ];
  } else if (currentMood <= 15) {
    recommendations.activities = [
      'Sal a caminar o trotar',
      'Llama a un familiar querido',
      'Trabaja en un proyecto creativo',
      'Escucha un podcast motivacional',
      'Prueba una nueva receta',
      'Haz voluntariado o ayuda a alguien',
      'Planea una actividad divertida'
    ];
  } else {
    recommendations.activities = [
      'Comparte tu alegría con otros',
      'Crea algo artístico o musical',
      'Practica la gratitud escribiendo 3 cosas buenas',
      'Baila o canta tu canción favorita',
      'Planea una aventura o viaje',
      'Ayuda a alguien que lo necesite',
      'Celebra tus logros recientes'
    ];
  }

  // Get relevant advice
  const moodCategory = getMoodCategory(currentMood);
  recommendations.advice = moodAdvice[moodCategory] || [];

  // Select motivational message
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
  recommendations.motivationalMessage = motivationalMessages[randomIndex];

  // Generate insights
  recommendations.insights = generateInsights(moodEntries, currentMood, averageMood);

  return recommendations;
};

const getMoodCategory = (rating) => {
  if (rating <= 5) return 'Tristeza';
  if (rating <= 10) return 'Ansiedad';
  if (rating <= 15) return 'Estrés';
  return 'Alegría';
};

const generateInsights = (entries, currentMood, averageMood) => {
  const insights = [];

  if (entries.length < 3) {
    insights.push('Continúa registrando tu estado de ánimo para obtener mejores insights.');
    return insights;
  }

  // Trend analysis
  const trend = currentMood - averageMood;
  if (trend > 2) {
    insights.push('¡Tu ánimo está mejorando! Mantén las actividades positivas.');
  } else if (trend < -2) {
    insights.push('Tu ánimo ha bajado últimamente. Considera hablar con alguien de confianza.');
  }

  // Sleep correlation
  const sleepCorrelation = analyzeSleepCorrelation(entries);
  if (sleepCorrelation > 0.5) {
    insights.push('Tu calidad de sueño parece afectar positivamente tu ánimo.');
  } else if (sleepCorrelation < -0.5) {
    insights.push('Mejorar tu sueño podría ayudar a estabilizar tu ánimo.');
  }

  // Pattern recognition
  const patterns = detectPatterns(entries);
  if (patterns.weekendImprovement) {
    insights.push('Tu ánimo tiende a mejorar los fines de semana.');
  }
  if (patterns.weekdayDecline) {
    insights.push('Considera estrategias para manejar el estrés laboral.');
  }

  return insights;
};

const analyzeSleepCorrelation = (entries) => {
  let correlation = 0;
  let count = 0;

  for (let i = 1; i < entries.length; i++) {
    const moodDiff = entries[i].rating - entries[i-1].rating;
    const sleepDiff = entries[i].sleepQuality - entries[i-1].sleepQuality;
    correlation += moodDiff * sleepDiff;
    count++;
  }

  return count > 0 ? correlation / count : 0;
};

const detectPatterns = (entries) => {
  const patterns = {
    weekendImprovement: false,
    weekdayDecline: false
  };

  const weekendEntries = entries.filter(entry => {
    const date = new Date(entry.date);
    return date.getDay() === 0 || date.getDay() === 6;
  });

  const weekdayEntries = entries.filter(entry => {
    const date = new Date(entry.date);
    return date.getDay() >= 1 && date.getDay() <= 5;
  });

  if (weekendEntries.length > 0 && weekdayEntries.length > 0) {
    const avgWeekend = weekendEntries.reduce((sum, e) => sum + e.rating, 0) / weekendEntries.length;
    const avgWeekday = weekdayEntries.reduce((sum, e) => sum + e.rating, 0) / weekdayEntries.length;

    patterns.weekendImprovement = avgWeekend > avgWeekday + 1;
    patterns.weekdayDecline = avgWeekday < avgWeekend - 1;
  }

  return patterns;
};

// Smart notifications based on patterns
export const getSmartNotifications = (moodEntries, userProfile) => {
  const notifications = [];
  const today = new Date().toISOString().split('T')[0];
  const hasEntryToday = moodEntries.some(entry => entry.date === today);

  if (!hasEntryToday && userProfile.notifications) {
    notifications.push({
      type: 'reminder',
      title: '¿Cómo te sientes hoy?',
      message: 'No olvides registrar tu estado de ánimo diario.',
      time: userProfile.reminderTime
    });
  }

  // Pattern-based notifications
  const recentEntries = moodEntries.slice(-3);
  const lowMoodStreak = recentEntries.every(entry => entry.rating <= 7);

  if (lowMoodStreak && recentEntries.length >= 3) {
    notifications.push({
      type: 'care',
      title: 'Cuidando tu bienestar',
      message: 'Hemos notado que has tenido algunos días difíciles. ¿Quieres probar una actividad relajante?',
      time: 'now'
    });
  }

  // Sleep reminder
  const yesterdayEntry = moodEntries.find(entry => entry.date === new Date(Date.now() - 86400000).toISOString().split('T')[0]);
  if (yesterdayEntry && yesterdayEntry.sleepQuality <= 2) {
    notifications.push({
      type: 'sleep',
      title: 'Mejorando tu descanso',
      message: 'Anoche tuviste dificultades para dormir. ¿Quieres consejos para mejorar tu sueño?',
      time: 'evening'
    });
  }

  return notifications;
};