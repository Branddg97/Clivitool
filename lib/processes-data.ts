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

// Categorías de procesos de Clivi
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
    processes: 3,
    avgTime: "10-15 min",
    href: "/processes/supplies",
  },
  {
    id: "pagos",
    title: "Pagos",
    description: "Gestión de pagos, cambios de fecha y adelantos",
    icon: "CreditCard",
    color: "bg-purple-500",
    processes: 2,
    avgTime: "10-15 min",
    href: "/processes/pagos",
  },
  {
    id: "citas",
    title: "Citas",
    description: "Agendamiento de citas y seguimiento de pacientes",
    icon: "Calendar",
    color: "bg-blue-500",
    processes: 2,
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
      description: "Proceso para dar seguimiento o gestiónar la cancelación del paciente, incluyendo contención, retención y escalaciones según el nivel de molestia.",
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
    },
    {
      id: "proc-medicamento-danado",
      title: "Medicamento Dañado",
      description: "Proceso para identificar el daño en medicamento y solicitar evidencia para proceder con soporte.",
      category: "supplies",
      steps: 2,
      avgTime: "10-15 min",
      difficulty: "Fácil",
      usage: 45,
      lastUpdated: "Hoy"
    }
  ],
  pagos: [
    {
      id: "proc-cambio-fecha-pago",
      title: "Cambio de Fecha de Pago",
      description: "Proceso para validar pagos en Chargebee, confirmar nueva fecha, crear guía práctica y escalar si es urgente o el paciente está molesto.",
      category: "pagos",
      steps: 4,
      avgTime: "10-15 min",
      difficulty: "Medio",
      usage: 134,
      lastUpdated: "Hoy"
    },
    {
      id: "proc-adelanto-pago",
      title: "Adelanto de Pago (por envío de medicamento)",
      description: "Proceso para adelantar 1 pago, validarlo en Chargebee, crear guía práctica y resolver según pago exitoso/fallido, incluyendo actualización de método de pago y escalación.",
      category: "pagos",
      steps: 4,
      avgTime: "15-25 min",
      difficulty: "Difícil",
      usage: 98,
      lastUpdated: "Hoy"
    }
  ],
  citas: [
    {
      id: "proc-paciente-sin-cita-segundo-pago",
      title: "Paciente sin cita con segundo pago próximo",
      description: "Proceso para pacientes con segundo pago próximo sin cita, diferenciando primera vez vs subsecuente, validando labs, plan, motivo de cita y escalación a salud o adherencia.",
      category: "citas",
      steps: 2,
      avgTime: "20-35 min",
      difficulty: "Difícil",
      usage: 87,
      lastUpdated: "Hoy"
    },
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
    }
  ],
  "proc-medicamento-danado": [
    {
      id: "step-1",
      title: "Identificar daño",
      description: "Preguntar en qué aspecto está dañado el medicamento",
      type: "question",
      content: "¿En qué aspecto está dañado el medicamento?",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-2",
      title: "Solicitar evidencia",
      description: "Pedir video o foto del daño",
      type: "action",
      content: "Por favor, envíe una foto o video corto mostrando el daño del medicamento",
      estimatedTime: "2 minutos"
    }
  ],
  "proc-cambio-fecha-pago": [
    {
      id: "step-1",
      title: "Validar pagos",
      description: "Revisar Chargebee para validar fechas de pago",
      type: "info",
      content: "Validar en Chargebee: revisar fechas de pago y validar que no tenga adeudo.",
      estimatedTime: "3 minutos"
    }
  ],
  "proc-adelanto-pago": [
    {
      id: "step-1",
      title: "Indagar motivo",
      description: "Investigar por qué se está adelantando el pago",
      type: "question",
      content: "¿Por qué necesita adelantar el pago?",
      estimatedTime: "2 minutos"
    }
  ],
  "proc-paciente-sin-cita-segundo-pago": [
    {
      id: "step-1",
      title: "Validar tipo de paciente",
      description: "Determinar si es primera vez o subsecuente",
      type: "question",
      content: "¿El paciente es de primera vez?",
      estimatedTime: "1 minuto"
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
      content: "Paciente Simple: Medicina General. Paciente Complejo: médicos especialistas. Diabetes: endocrinólogos.",
      estimatedTime: "1 minuto"
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
