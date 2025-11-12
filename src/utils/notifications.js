// Smart notifications system
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title, options = {}) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }
  return null;
};

export const scheduleNotification = (title, options = {}, delay = 0) => {
  if (delay === 0) {
    return showNotification(title, options);
  }

  return setTimeout(() => {
    showNotification(title, options);
  }, delay);
};

export const scheduleDailyReminder = (time, title, message) => {
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);

  if (reminderTime <= now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }

  const delay = reminderTime.getTime() - now.getTime();

  return scheduleNotification(title, {
    body: message,
    tag: 'daily-reminder'
  }, delay);
};

export const showMoodReminder = () => {
  showNotification('¿Cómo te sientes hoy?', {
    body: 'Toma un momento para registrar tu estado de ánimo diario.',
    tag: 'mood-reminder',
    actions: [
      { action: 'register', title: 'Registrar' },
      { action: 'later', title: 'Más tarde' }
    ]
  });
};

export const showCareNotification = (message) => {
  showNotification('Cuidando tu bienestar', {
    body: message,
    tag: 'care-notification',
    icon: '/heart-icon.png'
  });
};

export const showAchievementNotification = (achievement) => {
  showNotification('¡Nuevo logro!', {
    body: achievement,
    tag: 'achievement',
    icon: '/trophy-icon.png'
  });
};

// Browser notification click handler
export const setupNotificationClickHandler = (callback) => {
  if ('Notification' in window) {
    // Handle notification clicks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'notification-click') {
          callback(event.data.action);
        }
      });
    }
  }
};