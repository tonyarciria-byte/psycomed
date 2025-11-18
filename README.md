# PsicoMed - Aplicación de Seguimiento del Estado de Ánimo

![PsicoMed](https://img.shields.io/badge/PsicoMed-Mood%20Tracker-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.0.0-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Una aplicación moderna y completa para el seguimiento del estado de ánimo, bienestar mental y autocuidado. Desarrollada con React y diseñada para proporcionar una experiencia intuitiva y segura.

## 🌟 Características Principales

### 📊 Seguimiento del Estado de Ánimo
- Registro diario del estado de ánimo con valoraciones numéricas
- Categorías predefinidas: Felicidad, Ansiedad, Calma, Cansancio
- Notas personalizadas para cada entrada
- Seguimiento de la calidad del sueño
- Etiquetado inteligente de emociones

### 📈 Análisis y Visualización
- Gráficos interactivos con Chart.js
- Tendencias de estado de ánimo a lo largo del tiempo
- Análisis de patrones y correlaciones
- Reportes de bienestar personal
- Dashboard con métricas visuales

### 📝 Diario Personal
- Editor de texto enriquecido con Quill.js
- Entradas de diario vinculadas al estado de ánimo
- Búsqueda y filtrado de entradas
- Exportación de datos
- Respaldo y sincronización local

### 💊 Gestión de Medicamentos
- Registro de medicamentos y dosis
- Recordatorios personalizables
- Historial de medicación
- Seguimiento de adherencia al tratamiento

### 🎨 Personalización
- Temas claro y oscuro
- Personalización completa de colores
- Tamaño de fuente ajustable
- Animaciones configurables
- Modo de alto contraste

### 🌍 Soporte Multilingüe
- Español (por defecto)
- Inglés
- Detección automática de idioma del navegador

### 🔒 Seguridad y Privacidad
- Encriptación de datos sensibles
- Autenticación de dos factores
- Biométrica (en dispositivos compatibles)
- Contactos de emergencia
- Gestión segura de datos personales

### 🚀 Características Premium
- Análisis avanzado con IA
- Recomendaciones personalizadas
- Exportación completa de datos
- Respaldo en la nube
- Funciones adicionales de bienestar

### 🧘 Herramientas de Bienestar
- Ejercicios de relajación guiada
- Técnicas de respiración
- Meditación mindfulness
- Contenido de apoyo emocional

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.0.0** - Biblioteca de interfaz de usuario
- **React Router Dom 7.9.1** - Enrutamiento SPA
- **React Chart.js 2** - Gráficos y visualizaciones
- **Framer Motion** - Animaciones fluidas
- **Tailwind CSS 3.4.1** - Estilos y diseño responsivo

### Funcionalidades Adicionales
- **i18next** - Internacionalización
- **Quill & React Quill** - Editor de texto enriquecido
- **Lucide React** - Iconografía moderna
- **Sentiment** - Análisis de sentimientos
- **Crypto JS** - Encriptación de datos

### Herramientas de Desarrollo
- **React Scripts 5.0.1** - Build y desarrollo
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de navegadores

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Navegador web moderno

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 3. Configuración del Entorno
Crear un archivo `.env.local` en la raíz del proyecto:

```env
# Configuración de API (opcional)
AZURE_OPENAI_API_VERSION="2024-12-01-preview"
AZURE_OPENAI_ENDPOINT="tu-endpoint-azure"
AZURE_OPENAI_KEY="tu-clave-azure"
EMBED_MODEL="mxbai-embed-large"
LLM_MODEL="llama3.1:8b"
AZURE_API_KEY="tu-clave-api"
```

### 4. Ejecutar en Desarrollo
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 5. Construir para Producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
psicomed/
├── public/                 # Archivos públicos
├── src/
│   ├── components/        # Componentes React
│   │   ├── settings/      # Componentes de configuración
│   │   └── common/        # Componentes reutilizables
│   ├── hooks/            # Hooks personalizados
│   ├── services/         # Servicios y APIs
│   ├── utils/            # Utilidades
│   │   └── __tests__/    # Pruebas unitarias
│   ├── App.js            # Componente principal
│   ├── index.js          # Punto de entrada
│   ├── i18n.js          # Configuración de internacionalización
│   └── styles.css       # Estilos globales
├── .env                  # Variables de entorno
├── .gitignore           # Archivos ignorados por Git
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🎯 Componentes Principales

### Dashboard
- **DashboardContent**: Pantalla principal con resumen de estado de ánimo
- **MoodChart**: Visualizaciones gráficas del progreso
- **MoodHistory**: Historial completo de entradas

### Registro y Edición
- **MoodEntryForm**: Formulario para registrar estado de ánimo
- **NoteEditor**: Editor avanzado para entradas de diario
- **JournalScreen**: Pantalla principal del diario

### Configuración
- **SettingsPanel**: Panel principal de configuraciones
- **ProfileScreen**: Gestión del perfil de usuario
- **ThemeCustomizer**: Personalización de temas

### Funciones Especiales
- **RelaxationScreen**: Ejercicios de relajación
- **SupportScreen**: Recursos de apoyo
- **PremiumFeatures**: Funciones premium
- **MedicationLog**: Gestión de medicamentos

## 📊 Datos y Almacenamiento

### Almacenamiento Local
- Los datos se almacenan en localStorage del navegador
- Encriptación automática de información sensible
- Respaldo manual recomendado para datos importantes

### Datos del Usuario
- Perfil personal y configuraciones
- Historial de estado de ánimo
- Entradas de diario y notas
- Registro de medicamentos
- Preferencias de tema e idioma

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en modo desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar pruebas
npm run eject      # Eject de Create React App
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👤 Autor

**PsicoMed Team**
- Aplicación desarrollada con ❤️ para el bienestar mental

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

1. Revisa la [documentación](docs/)
2. Contacta al equipo de soporte

## 🔮 Roadmap

### Versión 2.0
- [ ] Sincronización en la nube
- [ ] Aplicación móvil nativa
- [ ] Integración con wearables
- [ ] Análisis predictivo de estado de ánimo
- [ ] Comunidad y grupos de apoyo

### Versión 2.1
- [ ] Integración con profesionales de salud
- [ ] Reportes médicos automatizados
- [ ] Funciones de mindfulness guiadas
- [ ] IA conversacional para apoyo

---

## ⚠️ Importante

Esta aplicación es una herramienta de apoyo al bienestar mental y NO sustituye el diagnóstico o tratamiento médico profesional. En caso de crisis o emergencias, contacta inmediatamente a servicios de emergencia o profesionales de salud mental.

**Líneas de emergencia:**
- Colombia: 123
- España: 112
- México: 911

---

<<<<<<< HEAD
![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)
=======
![Made with ❤️](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=for-the-badge)
>>>>>>> cd553fe (Initial commit: PsicoMed - Aplicación de seguimiento del estado de ánimo)
