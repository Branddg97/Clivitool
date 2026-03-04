# 📋 Guía de Mantenimiento de Procesos Clivi

## 🎯 Objetivo
Evitar problemas de sincronización, cache y errores de importación al agregar nuevos procesos.

## 🔄 Flujo de Trabajo Recomendado

### 1. Preparación de Nuevos Procesos

#### ✅ Antes de Agregar Procesos:
```bash
# 1. Validar estado actual
npm run validate

# 2. Backup de datos actuales
cp lib/processes-data.ts lib/processes-data.backup.ts
```

#### ✅ Formato de Datos:
- **CSV**: Usar el template `procesos_clivi_template.csv`
- **JSON**: Seguir la estructura definida en interfaces
- **IDs**: Únicos, descriptivos, en minúsculas con guiones

### 2. Agregar Nuevos Procesos

#### 📝 Paso 1: Actualizar `processes-data.ts`

```typescript
// 1. Agregar a processCategories
export const processCategories: ProcessCategory[] = [
  // ... categorías existentes
  {
    id: "nueva-categoria",
    title: "Nueva Categoría",
    description: "Descripción de la categoría",
    icon: "IconName",
    color: "bg-color-500",
    processes: 1,
    avgTime: "X-Y min",
    href: "/processes/nueva-categoria"
  }
]

// 2. Agregar a processList
export const processList: Record<string, Process[]> = {
  // ... categorías existentes
  "nueva-categoria": [
    {
      id: "proc-nuevo-proceso",
      title: "Nuevo Proceso",
      description: "Descripción completa",
      category: "nueva-categoria",
      steps: 3,
      avgTime: "X-Y min",
      difficulty: "Fácil" | "Medio" | "Difícil",
      usage: 0,
      lastUpdated: "Hoy"
    }
  ]
}

// 3. Agregar a processSteps
export const processSteps: Record<string, ProcessStep[]> = {
  // ... pasos existentes
  "proc-nuevo-proceso": [
    {
      id: "step-1",
      title: "Título del Paso",
      description: "Descripción detallada",
      type: "question" | "action" | "info" | "validation",
      content: "Contenido del paso",
      estimatedTime: "X minutos",
      // Para pasos question:
      options: [
        {
          id: "opt-1",
          label: "Opción 1",
          nextStep: "step-2"
        }
      ],
      // Para pasos action/info:
      nextStep: "step-2"
    }
  ]
}
```

#### 🔍 Paso 2: Validar Estructura

```bash
# Validar datos
npm run validate

# Si hay errores, revisar:
# - IDs duplicados
# - Referencias nextStep inválidas
# - Campos requeridos faltantes
# - Tipos de paso incorrectos
```

#### 🧪 Paso 3: Testing Local

```bash
# 1. Iniciar desarrollo
npm run dev

# 2. Verificar dashboard
# - Deben aparecer nuevas categorías/procesos
# - Navegación debe funcionar
# - Botones "Siguiente" deben aparecer

# 3. Probar cada proceso
# - Abrir cada nuevo proceso
# - Verificar pasos y opciones
# - Probar navegación completa
```

### 3. Deployment

#### ✅ Pre-Deployment Checklist:
- [ ] `npm run validate` pasa sin errores
- [ ] Todos los nuevos procesos funcionan localmente
- [ ] No hay warnings en la consola
- [ ] IDs son únicos y descriptivos
- [ ] Referencias nextStep son válidas

#### 🚀 Deployment:
```bash
# 1. Commit cambios
git add .
git commit -m "feat: agregar [nombres de procesos]"

# 2. Push
git push origin main

# 3. Monitorear deployment
# Verificar build en Vercel dashboard
# Revisar logs de validación
```

## 🔧 Herramientas de Validación

### 1. Script Automático
```bash
npm run validate
```
Valida:
- ✅ Estructura de datos
- ✅ IDs únicos
- ✅ Referencias válidas
- ✅ Consistencia cruzada

### 2. Debug en Desarrollo
```javascript
// En browser console
debugProcessData()
```
Muestra:
- 📊 Resumen de datos
- 🔍 Errores y advertencias
- 📈 Health score

### 3. Health Check
```javascript
import { quickValidate } from '@/lib/processes-validator'

const health = quickValidate()
console.log(`Health Score: ${health.score}/100`)
```

## ⚠️ Errores Comunes y Soluciones

### ❌ Error: "processCategories is not exported"
**Causa**: Exportación faltante en `processes-data.ts`
**Solución**: Agregar `export const processCategories = [...]`

### ❌ Error: "Cannot convert undefined to object"
**Causa**: `processList` es undefined en `generateStaticParams`
**Solución**: Asegurar que `processList` esté exportado correctamente

### ❌ Error: "NextStep reference not found"
**Causa**: Referencia a paso que no existe
**Solución**: Verificar que todos los `nextStep` apunten a pasos existentes

### ❌ Error: "Solo muestra Finalizar"
**Causa**: Pasos sin `nextStep` o `options`
**Solución**: Agregar `nextStep` a pasos action/info, `options` a pasos question

## 🔄 Actualización Masiva

### Para Reemplazar Todos los Procesos:
```bash
# 1. Backup
cp lib/processes-data.ts lib/processes-data.old.ts

# 2. Reemplazar datos
# Usar CSV o JSON actualizado

# 3. Validar
npm run validate

# 4. Testing local
npm run dev

# 5. Deployment
git add .
git commit -m "feat: reemplazar todos los procesos"
git push origin main
```

## 📱 Verificación Post-Deployment

### Checklist de Verificación:
- [ ] Dashboard muestra categorías correctas
- [ ] Procesos aparecen en categorías correctas
- [ ] Pasos question muestran opciones
- [ ] Pasos action/info muestran "Siguiente"
- [ ] Navegación completa funciona
- [ ] No hay errores en console
- [ ] Build exitoso sin warnings

## 🆘 Soporte y Troubleshooting

### Si algo falla:
1. **Revisar logs de Vercel**: Buscar errores específicos
2. **Validar localmente**: `npm run validate`
3. **Verificar estructura**: Comparar con ejemplos existentes
4. **Limpiar cache**: Forzar nuevo deployment
5. **Rollback**: `git revert` al último commit funcional

### Contacto de Soporte:
- Revisar `PROCESSES_MAINTENANCE.md`
- Usar herramientas de validación integradas
- Documentar cualquier error encontrado

---

## 📝 Template para Nuevos Procesos

Copiar y adaptar esta estructura:

```typescript
// Categoría
{
  id: "categoria-id",
  title: "Título Visible",
  description: "Descripción breve",
  icon: "IconName",
  color: "bg-color-500",
  processes: 1,
  avgTime: "X-Y min",
  href: "/processes/categoria-id"
}

// Proceso
{
  id: "proc-id-unico",
  title: "Título del Proceso",
  description: "Descripción completa y detallada",
  category: "categoria-id",
  steps: N,
  avgTime: "X-Y min",
  difficulty: "Fácil" | "Medio" | "Difícil",
  usage: 0,
  lastUpdated: "Hoy"
}

// Paso
{
  id: "step-N",
  title: "Título del Paso",
  description: "Descripción del paso",
  type: "question" | "action" | "info" | "validation",
  content: "Contenido visible para el usuario",
  estimatedTime: "X minutos",
  options: [...], // Solo para question
  nextStep: "step-N+1" // Para action/info
}
```

**¡Feliz actualización de procesos! 🎉**
