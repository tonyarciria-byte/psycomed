import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Check, X, Zap, Shield, Heart, TrendingUp, Calendar, Music, BookOpen, BarChart3, Cloud, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumFeatures = ({ userProfile, setUserProfile }) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Si el usuario ya es premium, mostrar el plan actual
  React.useEffect(() => {
    if (userProfile?.isPremium && userProfile?.premiumPlan) {
      setSelectedPlan(userProfile.premiumPlan);
    }
  }, [userProfile]);

  const plans = {
    free: {
      name: 'Gratis',
      price: 0,
      priceUSD: 0,
      period: 'Siempre',
      color: 'from-gray-400 to-gray-500',
      features: [
        'Registro básico de ánimo',
        'Hasta 30 entradas por mes',
        'Gráficos básicos',
        'Exportación limitada',
        '1 sonido de relajación'
      ]
    },
    monthly: {
      name: 'Premium Mensual',
      price: 35000,
      priceUSD: 8.75,
      period: 'mes',
      color: 'from-blue-500 to-purple-600',
      popular: true,
      features: [
        'Registro ilimitado de ánimo',
        'Análisis avanzado con IA',
        'Gráficos detallados y comparativas',
        'Exportación completa en múltiples formatos',
        'Biblioteca completa de sonidos (100+)',
        'Recordatorios personalizables',
        'Modo offline completo',
        'Soporte prioritario 24/7',
        'Backup automático en la nube'
      ]
    },
    semestral: {
      name: 'Premium Semestral',
      price: 50000,
      priceUSD: 12.5,
      period: '6 meses',
      color: 'from-purple-500 to-pink-600',
      features: [
        'Todas las características Premium',
        '1 mes GRATIS incluido',
        'Análisis predictivo avanzado',
        'Informes semestrales personalizados',
        'Acceso beta a nuevas funciones',
        'Consultas con especialistas (1 por mes)',
        'Personalización completa de la interfaz',
        'API para desarrolladores',
        'Almacenamiento ilimitado'
      ]
    },
    yearly: {
      name: 'Premium Anual',
      price: 100000,
      priceUSD: 25,
      period: 'año',
      color: 'from-green-500 to-emerald-600',
      discount: '30% descuento',
      features: [
        'Todas las características Premium',
        '2 meses GRATIS incluidos',
        'Análisis predictivo avanzado',
        'Informes mensuales personalizados',
        'Acceso beta a nuevas funciones',
        'Consultas con especialistas (2 por mes)',
        'Personalización completa de la interfaz',
        'API para desarrolladores',
        'Almacenamiento ilimitado'
      ]
    }
  };

  const premiumFeatures = [
    {
      icon: BarChart3,
      title: 'Análisis Inteligente',
      description: 'IA avanzada que analiza patrones en tu estado de ánimo y te da insights personalizados.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Cloud,
      title: 'Backup en la Nube',
      description: 'Tus datos seguros y sincronizados en todos tus dispositivos automáticamente.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Music,
      title: 'Biblioteca Premium',
      description: 'Acceso a más de 100 sonidos de relajación, meditaciones guiadas y música terapéutica.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      title: 'Informes Avanzados',
      description: 'Reportes detallados de tu progreso con recomendaciones personalizadas de bienestar.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Privacidad Máxima',
      description: 'Encriptación de extremo a extremo y control total sobre tus datos personales.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Sparkles,
      title: 'Funciones Beta',
      description: 'Sé el primero en probar nuevas características antes que nadie.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Actualizar perfil con información premium usando la función que incluye persistencia
    const updatedProfile = {
      ...userProfile,
      isPremium: true,
      premiumPlan: selectedPlan,
      premiumSince: new Date().toISOString()
    };
    
    setUserProfile(updatedProfile);
    
    setIsProcessing(false);
    setShowUpgradeModal(false);
    
    // Mostrar notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-lg z-50 flex items-center gap-3';
    notification.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <div>
        <p class="font-bold">¡Bienvenido a Premium!</p>
        <p class="text-sm opacity-90">Ya puedes disfrutar de todas las funciones</p>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Redirigir al dashboard después de 2 segundos
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const PlanCard = ({ planKey, plan }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
        selectedPlan === planKey 
          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl shadow-blue-500/20' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
      } ${plan.popular ? 'ring-4 ring-blue-500/20' : ''}`}
      onClick={() => setSelectedPlan(planKey)}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <Star className="w-4 h-4" />
            Más Popular
          </span>
        </div>
      )}
      
      {plan.discount && (
        <div className="absolute -top-3 -right-3">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {plan.discount}
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <motion.div 
          className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}
          whileHover={{ rotate: 5 }}
        >
          <Crown className="w-8 h-8 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800w mb-2">{plan.name}</h3>
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl font-bold text-gray-900w">
            {plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString()} COP`}
          </span>
          {plan.price > 0 && (
            <>
              <span className="text-lg text-gray-600w">${plan.priceUSD} USD</span>
              <span className="text-gray-600w">/{plan.period}</span>
            </>
          )}
        </div>
        {planKey === 'yearly' && (
          <p className="text-green-600 font-medium mt-1">
            Ahorra $320.000 COP al año
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700w">{feature}</span>
          </li>
        ))}
      </ul>

      {selectedPlan === planKey && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50 pointer-events-none"
        />
      )}
    </motion.div>
  );

  const FeatureCard = ({ feature }) => (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <motion.div 
        className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}
        whileHover={{ rotate: 5 }}
      >
        <feature.icon className="w-6 h-6 text-white" />
      </motion.div>
      <h3 className="font-bold text-gray-800w mb-2">{feature.title}</h3>
      <p className="text-gray-600w text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full mb-6 shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Crown className="w-6 h-6" />
            <span className="font-bold">Funciones Premium</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Lleva tu bienestar al siguiente nivel
          </h1>
          <p className="text-xl text-gray-600w max-w-3xl mx-auto leading-relaxed">
            Desbloquea el potencial completo de PsicoMed con análisis avanzado, funciones exclusivas y soporte prioritario.
          </p>
        </motion.div>

        {/* Premium Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800w mb-12">
            ¿Qué obtienes con Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800w mb-12">
            Elige el plan perfecto para ti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => (
              <PlanCard key={key} planKey={key} plan={plan} />
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-4"
        >
          {selectedPlan !== 'free' && (
            <motion.button
              onClick={() => setShowUpgradeModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-3 mx-auto"
            >
              <Zap className="w-6 h-6" />
              Actualizar a {plans[selectedPlan].name}
              <Crown className="w-5 h-5" />
            </motion.button>
          )}
          
          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="block mx-auto text-gray-600w hover:text-gray-800w font-medium py-2 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Continuar con cuenta gratuita
          </motion.button>
        </motion.div>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgradeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="inline-flex p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-4"
                    animate={{ rotate: isProcessing ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isProcessing ? Infinity : 0, ease: "linear" }}
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800w mb-2">
                    Confirmar actualización
                  </h3>
                  <p className="text-gray-600w">
                    Estás a punto de actualizar a <strong>{plans[selectedPlan].name}</strong>
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{plans[selectedPlan].name}</span>
                    <span className="font-bold">${plans[selectedPlan].price.toLocaleString()} COP / {plans[selectedPlan].period}</span>
                  </div>
                  <div className="text-sm text-gray-600w">
                    ${plans[selectedPlan].priceUSD} USD
                  </div>
                  {(selectedPlan === 'yearly' || selectedPlan === 'semestral') && (
                    <p className="text-sm text-green-600">✨ Incluye {selectedPlan === 'yearly' ? '2' : '1'} mes{selectedPlan === 'yearly' ? 'es' : ''} gratis</p>
                  )}
                </div>

                <div className="space-y-3">
                  <motion.button
                    onClick={handleUpgrade}
                    disabled={isProcessing}
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Confirmar y Pagar
                      </>
                    )}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setShowUpgradeModal(false)}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-200 text-gray-700w font-medium py-3 px-6 rounded-2xl hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </motion.button>
                </div>

                <p className="text-xs text-gray-500w text-center mt-4">
                  🔒 Pago seguro y encriptado. Cancela en cualquier momento.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PremiumFeatures;