import React, { useState } from 'react';  
import { motion, AnimatePresence } from 'framer-motion';  
import { Bar } from 'react-chartjs-2';  
import {   
  Chart as ChartJS,  
  CategoryScale,  
  LinearScale,  
  BarElement,  
  Title,  
  Tooltip,  
  Legend  
} from 'chart.js';  
import { BarChart3, Moon, Calendar, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

// Registramos los componentes necesarios de Chart.js  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);  

// Helper para getWeek (aproximado)  
Date.prototype.getWeek = function() {  
  const firstDayOfYear = new Date(this.getFullYear(), 0, 1);  
  const pastDaysOfYear = (this - firstDayOfYear) / 86400000;  
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);  
};  

const MoodChart = ({ moodEntries = [], userProfile }) => {
  const [viewPeriod, setViewPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly', 'yearly'  
  const [currentPeriod, setCurrentPeriod] = useState(new Date()); // Para navegar períodos  

  // Función para obtener entradas agrupadas por período  
  const getGroupedEntries = (entries, period) => {  
    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));  
    if (period === 'daily') {  
      // Para daily, limitar a últimos 30 días para que aparezca bien  
      const cutoffDate = new Date();  
      cutoffDate.setDate(cutoffDate.getDate() - 30);  
      const recent = sorted.filter(entry => new Date(entry.date) >= cutoffDate);  
      return recent.map(entry => ({  
        key: entry.date,  
        label: new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),  
        avgMood: entry.rating,  
        avgSleep: entry.sleepQuality,  
        count: 1,  
        notes: entry.note || 'Sin nota',  
        entries: [entry]  
      }));  
    }  

    const grouped = {};  
    sorted.forEach(entry => {  
      let key;  
      const date = new Date(entry.date);  
      if (period === 'weekly') {  
        const weekStart = new Date(date);  
        weekStart.setDate(date.getDate() - date.getDay()); // Lunes como inicio de semana  
        key = weekStart.toISOString().split('T')[0];  
      } else if (period === 'monthly') {  
        key = entry.date.substring(0, 7); // YYYY-MM  
      } else if (period === 'yearly') {  
        key = entry.date.substring(0, 4); // YYYY  
      }  
      if (!grouped[key]) grouped[key] = [];  
      grouped[key].push(entry);  
    });  

    // Convertir a array con promedios  
    const processed = Object.entries(grouped).map(([key, items]) => {  
      const avgMood = Math.round(items.reduce((sum, i) => sum + i.rating, 0) / items.length * 10) / 10; // Promedio en 1-20  
      const avgSleep = Math.round(items.reduce((sum, i) => sum + i.sleepQuality, 0) / items.length * 10) / 10;  
      const notesSummary = items.map(i => i.note).filter(n => n).join('; ') || 'Sin notas';  
      return {  
        key,  
        label: key,  
        avgMood,  
        avgSleep,  
        count: items.length,  
        notes: notesSummary,  
        entries: items // Para tooltips  
      };  
    });  

    // Filtrar por período actual (últimos X para no sobrecargar)  
    const cutoffDate = new Date(currentPeriod);  
    if (period === 'weekly') {  
      cutoffDate.setDate(cutoffDate.getDate() - 90); // ~3 meses en semanas  
    } else if (period === 'monthly') {  
      cutoffDate.setMonth(cutoffDate.getMonth() - 12); // Último año en meses  
    } else if (period === 'yearly') {  
      cutoffDate.setFullYear(cutoffDate.getFullYear() - 5); // Últimos 5 años  
    }  
    return processed.filter(g => new Date(g.key) >= cutoffDate);  
  };  

  const groupedEntries = getGroupedEntries(moodEntries, viewPeriod);  

  // Labels dinámicas  
  const getLabels = () => groupedEntries.map(g => {  
    if (viewPeriod === 'daily') return g.label;  
    if (viewPeriod === 'weekly') {  
      const date = new Date(g.key);  
      return `Sem ${date.getWeek()}`;  
    }  
    if (viewPeriod === 'monthly') {  
      return new Date(g.key + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });  
    }  
    return g.label; // Yearly: 'YYYY'  
  });  

  // Configuración de datos para mood (escala 1-20)  
  const moodData = {  
    labels: getLabels(),  
    datasets: [  
      {  
        label: 'Nivel de Ánimo (Promedio)',  
        data: groupedEntries.map(g => g.avgMood),  
        backgroundColor: groupedEntries.map(g =>  
          g.avgMood >= 14 ? 'rgba(34, 197, 94, 0.8)' :  // Ajustado para 20: >=14 es "bueno"  
          g.avgMood >= 8 ? 'rgba(250, 204, 21, 0.8)' : 'rgba(239, 68, 68, 0.8)'  
        ),  
        borderRadius: 8,  
        borderSkipped: false,  
        barThickness: viewPeriod === 'daily' ? 35 : 45, // Más compacto  
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',  
      },  
    ],  
  };  

  // Configuración de datos para sleep  
  const sleepData = {  
    labels: getLabels(),  
    datasets: [  
      {  
        label: 'Calidad de Sueño (Promedio)',  
        data: groupedEntries.map(g => g.avgSleep),  
        backgroundColor: groupedEntries.map(g =>  
          g.avgSleep >= 4 ? 'rgba(34, 197, 94, 0.8)' :  
          g.avgSleep >= 2 ? 'rgba(250, 204, 21, 0.8)' : 'rgba(239, 68, 68, 0.8)'  
        ),  
        borderRadius: 8,  
        borderSkipped: false,  
        barThickness: viewPeriod === 'daily' ? 35 : 45, // Más compacto  
        hoverBackgroundColor: 'rgba(59, 130, 246, 0.9)',  
      },  
    ],  
  };  

  // Opciones base (compactas y con escala 20 para mood)
  const getOptions = (isSleep = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {  
      legend: { display: true, labels: { color: '#374151', font: { size: 12, weight: 'bold' } } }, // Font más pequeña  
      title: { display: false },  
      tooltip: {  
        backgroundColor: '#1f2937',  
        titleColor: '#f9fafb',  
        bodyColor: '#f3f4f6',  
        borderWidth: 1,  
        borderColor: '#6b7280',  
        callbacks: {  
          label: context => {  
            const label = context.dataset.label + ': ' + context.parsed.y + (isSleep ? '/5' : '/20');  
            return label;  
          },  
          afterBody: context => {  
            const index = context[0].dataIndex;  
            const group = groupedEntries[index];  
            let extra = `Entradas: ${group.count}\n`;  
            if (group.notes && group.notes !== 'Sin notas') extra += `Notas: ${group.notes.substring(0, 50)}...`;  
            return extra;  
          },  
        },  
      },  
    },  
    scales: {  
      x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 11 } } }, // Ticks más pequeños  
      y: {  
        min: 0,  
        max: isSleep ? 5 : 20, // Mood ahora hasta 20  
        ticks: { stepSize: isSleep ? 1 : 2, color: '#6B7280', font: { size: 11 } }, // StepSize ajustado para 20  
        grid: { color: 'rgba(229, 231, 235, 0.5)' },  
      },  
    },  
    animation: {  
      duration: 600, // Animación un poco más rápida para compacto  
      easing: 'easeOutQuart'  
    },  
  });  

  const moodOptions = getOptions(false);  
  const sleepOptions = getOptions(true);  

  // Si no hay entradas (se actualiza automáticamente vía props)  
  if (moodEntries.length === 0) {  
    return (  
      <motion.div  
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.6, delay: 0.4 }}  
        className="bg-white rounded-3xl shadow-lg p-6 text-center border border-gray-200 mt-8"  
      >  
        <BarChart3 className="w-12 h-12 text-gray-400w mx-auto mb-4" />  
        <p className="text-gray-600w font-medium">¡Historial borrado! Necesitas más registros para ver comparativas de ánimo y sueño.</p>  
      </motion.div>  
    );  
  }  

  // Navegación de período (solo para no-daily)  
  const navigatePeriod = (direction) => {  
    if (viewPeriod === 'daily') return; // No navegar en daily  
    const newDate = new Date(currentPeriod);  
    if (viewPeriod === 'weekly') newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));  
    else if (viewPeriod === 'monthly') newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));  
    else if (viewPeriod === 'yearly') newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));  
    setCurrentPeriod(newDate);  
  };  

  // Variantes para animaciones  
  const containerVariants = {  
    hidden: { opacity: 0, y: 20 },  
    visible: {  
      opacity: 1,  
      y: 0,  
      transition: { duration: 0.6, staggerChildren: 0.1 }  
    }  
  };  

  const chartVariants = {  
    hidden: { opacity: 0, scale: 0.95 },  
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }  
  };  

  return (  
    <motion.div  
      variants={containerVariants}  
      initial="hidden"  
      animate="visible"  
      className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mt-8" // P-6 para más compacto  
    >  
      <div className="flex items-center justify-between mb-4"> {/* mb-6 -> mb-4 */}  
        <div className="flex items-center gap-3">  
          <BarChart3 className="w-6 h-6 text-blue-500" />  
          <h3 className="text-2xl font-bold text-gray-800ww">Comparativas de Ánimo y Sueño</h3>  
        </div>  
        {/* Selector de Período con animaciones - Más compacto */}
        <div className="flex items-center gap-1 relative"> {/* gap-2 -> gap-1 */}
          <AnimatePresence mode="wait">
            {viewPeriod !== 'daily' && (
              <motion.button
                key="prev"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
                onClick={() => navigatePeriod('prev')}
                whileHover={{ scale: 1.05 }}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> {/* Más pequeño */}
              </motion.button>
            )}
          </AnimatePresence>
          <div className="flex bg-gray-100 rounded-lg p-0.5"> {/* p-1 -> p-0.5 */}
            {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
              <motion.button
                key={period}
                onClick={() => {
                  setViewPeriod(period);
                  setCurrentPeriod(new Date());
                }}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all {/* text-sm -> text-xs, px-3 -> px-2 */}
                  ${viewPeriod === period
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600ww hover:bg-gray-200'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {period === 'daily' ? 'Días' : period === 'weekly' ? 'Semanas' : period === 'monthly' ? 'Meses' : 'Años'}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {viewPeriod !== 'daily' && (
              <motion.button
                key="next"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                onClick={() => navigatePeriod('next')}
                whileHover={{ scale: 1.05 }}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>  

      <AnimatePresence mode="wait">  
        <motion.div
          key={viewPeriod}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 "
        >
          {/* Gráfica de Ánimo */}  
          <motion.div variants={chartVariants} className="h-full">  
            <h4 className="text-lg font-semibold text-gray-800w mb-2 flex items-center gap-2"> {/* mb-3 -> mb-2 */}  
              Evolución del Ánimo  
            </h4>  
            <div className={`relative ${groupedEntries.length === 0 ? 'h-[400px]' : 'h-80'}`}>
              <Bar data={moodData} options={moodOptions} />
            </div>
          </motion.div>  

          {/* Gráfica de Sueño */}  
          <motion.div variants={chartVariants}>  
            <h4 className="text-lg font-semibold text-gray-800ww mb-2 flex items-center gap-2">  
              <Moon className="w-5 h-5 text-purple-500" />  
              Calidad de Sueño  
            </h4>  
            <div className={`relative ${groupedEntries.length === 0 ? 'h-[400px]' : 'h-80'}`}>
              <Bar data={sleepData} options={sleepOptions} />
            </div>
          </motion.div>  
        </motion.div>  
      </AnimatePresence>  

      {/* Resumen de Notas por Período - Más compacto */}  
      {groupedEntries.length > 0 && (  
        <motion.div   
          initial={{ opacity: 0, y: 10 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ delay: 0.3 }}  
          className="mt-4 p-3 bg-gray-50 rounded-2xl" 
        >  
          <h4 className="text-lg font-semibold text-gray-800ww mb-2 flex items-center gap-2"> {/* mb-3 -> mb-2 */}  
            <Calendar className="w-5 h-5 text-green-500" />  
            Resumen de Notas ({viewPeriod})  
          </h4>  
          <div className="space-y-1 max-h-32 overflow-y-auto"> {/* space-y-2 -> space-y-1, max-h-40 -> max-h-32 */}  
            {groupedEntries.map((group, idx) => (  
              <motion.div   
                key={idx}  
                initial={{ opacity: 0, x: -20 }}  
                animate={{ opacity: 1, x: 0 }}  
                transition={{ delay: idx * 0.1 }}  
                className="p-2 bg-white rounded-lg border-l-4 border-blue-400" 
              >  
                <p className="text-xs font-medium text-gray-800ww"> {/* text-sm -> text-xs */}{group.label} - Mood: {group.avgMood}/20 | Sueño: {group.avgSleep}/5</p>  
                {group.notes && group.notes !== 'Sin notas' && (  
                  <p className="text-xs text-gray-600ww mt-1"> {/* text-xs igual, mt-1 */}{group.notes.substring(0, 100)}...</p>  
                )}  
              </motion.div>  
            ))}  
          </div>  
        </motion.div>  
      )}  
    </motion.div>  
  );  
};  

export default MoodChart;