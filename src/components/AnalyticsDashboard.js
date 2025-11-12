import React, { useState, useEffect, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, BarChart3, Calendar, Clock,
  Target, Zap, Heart, Moon, Activity, Award, AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import analyticsEngine from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = memo(({ moodEntries, userProfile, isOpen, onClose }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState({});
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (isOpen && moodEntries.length > 0) {
      analyticsEngine.init(moodEntries, userProfile);
      setMetrics(analyticsEngine.getMetrics());
      setInsights(analyticsEngine.getInsights());
    }
  }, [isOpen, moodEntries, userProfile]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

    return moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffTime = Math.abs(now - entryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= days;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [moodEntries, timeRange]);

  const chartData = useMemo(() => {
    const labels = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    });

    const moodData = filteredEntries.map(entry => entry.rating);
    const sleepData = filteredEntries.map(entry => entry.sleepQuality);

    return {
      mood: {
        labels,
        datasets: [{
          label: 'Estado de Ánimo',
          data: moodData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      sleep: {
        labels,
        datasets: [{
          label: 'Calidad del Sueño',
          data: sleepData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        }]
      }
    };
  }, [filteredEntries]);

  const statsCards = useMemo(() => {
    if (!metrics.improvementMetrics) return [];

    const { improvementMetrics, sleepCorrelations } = metrics;

    return [
      {
        title: 'Promedio General',
        value: improvementMetrics.recentAverage?.toFixed(1) || '0.0',
        change: improvementMetrics.improvement?.toFixed(1) || '0.0',
        icon: BarChart3,
        color: 'blue'
      },
      {
        title: 'Tendencia',
        value: improvementMetrics.trend === 'improving' ? 'Mejorando' :
              improvementMetrics.trend === 'declining' ? 'Disminuyendo' : 'Estable',
        change: null,
        icon: improvementMetrics.trend === 'improving' ? TrendingUp :
              improvementMetrics.trend === 'declining' ? TrendingDown : Target,
        color: improvementMetrics.trend === 'improving' ? 'green' :
               improvementMetrics.trend === 'declining' ? 'red' : 'yellow'
      },
      {
        title: 'Correlación Sueño',
        value: sleepCorrelations?.strength || 'Sin datos',
        change: null,
        icon: Moon,
        color: 'purple'
      },
      {
        title: 'Consistencia',
        value: improvementMetrics.consistency === 'high' ? 'Alta' :
              improvementMetrics.consistency === 'moderate' ? 'Moderada' : 'Baja',
        change: null,
        icon: Activity,
        color: 'indigo'
      }
    ];
  }, [metrics]);

  const renderInsightCard = (insight, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-4 rounded-lg border ${
        insight.type === 'positive'
          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
          : insight.type === 'correlation'
            ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
            : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{insight.icon}</span>
        <div>
          <h4 className="font-semibold text-gray-900w dark:text-white">
            {insight.title}
          </h4>
          <p className="text-sm text-gray-600w dark:text-gray-300w mt-1">
            {insight.description}
          </p>
        </div>
      </div>
    </motion.div>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900w dark:text-white">
              Analytics y Estadísticas
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900w dark:text-white"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600w dark:text-gray-400w">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900w dark:text-white mt-1">
                      {card.value}
                    </p>
                    {card.change && (
                      <p className={`text-sm mt-1 ${
                        parseFloat(card.change) > 0
                          ? 'text-green-600'
                          : parseFloat(card.change) < 0
                            ? 'text-red-600'
                            : 'text-gray-600w'
                      }`}>
                        {parseFloat(card.change) > 0 ? '+' : ''}{card.change}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/20`}>
                    <card.icon className={`w-6 h-6 text-${card.color}-600 dark:text-${card.color}-400`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Mood Trend Chart */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900w dark:text-white mb-4">
                Tendencia del Estado de Ánimo
              </h3>
              {filteredEntries.length > 0 ? (
                <Line
                  data={chartData.mood}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Estado: ${context.parsed.y}/20`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                          stepSize: 2
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500w dark:text-gray-400w">
                  No hay suficientes datos para mostrar la gráfica
                </div>
              )}
            </div>

            {/* Sleep Quality Chart */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900w dark:text-white mb-4">
                Calidad del Sueño
              </h3>
              {filteredEntries.length > 0 ? (
                <Bar
                  data={chartData.sleep}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Calidad: ${context.parsed.y}/5`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center py-8 text-gray-500w dark:text-gray-400w">
                  No hay suficientes datos para mostrar la gráfica
                </div>
              )}
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900w dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Insights y Observaciones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map(renderInsightCard)}
              </div>
            </div>
          )}

          {/* Pattern Analysis */}
          {metrics.activityPatterns && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Weekday vs Weekend */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900w dark:text-white mb-4">
                  Patrón Semanal
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600w dark:text-gray-400w">Entre semana</span>
                    <span className="font-semibold text-gray-900w dark:text-white">
                      {metrics.activityPatterns.weekdayVsWeekend.weekdayAvg?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600w dark:text-gray-400w">Fin de semana</span>
                    <span className="font-semibold text-gray-900w dark:text-white">
                      {metrics.activityPatterns.weekdayVsWeekend.weekendAvg?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Time of Day */}
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900w dark:text-white mb-4">
                  Por Horario del Día
                </h3>
                <div className="space-y-3">
                  {['morning', 'afternoon', 'evening', 'night'].map(time => (
                    <div key={time} className="flex justify-between items-center">
                      <span className="text-gray-600w dark:text-gray-400w capitalize">
                        {time === 'morning' ? 'Mañana' :
                         time === 'afternoon' ? 'Tarde' :
                         time === 'evening' ? 'Noche' : 'Madrugada'}
                      </span>
                      <span className="font-semibold text-gray-900w dark:text-white">
                        {metrics.activityPatterns.timeOfDay[`${time}Avg`]?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

export default AnalyticsDashboard;