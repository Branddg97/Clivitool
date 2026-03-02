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

// Categorías de procesos de Clivi - ACTUALIZADO
export const processCategories: ProcessCategory[] = [
  {
    id: "cancelacion",
    title: "Cancelación",
    description: "Proceso de cancelación de pacientes y retención",
    icon: "UserMinus",
    color: "bg-red-500",
    processes: 1,
    avgTime: "15-20 min",
    href: "/processes/cancelacion",
  },
  {
    id: "supplies",
    title: "Supplies",
    description: "Proceso de envío de medicamentos y gestión de entregas",
    icon: "Truck",
    color: "bg-green-500",
    processes: 2,
    avgTime: "10-15 min",
    href: "/processes/supplies",
  },
  {
    id: "citas",
    title: "Citas",
    description: "Agendamiento de citas y seguimiento de pacientes",
    icon: "Calendar",
    color: "bg-blue-500",
    processes: 1,
    avgTime: "10-20 min",
    href: "/processes/citas",
  },
  {
    id: "cuentas",
    title: "Cuentas",
    description: "Gestión de cuentas y restablecimiento de contraseña",
    icon: "User",
    color: "bg-gray-500",
    processes: 1,
    avgTime: "5-8 min",
    href: "/processes/cuentas",
  },
]

// Lista de procesos
export const processList: Record<string, Process[]> = {
  cancelacion: [
    {
      id: "proc-cancelacion",
      title: "Cancelación",
      description: "Proceso para dar seguimiento o gestionar la cancelación del paciente, incluyendo contención, retención y escalaciones según el nivel de molestia.",
      category: "cancelacion",
      steps: 4,
      avgTime: "15-20 min",
      difficulty: "Difícil",
      usage: 76,
      lastUpdated: "Hoy"
    }
  ],
  supplies: [
    {
      id: "proc-envio-medicamento",
      title: "Envío de Medicamento",
      description: "Proceso para validar y dar seguimiento al envío del medicamento, ya sea de primera vez o subsecuente, incluyendo validación en Admin/Chargebee y comunicación de tracking.",
      category: "supplies",
      steps: 2,
      avgTime: "10-15 min",
      difficulty: "Medio",
      usage: 156,
      lastUpdated: "Hoy"
    },
    {
      id: "proc-error-direccion-entrega",
      title: "Error en la Dirección de Entrega",
      description: "Proceso para validar, corregir y confirmar dirección de entrega, incluyendo validación de cobertura por CP, cambios en Admin y escalación a Supplies.",
      category: "supplies",
      steps: 4,
      avgTime: "15-25 min",
      difficulty: "Difícil",
      usage: 78,
      lastUpdated: "Hoy"
    }
  ],
  citas: [
    {
      id: "proc-agendamiento-citas",
      title: "Agendamiento de Citas",
      description: "Proceso para agendar citas Long/Short según tipo de cita, plan y complejidad del paciente, incluyendo reglas críticas de asignación médica.",
      category: "citas",
      steps: 2,
      avgTime: "10-20 min",
      difficulty: "Medio",
      usage: 145,
      lastUpdated: "Hoy"
    }
  ],
  cuentas: [
    {
      id: "proc-prueba",
      title: "Restablecimiento de Contraseña",
      description: "Proceso para validar identidad del usuario y ejecutar el restablecimiento de contraseña en el sistema, incluyendo verificación de seguridad y confirmación final.",
      category: "cuentas",
      steps: 3,
      avgTime: "5-8 min",
      difficulty: "Fácil",
      usage: 25,
      lastUpdated: "Hoy"
    }
  ]
}

// Pasos detallados de cada proceso
export const processSteps: Record<string, ProcessStep[]> = {
  "proc-cancelacion": [
    {
      id: "step-1",
      title: "Decisión Inicial",
      description: "Determinar si el paciente se comunica para cancelar o para dar seguimiento a su cancelación",
      type: "question",
      content: "¿El paciente se comunica para cancelar o para dar seguimiento a su cancelación?",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-2",
      title: "Seguimiento",
      description: "Validar Churn y agendar seguimiento",
      type: "action",
      content: "Validar que tenga un Churn para cancelación y quién lo tiene asignado. Pedir al paciente un día para agendar y un rango de horario.",
      estimatedTime: "3 minutos"
    },
    {
      id: "step-3",
      title: "Cancelar",
      description: "Proceso de cancelación con contención",
      type: "action",
      content: "Preguntar motivo de cancelación, clasificar motivo y aplicar retención según corresponda.",
      estimatedTime: "5 minutos"
    },
    {
      id: "step-4",
      title: "Decisión Final",
      description: "Confirmar si el paciente quiere cancelar definitivamente",
      type: "question",
      content: "¿El paciente quiere cancelar definitivamente?",
      estimatedTime: "2 minutos"
    }
  ],
  "proc-envio-medicamento": [
    {
      id: "step-1",
      title: "Validar tipo de envío",
      description: "Determinar si es primera vez o subsecuente",
      type: "question",
      content: "¿Es envío de primera vez?",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-2",
      title: "Validar en Admin",
      description: "Revisar Delivery Status y validar envío",
      type: "info",
      content: "Validar en Admin > Feed > Delivery > Detalles de la orden > Historial",
      estimatedTime: "3 minutos"
    },
    {
      id: "step-3",
      title: "Compartir tracking",
      description: "Proporcionar liga de rastreo y tiempos",
      type: "action",
      content: "Compartir liga de rastreo y mencionar que tarda 5 a 7 días hábiles",
      estimatedTime: "2 minutos"
    }
  ],
  "proc-error-direccion-entrega": [
    {
      id: "step-1",
      title: "Sondear motivo",
      description: "Investigar por qué necesita cambiar la dirección",
      type: "question",
      content: "¿Por qué necesita cambiar la dirección de entrega?",
      estimatedTime: "2 minutos"
    },
    {
      id: "step-2",
      title: "Revisar direcciones",
      description: "Validar dirección registrada y de envío",
      type: "info",
      content: "Revisar dirección registrada en Admin: Perfil > Home y dirección de la guía de rastreo",
      estimatedTime: "3 minutos"
    },
    {
      id: "step-3",
      title: "Contactar paciente",
      description: "Llamar para confirmar dirección",
      type: "action",
      content: "Realizar llamada al paciente para confirmar dirección (3 intentos cada 5 minutos)",
      estimatedTime: "10 minutos"
    },
    {
      id: "step-4",
      title: "Validar cobertura",
      description: "Confirmar cobertura por CP",
      type: "validation",
      content: "Validar cobertura en Looker Studio usando el CP (verde=si aplica, rojo=no aplica)",
      estimatedTime: "3 minutos"
    }
  ],
  "proc-agendamiento-citas": [
    {
      id: "step-1",
      title: "Identificar tipo de cita",
      description: "Determinar duración según tipo de paciente",
      type: "info",
      content: "Cita Primera Vez: 45 minutos (Long). Cita Subsecuente: 30 minutos (Short).",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-2",
      title: "Identificar tipo de paciente",
      description: "Clasificar al paciente según complejidad",
      type: "info",
      content: "Paciente Simple: Medicina General (Diana, Gabrielle, Ma. Fernanda). Paciente Complejo: médicos especialistas. Diabetes: endocrinólogos.",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-3",
      title: "Validar plan",
      description: "Confirmar plan mensual y disponibilidad",
      type: "validation",
      content: "Validar si tiene plan mensual (citas cada mes) y disponibilidad médica",
      estimatedTime: "3 minutos"
    }
  ],
  "proc-prueba": [
    {
      id: "step-1",
      title: "Validar acceso",
      description: "Verificar si el usuario tiene acceso al correo registrado",
      type: "question",
      content: "¿El usuario tiene acceso al correo electrónico registrado en el sistema?",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-2",
      title: "Enviar enlace",
      description: "Enviar enlace de restablecimiento desde Admin",
      type: "action",
      content: "Enviar enlace de restablecimiento desde Admin > Security > Password Reset",
      estimatedTime: "2 minutos"
    },
    {
      id: "step-3",
      title: "Confirmar acceso",
      description: "Verificar que el usuario pudo ingresar correctamente",
      type: "validation",
      content: "Confirmar cuando el usuario ya pudo ingresar con la nueva contraseña",
      estimatedTime: "1 minuto"
    }
  ]
}
