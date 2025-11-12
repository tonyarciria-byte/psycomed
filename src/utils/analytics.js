// Real-time Analytics System
import { encryptData, decryptData } from './security';

class AnalyticsEngine {
  constructor() {
    this.metrics = {
      moodTrends: [],
      activityPatterns: [],
      sleepCorrelations: [],
      triggerAnalysis: [],
      improvementMetrics: []
    };
    this.realTimeData = {};
    this.subscribers = [];
  }

  // Initialize analytics
  init(moodEntries, userProfile) {
    this.processHistoricalData(moodEntries);
    this.setupRealTimeTracking();
    this.calculateBaselineMetrics(userProfile);
  }

  // Process historical mood data
  processHistoricalData(entries) {
    if (!entries || entries.length === 0) return;

    // Calculate mood trends
    this.metrics.moodTrends = this.calculateMoodTrends(entries);

    // Analyze activity patterns
    this.metrics.activityPatterns = this.analyzeActivityPatterns(entries);

    // Sleep-mood correlations
    this.metrics.sleepCorrelations = this.analyzeSleepCorrelations(entries);

    // Trigger analysis
    this.metrics.triggerAnalysis = this.analyzeTriggers(entries);

    // Improvement metrics
    this.metrics.improvementMetrics = this.calculateImprovementMetrics(entries);
  }

  // Calculate mood trends over time
  calculateMoodTrends(entries) {
    const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedEntries.map((entry, index) => {
      const weekBefore = sortedEntries.slice(Math.max(0, index - 7), index);
      const avgBefore = weekBefore.length > 0
        ? weekBefore.reduce((sum, e) => sum + e.rating, 0) / weekBefore.length
        : entry.rating;

      return {
        date: entry.date,
        rating: entry.rating,
        trend: entry.rating - avgBefore,
        weekAverage: avgBefore,
        volatility: this.calculateVolatility(weekBefore.concat(entry))
      };
    });
  }

  // Analyze activity patterns
  analyzeActivityPatterns(entries) {
    const patterns = {
      weekdayVsWeekend: { weekday: [], weekend: [] },
      timeOfDay: { morning: [], afternoon: [], evening: [], night: [] },
      seasonal: {},
      monthly: {}
    };

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      // Weekday vs Weekend
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        patterns.weekdayVsWeekend.weekend.push(entry);
      } else {
        patterns.weekdayVsWeekend.weekday.push(entry);
      }

      // Time of day
      if (hour >= 6 && hour < 12) {
        patterns.timeOfDay.morning.push(entry);
      } else if (hour >= 12 && hour < 18) {
        patterns.timeOfDay.afternoon.push(entry);
      } else if (hour >= 18 && hour < 22) {
        patterns.timeOfDay.evening.push(entry);
      } else {
        patterns.timeOfDay.night.push(entry);
      }

      // Monthly patterns
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!patterns.monthly[monthKey]) {
        patterns.monthly[monthKey] = [];
      }
      patterns.monthly[monthKey].push(entry);
    });

    // Calculate averages
    Object.keys(patterns).forEach(key => {
      if (key === 'weekdayVsWeekend') {
        patterns[key].weekdayAvg = patterns[key].weekday.length > 0
          ? patterns[key].weekday.reduce((sum, e) => sum + e.rating, 0) / patterns[key].weekday.length
          : 0;
        patterns[key].weekendAvg = patterns[key].weekend.length > 0
          ? patterns[key].weekend.reduce((sum, e) => sum + e.rating, 0) / patterns[key].weekend.length
          : 0;
      } else if (key === 'timeOfDay') {
        Object.keys(patterns[key]).forEach(timeKey => {
          if (Array.isArray(patterns[key][timeKey])) {
            patterns[key][`${timeKey}Avg`] = patterns[key][timeKey].length > 0
              ? patterns[key][timeKey].reduce((sum, e) => sum + e.rating, 0) / patterns[key][timeKey].length
              : 0;
          }
        });
      }
    });

    return patterns;
  }

  // Analyze sleep-mood correlations
  analyzeSleepCorrelations(entries) {
    const correlations = [];

    entries.forEach((entry, index) => {
      if (index > 0) {
        const prevEntry = entries[index - 1];
        const moodChange = entry.rating - prevEntry.rating;
        const sleepChange = entry.sleepQuality - prevEntry.sleepQuality;

        correlations.push({
          date: entry.date,
          moodChange,
          sleepChange,
          correlation: moodChange * sleepChange
        });
      }
    });

    const avgCorrelation = correlations.length > 0
      ? correlations.reduce((sum, c) => sum + c.correlation, 0) / correlations.length
      : 0;

    return {
      correlations,
      averageCorrelation: avgCorrelation,
      strength: Math.abs(avgCorrelation) > 0.5 ? 'strong' : Math.abs(avgCorrelation) > 0.3 ? 'moderate' : 'weak'
    };
  }

  // Analyze potential triggers
  analyzeTriggers(entries) {
    const triggers = {
      lowMoodDays: [],
      highMoodDays: [],
      suddenChanges: [],
      patterns: {}
    };

    entries.forEach((entry, index) => {
      // Low mood days (rating <= 3)
      if (entry.rating <= 3) {
        triggers.lowMoodDays.push({
          date: entry.date,
          rating: entry.rating,
          tags: entry.tags,
          note: entry.note
        });
      }

      // High mood days (rating >= 8)
      if (entry.rating >= 8) {
        triggers.highMoodDays.push({
          date: entry.date,
          rating: entry.rating,
          tags: entry.tags,
          note: entry.note
        });
      }

      // Sudden changes
      if (index > 0) {
        const prevEntry = entries[index - 1];
        const change = Math.abs(entry.rating - prevEntry.rating);
        if (change >= 3) {
          triggers.suddenChanges.push({
            date: entry.date,
            change,
            direction: entry.rating > prevEntry.rating ? 'increase' : 'decrease',
            from: prevEntry.rating,
            to: entry.rating
          });
        }
      }
    });

    // Analyze tag patterns
    const tagPatterns = {};
    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        if (!tagPatterns[tag]) {
          tagPatterns[tag] = { count: 0, avgRating: 0, entries: [] };
        }
        tagPatterns[tag].count++;
        tagPatterns[tag].avgRating = (tagPatterns[tag].avgRating + entry.rating) / 2;
        tagPatterns[tag].entries.push(entry);
      });
    });

    triggers.patterns = tagPatterns;
    return triggers;
  }

  // Calculate improvement metrics
  calculateImprovementMetrics(entries) {
    if (entries.length < 7) return { insufficientData: true };

    const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentEntries = sortedEntries.slice(-14); // Last 2 weeks
    const olderEntries = sortedEntries.slice(-28, -14); // Previous 2 weeks

    const recentAvg = recentEntries.reduce((sum, e) => sum + e.rating, 0) / recentEntries.length;
    const olderAvg = olderEntries.length > 0
      ? olderEntries.reduce((sum, e) => sum + e.rating, 0) / olderEntries.length
      : recentAvg;

    const improvement = recentAvg - olderAvg;
    const trend = improvement > 0.5 ? 'improving' : improvement < -0.5 ? 'declining' : 'stable';

    // Calculate consistency
    const recentVolatility = this.calculateVolatility(recentEntries);
    const consistency = recentVolatility < 1 ? 'high' : recentVolatility < 2 ? 'moderate' : 'low';

    return {
      recentAverage: recentAvg,
      olderAverage: olderAvg,
      improvement,
      trend,
      consistency,
      volatility: recentVolatility,
      streakAnalysis: this.calculateStreakAnalysis(sortedEntries)
    };
  }

  // Calculate volatility (standard deviation)
  calculateVolatility(entries) {
    if (entries.length < 2) return 0;

    const ratings = entries.map(e => e.rating);
    const mean = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    const squaredDiffs = ratings.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / squaredDiffs.length;

    return Math.sqrt(variance);
  }

  // Calculate streak analysis
  calculateStreakAnalysis(entries) {
    let currentStreak = 0;
    let bestStreak = 0;
    let streakType = 'neutral';

    entries.forEach((entry, index) => {
      if (index === 0) return;

      const prevEntry = entries[index - 1];
      const isImproving = entry.rating > prevEntry.rating;
      const isDeclining = entry.rating < prevEntry.rating;

      if (isImproving && (streakType === 'improving' || streakType === 'neutral')) {
        currentStreak++;
        streakType = 'improving';
      } else if (isDeclining && (streakType === 'declining' || streakType === 'neutral')) {
        currentStreak++;
        streakType = 'declining';
      } else {
        currentStreak = 1;
        streakType = isImproving ? 'improving' : isDeclining ? 'declining' : 'neutral';
      }

      bestStreak = Math.max(bestStreak, currentStreak);
    });

    return {
      currentStreak,
      bestStreak,
      streakType
    };
  }

  // Setup real-time tracking
  setupRealTimeTracking() {
    this.realTimeData = {
      sessionStart: new Date(),
      interactions: 0,
      timeSpent: 0,
      featuresUsed: new Set(),
      lastActivity: new Date()
    };

    // Track user interactions
    const trackInteraction = () => {
      this.realTimeData.interactions++;
      this.realTimeData.lastActivity = new Date();
      this.notifySubscribers('interaction', this.realTimeData);
    };

    // Add event listeners
    document.addEventListener('click', trackInteraction);
    document.addEventListener('scroll', trackInteraction);
    document.addEventListener('keydown', trackInteraction);

    // Track time spent
    setInterval(() => {
      this.realTimeData.timeSpent += 1;
      this.notifySubscribers('timeUpdate', this.realTimeData);
    }, 60000); // Every minute
  }

  // Add new mood entry to analytics
  addMoodEntry(entry) {
    // Update real-time metrics
    this.realTimeData.featuresUsed.add('mood_entry');
    this.notifySubscribers('moodEntry', entry);

    // Recalculate metrics
    this.processHistoricalData([...this.getHistoricalData(), entry]);
  }

  // Get historical data (mock implementation)
  getHistoricalData() {
    // In a real app, this would fetch from a database
    return JSON.parse(localStorage.getItem('moodEntries') || '[]');
  }

  // Subscribe to real-time updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify subscribers
  notifySubscribers(event, data) {
    this.subscribers.forEach(callback => callback(event, data));
  }

  // Get current metrics
  getMetrics() {
    return {
      ...this.metrics,
      realTime: this.realTimeData
    };
  }

  // Export analytics data
  exportData() {
    return encryptData({
      metrics: this.metrics,
      realTime: this.realTimeData,
      exportDate: new Date().toISOString()
    });
  }

  // Calculate baseline metrics for user
  calculateBaselineMetrics(userProfile) {
    // Calculate user's baseline mood
    const entries = this.getHistoricalData();
    if (entries.length > 0) {
      const avgMood = entries.reduce((sum, e) => sum + e.rating, 0) / entries.length;
      const baselineMood = Math.round(avgMood);

      this.metrics.baselineMood = baselineMood;
      this.metrics.moodRange = {
        min: Math.min(...entries.map(e => e.rating)),
        max: Math.max(...entries.map(e => e.rating)),
        average: avgMood
      };
    }
  }

  // Get insights based on current data
  getInsights() {
    const insights = [];

    if (this.metrics.improvementMetrics?.trend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Tendencia Positiva',
        description: 'Tu estado de ánimo ha mostrado una mejora consistente en las últimas semanas.',
        icon: '📈'
      });
    }

    if (this.metrics.sleepCorrelations?.strength === 'strong') {
      insights.push({
        type: 'correlation',
        title: 'Correlación Sueño-Ánimo',
        description: 'Hay una fuerte relación entre tu calidad de sueño y tu estado de ánimo.',
        icon: '😴'
      });
    }

    if (this.metrics.activityPatterns?.weekdayVsWeekend) {
      const { weekdayAvg, weekendAvg } = this.metrics.activityPatterns.weekdayVsWeekend;
      if (Math.abs(weekdayAvg - weekendAvg) > 1) {
        insights.push({
          type: 'pattern',
          title: 'Patrón Semanal',
          description: weekendAvg > weekdayAvg
            ? 'Tu ánimo tiende a mejorar los fines de semana.'
            : 'Tu ánimo tiende a ser más bajo durante los fines de semana.',
          icon: '📅'
        });
      }
    }

    return insights;
  }
}

// Export singleton instance
export const analyticsEngine = new AnalyticsEngine();
export default analyticsEngine;