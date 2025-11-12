import React, { useState } from 'react';  
import { motion } from 'framer-motion';  
import { Calendar, Smile, Frown, Meh, TrendingUp, TrendingDown, Filter, Trash2, Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  

const MoodHistory = ({ moodEntries = [], onClearHistory, onAddNewMood }) => {  
  const navigate = useNavigate();  
  const [dateRange, setDateRange] = useState({ from: '', to: '' }); // Filtro por rango de fechas  

  // Función para formatear fecha a dd/MM/yyyy sin librerías extra  
  const formatDate = (dateStr) => {  
    const date = new Date(dateStr);  
    const day = String(date.getDate()).padStart(2, '0');  
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const year = date.getFullYear();  
    return `${day}/${month}/${year}`;  
  };  

  // Función para calcular stats divertidos (usando todas las entradas o filtradas si hay rango)
  const calculateStats = () => {
    const entriesToUse = dateRange.from || dateRange.to ? filteredEntries : moodEntries;
    if (entriesToUse.length === 0) return { average: 0, best: 0, worst: 10, total: 0 };

    const ratings = entriesToUse.map(entry => entry.rating);
    const average = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 5); // Convertir a porcentaje (rating/20 * 100 = rating*5)
    const best = Math.max(...ratings);
    const worst = Math.min(...ratings);
    const total = entriesToUse.length;

    return { average, best, worst, total };
  };

  // Función para ordenar por fecha descendente (más reciente primero)  
  const sortedEntries = [...moodEntries].sort((a, b) => new Date(b.date) - new Date(a.date));  

  // Filtrar por rango de fechas manualmente  
  const filterByDateRange = (entries) => {  
    if (!dateRange.from && !dateRange.to) return entries;  
    const fromDate = dateRange.from ? new Date(dateRange.from) : null;  
    const toDate = dateRange.to ? new Date(dateRange.to) : null;  
    return entries.filter(entry => {  
      const entryDate = new Date(entry.date);  
      if (fromDate && toDate) {  
        return entryDate >= fromDate && entryDate <= toDate;  
      } else if (fromDate) {  
        return entryDate >= fromDate;  
      } else if (toDate) {  
        return entryDate <= toDate;  
      }  
      return true;  
    });  
  };  

  const filteredEntries = filterByDateRange(sortedEntries);  

  const stats = calculateStats();  

  const getMoodIcon = (rating) => {
    if (rating >= 16) return <Smile className="w-5 h-5 text-green-500" />;
    if (rating >= 6) return <Meh className="w-5 h-5 text-amber-500" />;
    return <Frown className="w-5 h-5 text-red-500" />;
  };

  const getMoodColor = (rating) => {
    if (rating >= 16) return 'bg-green-100 border-green-300';
    if (rating >= 6) return 'bg-amber-100 border-amber-300';
    return 'bg-red-100 border-red-300';
  };

  const handleNoteClick = (date) => {  
    navigate(`/edit-note/${date}`);  
  };  

  // Función para limpiar el filtro de fechas  
  const clearDateFilter = () => {  
    setDateRange({ from: '', to: '' });  
  };  

  // Función para borrar TODO el historial con confirm  
  const handleClearAll = () => {  
    if (window.confirm(`¿Seguro que quieres borrar TODO tu historial de ánimos? (${moodEntries.length} entradas, notas y gráficas se irán al olvido. ¡No hay undo!`)) {  
      if (onClearHistory) {  
        onClearHistory(); // Llama al callback del padre para setear moodEntries = []  
      }  
      clearDateFilter(); // Reset filtro  
    }  
  };  

  // Vista para filtro sin resultados  
  if (filteredEntries.length === 0 && (dateRange.from || dateRange.to)) {  
    return (  
      <motion.div  
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.6, delay: 0.4 }}  
        className="bg-white rounded-3xl shadow-lg p-6 text-center border border-gray-200 mt-8"  
      >  
        <Calendar className="w-12 h-12 text-gray-400w mx-auto mb-4" />  
        <p className="text-gray-600w font-medium mb-4">No hay ánimos en este rango de fechas. ¡Prueba otro o registra más!</p>  
        <motion.button  
          onClick={clearDateFilter}  
          whileHover={{ scale: 1.05 }}  
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors mr-2"  
        >  
          Limpiar Filtro  
        </motion.button>  
        {onAddNewMood && (  
          <motion.button  
            onClick={onAddNewMood}  
            whileHover={{ scale: 1.05 }}  
            className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"  
          >  
            Nuevo Registro  
          </motion.button>  
        )}  
      </motion.div>  
    );  
  }  

  // Vista para historial vacío  
  if (moodEntries.length === 0) {  
    return (  
      <motion.div  
        initial={{ opacity: 0, y: 20 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.6, delay: 0.4 }}  
        className="bg-white rounded-3xl shadow-lg p-6 text-center border border-gray-200 mt-8"  
      >  
        <Calendar className="w-12 h-12 text-gray-400w mx-auto mb-4" />  
        <p className="text-gray-600w font-medium mb-4">¡Historial limpio o vacío! No tienes registros de ánimo aún. ¡Empieza a registrar cómo te sientes!</p>  
        {onAddNewMood && (  
          <motion.button  
            onClick={onAddNewMood}  
            whileHover={{ scale: 1.05 }}  
            whileTap={{ scale: 0.95 }}  
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"  
          >  
            <Plus className="w-5 h-5" />  
            Registrar Nuevo Mood  
          </motion.button>  
        )}  
      </motion.div>  
    );  
  }  

  return (  
    <motion.div  
      initial={{ opacity: 0, y: 20 }}  
      animate={{ opacity: 1, y: 0 }}  
      transition={{ duration: 0.6, delay: 0.4 }}  
      className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 mt-8"  
    >  
      <h3 className="text-2xl font-bold text-gray-800w mb-6 flex items-center gap-3">  
        <Calendar className="w-6 h-6 text-blue-500" />  
        Tu Historial de Ánimo  
      </h3>  

      {/* Sección de Stats */}  
      <motion.div  
        initial={{ opacity: 0, y: 10 }}  
        animate={{ opacity: 1, y: 0 }}  
        transition={{ duration: 0.5, delay: 0.2 }}  
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"  
      >  
        <div className="text-center">  
          <p className="text-sm text-gray-600w">Total Días</p>  
          <p className="text-2xl font-bold text-gray-900w">{stats.total}</p>  
        </div>  
        <div className="text-center">
          <p className="text-sm text-gray-600w">Ánimo Promedio</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-blue-600">{stats.average}%</p>
            {stats.average >= 50 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
        <div className="text-center md:text-left">  
          <p className="text-sm text-gray-600w">Mejor Día</p>  
          <p className="text-lg font-semibold text-green-600">{stats.best}/20</p>  
        </div>  
      </motion.div>  

      {/* Filtros de Calendario y Botón de Borrado Total */}  
      <div className="flex flex-col sm:flex-row gap-4 mb-6">  
        <div className="flex-1 flex flex-col sm:flex-row gap-3">  
          <div className="flex-1">  
            <label className="block text-sm font-medium text-gray-700w mb-1">Desde:</label>  
            <input  
              type="date"  
              value={dateRange.from}  
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}  
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"  
            />  
          </div>  
          <div className="flex-1">  
            <label className="block text-sm font-medium text-gray-700w mb-1">Hasta:</label>  
            <input  
              type="date"  
              value={dateRange.to}  
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}  
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"  
            />  
          </div>  
        </div>  
        <div className="flex gap-2">  
          <motion.button  
            onClick={clearDateFilter}  
            whileHover={{ scale: 1.05 }}  
            className="px-4 py-2 bg-gray-100 text-gray-700w rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"  
          >  
            <Filter className="w-4 h-4" />  
            Limpiar  
          </motion.button>  
          {moodEntries.length > 0 && (  
            <motion.button  
              onClick={handleClearAll}  
              whileHover={{ scale: 1.05 }}  
              whileTap={{ scale: 0.95 }}  
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors font-medium"  
            >  
              <Trash2 className="w-4 h-4" />  
              Borrar Todo Historial  
            </motion.button>  
          )}  
        </div>  
      </div>  

      <div className="space-y-4">  
        {filteredEntries.map((entry, index) => (  
          <motion.div  
            key={entry.date}  
            initial={{ opacity: 0, x: -20 }}  
            animate={{ opacity: 1, x: 0 }}  
            transition={{ duration: 0.4, delay: index * 0.1 }}  
            className={`flex items-center p-4 rounded-xl shadow-sm border ${getMoodColor(entry.rating)}`}  
          >  
            <div className="flex-shrink-0 mr-4">  
              {getMoodIcon(entry.rating)}  
            </div>  
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {entry.title || 'Sin título'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Ánimo: {entry.rating}/20
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    {entry.note ? (
                      <>
                        <p className="text-sm text-gray-700 text-left leading-relaxed flex-1">
                          {entry.note}
                        </p>
                        <motion.button
                          onClick={() => handleNoteClick(entry.date)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded"
                          title="Editar nota"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => handleNoteClick(entry.date)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-sm text-blue-600 text-left hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md bg-transparent border-none cursor-pointer flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Agregar nota
                      </motion.button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500w ml-4 flex-shrink-0">
                  {formatDate(entry.date)}
                </p>
              </div>
            </div>
          </motion.div>  
        ))}  
      </div>  
    </motion.div>  
  );  
};  

export default MoodHistory;