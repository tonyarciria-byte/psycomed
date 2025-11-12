# Comandos Git para Solucionar Error de Push

## El Error: "src refspec main does not match any"

Este error significa que aún no has hecho ningún commit en tu repositorio local.

## Solución Paso a Paso

### 1. Verificar estado del repositorio
```bash
git status
```

### 2. Agregar todos los archivos al staging
```bash
git add .
```

### 3. Verificar que se agregaron
```bash
git status
```

### 4. Crear el commit inicial
```bash
git commit -m "Initial commit: PsicoMed - Aplicación de seguimiento del estado de ánimo"
```

### 5. Verificar que el commit se creó
```bash
git log --oneline
```

### 6. Ahora hacer push (elige una opción):

**Si tu repositorio usa 'main':**
```bash
git push -u origin main
```

**Si tu repositorio usa 'master':**
```bash
git push -u origin master
```

### 7. Verificar qué rama usar
```bash
git branch
```

## ¿Qué estás haciendo?
1. **git add .** → Preparas todos los archivos para el commit
2. **git commit** → Crear el primer snapshot del proyecto  
3. **git push** → Subir al repositorio en GitHub

## Comando directo completo
```bash
git add . && git commit -m "Initial commit" && git push -u origin main
```

Si master, cambia el último comando a:
```bash
git push -u origin master
```

## Después del push exitoso
¡Tu proyecto estará en GitHub en: https://github.com/tonyarciria-byte/psycomed