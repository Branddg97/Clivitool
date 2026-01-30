# Clivi Tool - Proyecto Next.js para Netlify

## Despliegue en Netlify

Tu proyecto está configurado correctamente para desplegar en Netlify.

### Archivos importantes:
- `next.config.mjs` - Configurado para exportación estática
- `package.json` - Scripts de build configurados
- `public/_redirects` - Redirecciones para rutas de Next.js

### Pasos para desplegar:

1. **Sube tu código a un repositorio Git** (GitHub, GitLab, etc.)

2. **Conecta tu repositorio en Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Crea una cuenta o inicia sesión
   - Haz clic en "Add new site" → "Import an existing project"
   - Conecta tu proveedor de Git
   - Selecciona tu repositorio

3. **Configura la configuración de build:**
   - **Build command:** `npm run build`
   - **Publish directory:** `out`

4. **Variables de entorno (si necesitas):**
   - Agrega cualquier variable de entorno necesaria en la configuración del sitio

### Configuración técnica:
- ✅ Exportación estática configurada
- ✅ Imágenes optimizadas para despliegue estático
- ✅ Redirecciones configuradas para rutas dinámicas
- ✅ Build optimizado para producción

El proyecto ahora debería desplegarse sin errores en Netlify.
