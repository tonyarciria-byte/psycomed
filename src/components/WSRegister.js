import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Calendar, MapPin, Stethoscope, Globe, Eye, EyeOff, AlertTriangle, Phone } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const WSRegister = ({ setUserProfile }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    country: '',
    diagnosis: '',
    language: 'es',
    phoneNumber: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Setup reCAPTCHA
  useEffect(() => {
    if (auth && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            // Reset verifier on expiration
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          }
        });
      } catch (error) {
        console.error('Error setting up reCAPTCHA:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [auth]);

  const getFriendlyErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está registrado. Intenta iniciar sesión.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil. Usa al menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Inténtalo más tarde.';
      default:
        return 'Error de autenticación. Inténtalo de nuevo.';
    }
  };

  // Check if Firebase is configured
  if (!auth) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-4">Configuración Requerida</h2>
        <p className="text-gray-600 mb-6">
          Para usar las funciones de registro e inicio de sesión, necesitas configurar Firebase.
          Agrega tus credenciales de Firebase en el archivo .env.local.
        </p>
        <motion.button
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continuar sin autenticación
        </motion.button>
      </motion.div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: false
      });
    }
  };

  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);

    // Validate required fields
    const errors = {};
    if (!formData.email) errors.email = true;
    if (!formData.password) errors.password = true;
    if (!isLogin) {
      if (!formData.confirmPassword) errors.confirmPassword = true;
      if (!formData.name) errors.name = true;
      if (!formData.age) errors.age = true;
      if (!formData.country) errors.country = true;
      if (!formData.diagnosis) errors.diagnosis = true;
      if (!formData.language) errors.language = true;
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor, completa todos los campos requeridos.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // For now, create a basic profile. In a real app, you'd fetch from database
        const profile = {
          name: user.displayName || 'Usuario',
          email: user.email,
          age: 25,
          country: 'Colombia',
          diagnosis: 'Ansiedad',
          language: 'es',
          notifications: true,
          reminders: true,
          reminderTime: '09:00',
          isPremium: false
        };
        setUserProfile(profile);
        navigate('/dashboard');
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          setFieldErrors({ password: true, confirmPassword: true });
          setError('Las contraseñas no coinciden');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const profile = {
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          country: formData.country,
          diagnosis: formData.diagnosis,
          language: formData.language,
          notifications: true,
          reminders: true,
          reminderTime: '09:00',
          isPremium: false
        };
        setUserProfile(profile);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(getFriendlyErrorMessage(error));
      const fieldErr = {};
      if (error.code === 'auth/email-already-in-use' || error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found') {
        fieldErr.email = true;
      }
      if (error.code === 'auth/weak-password' || error.code === 'auth/wrong-password') {
        fieldErr.password = true;
      }
      setFieldErrors(fieldErr);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const profile = {
        name: user.displayName,
        email: user.email,
        age: 25,
        country: 'Colombia',
        diagnosis: 'Ansiedad',
        language: 'es',
        notifications: true,
        reminders: true,
        reminderTime: '09:00',
        isPremium: false
      };
      setUserProfile(profile);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSendSMS = async () => {
    if (!formData.phoneNumber) {
      setError('Ingresa un número de teléfono');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Ensure reCAPTCHA is ready
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
          }
        });
      }

      const phoneNumber = formData.phoneNumber.startsWith('+') ? formData.phoneNumber : `+57${formData.phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setShowPhoneVerification(true);
    } catch (error) {
      console.error('SMS error:', error);
      setError(error.message);

      // Only reset reCAPTCHA on specific errors
      if (error.code === 'auth/too-many-requests' || error.code === 'auth/invalid-phone-number') {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      }
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setError('Ingresa el código de verificación');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(formData.verificationCode);
      const user = result.user;

      const profile = {
        name: user.displayName || 'Usuario',
        email: user.email || '',
        phone: user.phoneNumber,
        age: 25,
        country: 'Colombia',
        diagnosis: 'Ansiedad',
        language: 'es',
        notifications: true,
        reminders: true,
        reminderTime: '09:00',
        isPremium: false
      };
      setUserProfile(profile);
      navigate('/dashboard');
    } catch (error) {
      console.error('Verification error:', error);
      setError('Código incorrecto');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
    >
      {/* Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
            !isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`w-full pl-12 pr-12 py-3 bg-gray-50 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm Password (only for register) */}
        {!isLogin && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        )}

        {/* Name (only for register) */}
        {!isLogin && (
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            />
          </div>
        )}

        {/* Age (only for register) */}
        {!isLogin && (
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="age"
              placeholder="Edad"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="1"
              max="120"
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.age ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            />
          </div>
        )}

        {/* Country (only for register) */}
        {!isLogin && (
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.country ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            >
              <option value="">Selecciona tu país</option>
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Argentina">Argentina</option>
              <option value="España">España</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        )}

        {/* Diagnosis (only for register) */}
        {!isLogin && (
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.diagnosis ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            >
              <option value="">Selecciona tu diagnóstico</option>
              <option value="Ansiedad">Ansiedad</option>
              <option value="Depresión">Depresión</option>
              <option value="Estrés">Estrés</option>
              <option value="Trastorno Bipolar">Trastorno Bipolar</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        )}

        {/* Language (only for register) */}
        {!isLogin && (
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              required
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.language ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        )}

        {/* Phone Number */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Número de teléfono (+57...)"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
          />
        </div>

        {/* Verification Code (only when SMS sent) */}
        {showPhoneVerification && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="verificationCode"
              placeholder="Código de verificación"
              value={formData.verificationCode}
              onChange={handleInputChange}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${fieldErrors.verificationCode ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Submit Button */}
        {!showPhoneVerification ? (
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </motion.button>
        ) : (
          <motion.button
            onClick={handleVerifyCode}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar Código'}
          </motion.button>
        )}

        {/* Send SMS Button */}
        {formData.phoneNumber && !showPhoneVerification && (
          <motion.button
            onClick={handleSendSMS}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Enviando SMS...' : 'Enviar Código por SMS'}
          </motion.button>
        )}
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-gray-500 text-sm">o</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Google Button */}
      <motion.button
        onClick={handleGoogleAuth}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </motion.button>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </motion.div>
  );
};

export default WSRegister;