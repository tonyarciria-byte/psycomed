import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfilePanel = ({ userProfile, setUserProfile, onUnsavedChanges }) => {
  const { t } = useTranslation();
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditedProfile(userProfile);
  }, [userProfile]);

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
    onUnsavedChanges(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateField = (field, value) => {
    const fieldErrors = {};

    switch (field) {
      case 'name':
        if (!value || value.trim().length < 2) {
          fieldErrors.name = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'age':
        const age = parseInt(value);
        if (!value || isNaN(age) || age < 13 || age > 120) {
          fieldErrors.age = 'La edad debe estar entre 13 años en adelante';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          fieldErrors.email = 'Correo electrónico inválido';
        }
        break;
      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{7,}$/;
        if (value && !phoneRegex.test(value)) {
          fieldErrors.phone = 'Número de teléfono inválido';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }));

    return Object.keys(fieldErrors).length === 0;
  };

  const handleSave = () => {
    // Validate all fields
    const fieldsToValidate = ['name', 'age', 'email', 'phone'];
    let hasErrors = false;

    fieldsToValidate.forEach(field => {
      if (!validateField(field, editedProfile[field])) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      return;
    }

    setUserProfile(editedProfile);
    onUnsavedChanges(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setErrors({});
    onUnsavedChanges(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header removed to let SettingsPanel handle navigation */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700ww mb-2">
            Nombre Completo*
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400w" />
            <input
              type="text"
              value={editedProfile.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={(e) => validateField('name', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } bg-white  text-gray-900ww`}
              placeholder="Tu nombre completo"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        {/* Edad */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900ww mb-2">
            Edad*
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400w" />
            <input
              type="number"
              min="13"
              value={editedProfile.age || ''}
              onChange={(e) => handleInputChange('age', e.target.value)}
              onBlur={(e) => validateField('age', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.age ? 'border-red-500' : 'border-gray-300'
              } bg-white text-gray-400ww `}
              placeholder="Tu edad"
            />
          </div>
          {errors.age && (
            <p className="text-red-500 text-sm">{errors.age}</p>
          )}
        </div>

        {/* País */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900ww mb-2">
            País*
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400w" />
            <select
              value={editedProfile.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-whitetext-gray-900ww"
            >
              <option value="">Seleccionar país</option>
              <option value="Colombia">Colombia</option>
              <option value="México">México</option>
              <option value="Argentina">Argentina</option>
              <option value="España">España</option>
              <option value="Chile">Chile</option>
              <option value="Perú">Perú</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Bolivia">Bolivia</option>
            </select>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900ww mb-2">
            Correo Electrónico*
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400w" />
            <input
              type="email"
              value={editedProfile.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={(e) => validateField('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } bg-white text-gray-900ww`}
              placeholder="tu@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900ww mb-2">
            Número de Teléfono*
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400w" />
            <input
              type="tel"
              value={editedProfile.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={(e) => validateField('phone', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } bg-white text-gray-900ww`}
              placeholder="+57 300 123 4567"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* Diagnóstico */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-900ww mb-2">
            Diagnóstico* 
          </label>
          <textarea
            value={editedProfile.diagnosis || ''}
            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900ww resize-none"
            placeholder="Describe tu diagnóstico si deseas compartirlo..."
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 ">
        <motion.button
          onClick={handleCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg font-medium text-gray-700ww bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </motion.button>
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-lg font-medium text-gray-500ww bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar Cambios
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfilePanel;