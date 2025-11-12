# Guía de Instalación - PsicoMed

Esta guía te ayudará a instalar y configurar PsicoMed en tu sistema.

## 📋 Requisitos Previos

### Software Necesario
- **Node.js** versión 14 o superior
- **npm** (viene incluido con Node.js) o **yarn**
- **Git** (para clonar el repositorio)

### Verificación de Requisitos
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git (opcional)
git --version
```

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/psicomed.git
cd psicomed
```

### 2. Instalar Dependencias
```bash
# Usando npm
npm install

# O usando yarn (si tienes yarn instalado)
yarn install
```

### 3. Configurar Variables de Entorno
1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus configuraciones:
   ```env
   # Configuración de Azure OpenAI (opcional)
   AZURE_OPENAI_API_VERSION="2024-12-01-preview"
   AZURE_OPENAI_ENDPOINT="tu-endpoint-de-azure"
   AZURE_OPENAI_KEY="tu-clave-de-azure"
   EMBED_MODEL="mxbai-embed-large"
   LLM_MODEL="llama3.1:8b"
   AZURE_API_KEY="tu-clave-api-de-azure"
   ```

   **Nota**: Las variables de Azure son opcionales. Si no las configuras, la aplicación funcionará con funcionalidad básica.

### 4. Ejecutar en Modo Desarrollo
```bash
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🏗️ Construir para Producción

### Generar Build
```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `build/`.

### Probar Build Localmente
```bash
# Instalar serve globalmente (opcional)
npm install -g serve

# Servir la aplicación
serve -s build -l 3000
```

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Ejecutar en modo desarrollo |
| `npm run build` | Generar build de producción |
| `npm test` | Ejecutar pruebas |
| `npm run eject` | Eject de Create React App |

## 🐛 Solución de Problemas

### Error de Dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Puerto en Uso
Si el puerto 3000 está ocupado:
```bash
# Usar otro puerto
PORT=3001 npm start
```

### Problemas con Node.js
- Asegúrate de tener Node.js 14+ instalado
- En Windows, puedes usar `nvm-windows` para gestionar múltiples versiones
- En Mac/Linux, usa `nvm` para gestionar versiones

## 📁 Estructura de Archivos Importantes

```
psicomed/
├── .env.example          # Ejemplo de variables de entorno
├── .gitignore           # Archivos ignorados por Git
├── package.json         # Dependencias y scripts
├── public/              # Archivos públicos
├── src/                 # Código fuente
│   ├── App.js          # Componente principal
│   ├── components/     # Componentes React
│   ├── utils/          # Utilidades
│   └── ...             # Más archivos
└── README.md           # Documentación principal
```

## 🔧 Configuración Adicional

### Personalización de Puerto
Crea un archivo `.env.local` con:
```env
PORT=3000
HOST=localhost
```

### Configuración de Proxy (si es necesario)
En `package.json`:
```json
"proxy": "http://localhost:5000"
```

## 📱 Deployment

### GitHub Pages
1. Instalar `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Agregar scripts en `package.json`:
   ```json
   {
     "homepage": "https://tu-usuario.github.io/psicomed",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. Desplegar:
   ```bash
   npm run deploy
   ```

### Vercel
1. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Desplegar:
   ```bash
   vercel
   ```

### Netlify
1. Construir la aplicación:
   ```bash
   npm run build
   ```

2. Subir la carpeta `build/` a Netlify

## 🔍 Verificación de Instalación

Para verificar que todo funciona correctamente:

1. ✅ La aplicación inicia sin errores
2. ✅ Puedes navegar entre las diferentes pantallas
3. ✅ Los gráficos se muestran correctamente
4. ✅ Los temas funcionan (claro/oscuro)
5. ✅ El almacenamiento local funciona

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. Revisa la [documentación principal](README.md)
2. Busca en los [issues existentes](https://github.com/tu-usuario/psicomed/issues)
3. Crea un nuevo issue con:
   - Tu sistema operativo
   - Versión de Node.js (`node --version`)
   - Versión de npm (`npm --version`)
   - Mensaje de error completo
   - Pasos para reproducir el problema

## 🚀 Siguiente Paso

Una vez completada la instalación, consulta el [README.md](README.md) para aprender sobre las características de la aplicación y cómo usarla.

¡Disfruta usando PsicoMed! 🎉