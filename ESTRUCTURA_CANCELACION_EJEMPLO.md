# ESTRUCTURA COMPLETA DEL PROCESO DE CANCELACIÓN
## Versión Funcional - 8 de Febrero 2026

---

## 📋 Estructura General del Archivo

```typescript
export interface ProcessStep {
  id: string
  title: string
  description: string
  type: "info" | "question" | "action" | "validation"
  content: string
  options?: {
    id: string
    label: string
    nextStep?: string
    action?: string
  }[]
  nextStep?: string
  warning?: string
  tip?: string
  estimatedTime?: string
}

export interface Process {
  id: string
  title: string
  description: string
  category: string
  steps: number
  avgTime: string
  difficulty: "Fácil" | "Medio" | "Difícil"
  usage: number
  lastUpdated: string
}

export interface ProcessCategory {
  id: string
  title: string
  description: string
  icon: string
  color: string
  processes: number
  avgTime: string
  href: string
}
```

---

## 🔄 Proceso de Cancelación Completo

### Paso 1: Identificación Inicial
```typescript
{
  id: "step-1",
  title: "¿El paciente se comunica para cancelar o para dar seguimiento a su cancelación?",
  description: "Identificar el motivo principal de la comunicación",
  type: "question",
  content: "Preguntar si el paciente está llamando para cancelar o para dar seguimiento a una cancelación previa.",
  estimatedTime: "1 minuto",
  options: [
    { 
      id: "seguimiento", 
      label: "Seguimiento", 
      nextStep: "step-seguimiento" 
    },
    { 
      id: "cancelar", 
      label: "Cancelar", 
      nextStep: "step-cancelar" 
    }
  ]
}
```

### Paso 2: Proceso de Seguimiento
```typescript
{
  id: "step-seguimiento",
  title: "Proceso de Seguimiento",
  description: "Gestionar seguimiento de cancelación",
  type: "action",
  content: `Paso 1: Validar que tenga un Churn para cancelación y quién lo tiene Asignado.
Paso 2: Pedir al paciente un día y un rango de horario.
Paso 3: Validar horarios disponibles con el paciente de acuerdo al calendario que visualizamos.
Paso 4: Seleccionar el horario y llenar los campos de Nombre y Apellido con los datos del PX.
Paso 5: En el campo de correo electrónico poner el correo del paciente registrado con Clivi.
Paso 6: Mencionar al paciente el horario en el que le estarían marcando.
Paso 7: Marcar como Resuelto.`,
  nextStep: "step-completado",
  tip: "Validar siempre que el churn esté asignado antes de agendar",
  estimatedTime: "5 minutos"
}
```

### Paso 3: Iniciar Cancelación
```typescript
{
  id: "step-cancelar",
  title: "Paso 1 - Preguntar Motivo de cancelación",
  description: "Identificar el motivo específico de cancelación",
  type: "question",
  content: "Preguntar el motivo específico por el cual desea cancelar.",
  options: [
    {
      id: "motivos-medicos",
      label: "Por motivos médicos (No se siente bien, tiene que continuar con algún otro tratamiento, se encuentra muy enfermo)",
      nextStep: "step-gestion-especialista"
    },
    {
      id: "meta-esperada",
      label: "Ya llegó a su meta esperada",
      nextStep: "step-downgrade"
    },
    {
      id: "economicos",
      label: "Ya no lo puede pagar por cuestiones económicas",
      nextStep: "step-churn-baja"
    },
    {
      id: "no-quiere-medicamento",
      label: "Ya no puede pagar porque no quiere el medicamento",
      nextStep: "step-downgrade"
    },
    {
      id: "problema-envio",
      label: "Complicaciones con el envío de insumos",
      nextStep: "step-reenvio-insumos"
    },
    {
      id: "conflicto-especialista",
      label: "Algún conflicto con algún especialista",
      nextStep: "step-cambiar-especialista"
    }
  ],
  estimatedTime: "2 minutos"
}
```

### Paso 4: Cambio de Especialista
```typescript
{
  id: "step-cambiar-especialista",
  title: "Cambiar de Especialista",
  description: "Cambio de especialista por conflicto",
  type: "action",
  content: `Buscar el seguimiento con algún otro especialista disponible → Seguir proceso de agendar cita
Preguntar el motivo
Generar Task por 'Queja'
Si corresponde cita subsecuente se genera cambio de especialista en Calendly como agendamiento de cita de primera vez (Long)`,
  nextStep: "step-razon-ingreso",
  tip: "Generar Task por 'Queja' si corresponde",
  estimatedTime: "3 minutos"
}
```

### Paso 5: Razón de Ingreso
```typescript
{
  id: "step-razon-ingreso",
  title: "Paso 2 - Preguntar Razón de ingreso",
  description: "Determinar plan y beneficios del paciente",
  type: "question",
  content: "Preguntar la razón de ingreso para determinar el plan y beneficios disponibles.",
  options: [
    {
      id: "diabetes",
      label: "Diabetes",
      nextStep: "step-contencion"
    },
    {
      id: "zero",
      label: "Zero",
      nextStep: "step-contencion"
    }
  ],
  estimatedTime: "1 minuto"
}
```

### Paso 6: Proceso de Contención
```typescript
{
  id: "step-contencion",
  title: "Paso 3 - Contención",
  description: "Retención del paciente",
  type: "action",
  content: `Ser muy empáticos y defensores del paciente
Ideas de retención:
• Gestión de Especialista: Validar sus citas agendadas, por si es posible reagendar su cita → Seguir proceso de Agendamiento de cita
• Cambio de especialista: Buscar el seguimiento con algún otro especialista disponible → Seguir proceso de agendar cita
• Envío de insumos: Identificar si aplica envío de insumos → Seguir proceso de envío de medicamentos
• Downgrade: Se realiza disminución de dosis, cuando las dosis son altas ejemplo (Wegovy 1.8 en adelante a baja de dosis de 1mg). O se elimina el medicamento. Seleccionar al especialista como 'Gestión de especialista a Balance' y creación de Task a Salud (Admin)`,
  nextStep: "step-confirmar-cancelacion",
  tip: "Mostrar empatía genuina y buscar soluciones alternativas",
  estimatedTime: "3 minutos"
}
```

### Paso 7: Confirmación Final
```typescript
{
  id: "step-confirmar-cancelacion",
  title: "¿El paciente quiere cancelar?",
  description: "Confirmar intención final de cancelación",
  type: "question",
  content: "Confirmar si después de las opciones de retención, el paciente aún desea cancelar.",
  options: [
    {
      id: "no-cancelar",
      label: "NO - No quiere cancelar",
      nextStep: "step-no-cancelar"
    },
    {
      id: "si-cancelar",
      label: "SI - SI Quiere cancelar",
      nextStep: "step-paciente-molesto"
    }
  ],
  estimatedTime: "1 minuto"
}
```

### Paso 8: Evaluación de Molestia
```typescript
{
  id: "step-paciente-molesto",
  title: "¿El paciente está muy molesto?",
  description: "Evaluar nivel de molestia del paciente",
  type: "question",
  content: "Evaluar si el paciente está muy molesto para determinar el proceso de escalación.",
  options: [
    {
      id: "no-molesto",
      label: "NO - Cerrar como Resuelto",
      nextStep: "step-proceso-baja"
    },
    {
      id: "si-molesto",
      label: "SI - El paciente está muy molesto",
      nextStep: "step-escalacion-urgente"
    }
  ],
  estimatedTime: "1 minuto"
}
```

### Paso 9: Escalación Urgente
```typescript
{
  id: "step-escalacion-urgente",
  title: "Escalación Urgente",
  description: "Paciente muy molesto - escalación inmediata",
  type: "action",
  content: `Se escala por medio del Chat de Gmail al grupo 'Nivel 2: Retención Soporte' (Asunto Money)
Arrobanado a la persona que tiene el ticket asignado
Compartir link del perfil de Hubspot y describir la situación`,
  nextStep: "step-completado",
  tip: "Escalar inmediatamente si el paciente está muy molesto",
  estimatedTime: "2 minutos"
}
```

### Paso 10: Proceso de Baja Estándar
```typescript
{
  id: "step-proceso-baja",
  title: "Proceso de Baja Estándar",
  description: "Proceso estándar de baja",
  type: "action",
  content: `Cerrar como Resuelto
Se realiza Guía Práctica de solicitud de baja
Se redacta nota
Se escala por medio del Chat de Gmail al grupo 'Nivel 2: Retención Soporte' (Asunto Money)
Arrobanado a la persona que tiene el ticket asignado
Abrir el calendario de retenciones (https://docs.google.com/spreadsheets/d/1LeZxuQLkz15cAIixmoLCLGIkQNvV0/edit?usp=sharing)
Se selecciona la persona que tiene el churn asignado
Se marca el churn como 'Gestión de especialista a Balance' y creación de Task a Salud (Admin)`,
  nextStep: "step-completado",
  tip: "Explicar que se van a comunicar con él para el proceso de baja",
  estimatedTime: "4 minutos"
}
```

### Paso 11: Proceso Completado
```typescript
{
  id: "step-completado",
  title: "Proceso Completado",
  description: "Proceso de cancelación finalizado",
  type: "info",
  content: "El proceso de cancelación ha sido completado según el flujo correspondiente.",
  estimatedTime: "1 minuto"
}
```

---

## 🎯 Puntos Clave de la Estructura

### ✅ **Flujo Lógico:**
1. **Identificación** → Seguimiento o Cancelación
2. **Seguimiento** → Agendar y resolver
3. **Cancelación** → Identificar motivo específico
4. **Contención** → Retener con opciones específicas
5. **Confirmación** → Validar decisión final
6. **Escalación** → Según nivel de molestia
7. **Baja** → Proceso final según corresponda

### ✅ **Opciones de Decisión:**
- **label**: Texto visible para el usuario
- **nextStep**: Paso siguiente en el flujo
- **id**: Identificador único para cada opción
- **estimatedTime**: Tiempo estimado por paso

### ✅ **Tips y Warnings:**
- **tip**: Sugerencias para el agente
- **warning**: Advertencias importantes
- **content**: Información detallada del paso

### ✅ **Types de Paso:**
- **question**: Para decisiones con opciones
- **action**: Para acciones específicas
- **info**: Para información final
- **validation**: Para validaciones de datos

---

## 🚀 Cómo Usar esta Estructura

### Para modificar o crear nuevos procesos:

1. **Copiar la estructura** del paso que necesites
2. **Cambiar** los valores de `id`, `title`, `description`, `content`
3. **Ajustar** las `options` según tus necesidades
4. **Mantener** los `nextStep` conectados correctamente
5. **Actualizar** el `estimatedTime` según la complejidad

### Para añadir nuevos procesos:

1. **Definir el proceso** en `processList`
2. **Crear los pasos** en `processSteps`
3. **Añadir la categoría** si es necesario en `processCategories`
4. **Mantener** las interfaces consistentes

---

## 📝 Notas Importantes

- **Mantener siempre los `nextStep` conectados**
- **Usar `estimatedTime` realista**
- **Ser específico en los `content`**
- **Incluir `tips` útiles para el agente**
- **Validar que no haya pasos sin conexión**

Esta estructura está funcionando perfectamente en producción y puedes usarla como base para cualquier modificación que necesites.
