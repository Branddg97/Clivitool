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
    avgTime: "8-15 min",
    href: "/processes/cancelacion",
  },
  {
    id: "medicamento",
    title: "Envío de Medicamento",
    description: "Gestión de envíos de medicamentos a pacientes",
    icon: "Pill",
    color: "bg-green-500",
    processes: 1,
    avgTime: "5-8 min",
    href: "/processes/medicamento",
  },
  {
    id: "pagos",
    title: "Gestión de Pagos",
    description: "Cambio de fecha, adelanto de pago y errores de pago",
    icon: "CreditCard",
    color: "bg-purple-500",
    processes: 3,
    avgTime: "4-10 min",
    href: "/processes/pagos",
  },
  {
    id: "envios",
    title: "Envíos y Entregas",
    description: "Error en dirección, confirmación de delivery",
    icon: "Truck",
    color: "bg-blue-500",
    processes: 2,
    avgTime: "3-5 min",
    href: "/processes/envios",
  },
  {
    id: "compras",
    title: "Compra de Medicamento",
    description: "Compras adicionales, robo, extravío o daño",
    icon: "ShoppingCart",
    color: "bg-orange-500",
    processes: 1,
    avgTime: "5-10 min",
    href: "/processes/compras",
  },
  {
    id: "upgrade",
    title: "Upgrade",
    description: "Aumento de dosis y cambio de plan",
    icon: "TrendingUp",
    color: "bg-teal-500",
    processes: 1,
    avgTime: "5-8 min",
    href: "/processes/upgrade",
  },
  {
    id: "citas",
    title: "Citas y Seguimiento",
    description: "Agendamiento de citas y flujo de pacientes",
    icon: "Calendar",
    color: "bg-cyan-500",
    processes: 2,
    avgTime: "5-10 min",
    href: "/processes/citas",
  },
]

// Lista de procesos
export const processList: Record<string, Process[]> = {
  cancelacion: [
    {
      id: "proc-cancelacion",
      title: "Cancelación de Paciente",
      description: "Proceso completo de cancelación con opciones de retención",
      category: "cancelacion",
      steps: 12,
      avgTime: "10-15 min",
      difficulty: "Difícil",
      usage: 89,
      lastUpdated: "Hace 1 día",
    },
  ],
  medicamento: [
    {
      id: "proc-envio-medicamento",
      title: "Envío de Medicamento",
      description: "Proceso para gestionar envíos de medicamento",
      category: "medicamento",
      steps: 6,
      avgTime: "5-8 min",
      difficulty: "Medio",
      usage: 156,
      lastUpdated: "Hace 1 día",
    },
  ],
  pagos: [
    {
      id: "proc-cambio-fecha-pago",
      title: "Cambio Fecha de Pago",
      description: "Modificar la fecha de cobro del paciente",
      category: "pagos",
      steps: 5,
      avgTime: "4-6 min",
      difficulty: "Fácil",
      usage: 134,
      lastUpdated: "Hace 2 días",
    },
    {
      id: "proc-adelanto-pago",
      title: "Adelanto de Pago",
      description: "Adelantar pago por envío de medicamento",
      category: "pagos",
      steps: 10,
      avgTime: "8-12 min",
      difficulty: "Medio",
      usage: 98,
      lastUpdated: "Hace 1 día",
    },
    {
      id: "proc-payment-error",
      title: "Payment Error",
      description: "Gestión de errores de pago y facturas con deuda",
      category: "pagos",
      steps: 8,
      avgTime: "6-10 min",
      difficulty: "Medio",
      usage: 112,
      lastUpdated: "Hace 1 día",
    },
  ],
  envios: [
    {
      id: "proc-error-direccion",
      title: "Error en Dirección de Entrega",
      description: "Corrección de dirección de envío",
      category: "envios",
      steps: 4,
      avgTime: "3-5 min",
      difficulty: "Fácil",
      usage: 78,
      lastUpdated: "Hace 3 días",
    },
    {
      id: "proc-confirmacion-delivery",
      title: "Confirmación de Delivery",
      description: "Validar estado de entrega de paquetes",
      category: "envios",
      steps: 3,
      avgTime: "2-3 min",
      difficulty: "Fácil",
      usage: 203,
      lastUpdated: "Hace 1 día",
    },
  ],
  compras: [
    {
      id: "proc-compra-medicamento",
      title: "Compra de Medicamento",
      description: "Compras adicionales por robo, extravío o daño",
      category: "compras",
      steps: 8,
      avgTime: "6-10 min",
      difficulty: "Medio",
      usage: 67,
      lastUpdated: "Hace 2 días",
    },
  ],
  upgrade: [
    {
      id: "proc-upgrade",
      title: "Upgrade de Dosis",
      description: "Proceso de aumento de dosis y cambio de plan",
      category: "upgrade",
      steps: 10,
      avgTime: "5-8 min",
      difficulty: "Medio",
      usage: 145,
      lastUpdated: "Hace 1 día",
    },
  ],
  citas: [
    {
      id: "proc-flujo-px-sin-cita",
      title: "Flujo PX sin Cita (Segundo Pago Próximo)",
      description: "Proceso para pacientes sin cita con segundo pago próximo",
      category: "citas",
      steps: 4,
      avgTime: "5-8 min",
      difficulty: "Medio",
      usage: 87,
      lastUpdated: "Hoy",
    },
    {
      id: "proc-agendamiento-citas",
      title: "Agendamiento de Citas",
      description: "Proceso para agendar citas primera vez y subsecuentes",
      category: "citas",
      steps: 3,
      avgTime: "3-5 min",
      difficulty: "Fácil",
      usage: 234,
      lastUpdated: "Hoy",
    },
  ],
}

// Pasos detallados de cada proceso
export const processSteps: Record<string, ProcessStep[]> = {
  "proc-cancelacion": [
    {
      id: "step-1",
      title: "Preguntar Motivo de Cancelación",
      description: "Identificar la razón por la que el paciente desea cancelar",
      type: "question",
      content: "Preguntar al paciente el motivo de su cancelación para determinar la mejor opción de retención.",
      options: [
        {
          id: "motivos-medicos",
          label: "Motivos médicos (no se siente bien, otro tratamiento, muy enfermo)",
          nextStep: "step-2-1",
        },
        {
          id: "meta-alcanzada",
          label: "Ya llegó a su meta esperada",
          nextStep: "step-downgrade",
        },
        {
          id: "no-puede-pagar",
          label: "Ya no lo puede pagar",
          nextStep: "step-downgrade",
        },
        {
          id: "problema-envio",
          label: "Complicaciones con el envío de insumos",
          nextStep: "step-reenvio",
        },
        {
          id: "conflicto-especialista",
          label: "Conflicto con algún especialista",
          nextStep: "step-cambio-especialista",
        },
      ],
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2-1",
      title: "Gestión de Especialista y Psicología",
      description: "Para motivos médicos",
      type: "action",
      content:
        "Ofrecer citas con Psicología y gestión de especialista.\n\nAcción: Agendar cita con especialista o Psicología → Seguir proceso de agendar cita",
      nextStep: "step-2",
      tip: "Mostrar empatía con el paciente por su situación de salud",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-downgrade",
      title: "Ofrecer Downgrade",
      description: "Opción para reducir plan y mantener al paciente",
      type: "action",
      content: "Gestión de especialista a Balance.\n\nOfrecer plan de menor costo para retener al paciente.",
      nextStep: "step-2",
      tip: "Explicar los beneficios de mantener el tratamiento a menor costo",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-reenvio",
      title: "Re-envío de Insumos",
      description: "Resolver problemas de envío",
      type: "action",
      content:
        "Identificar el problema con el envío y gestionar re-envío de insumos.\n\nSeguir proceso de envío de insumos.",
      nextStep: "step-2",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-cambio-especialista",
      title: "Cambio de Especialista",
      description: "Asignar nuevo especialista",
      type: "action",
      content:
        "Buscar el seguimiento con algún otro especialista disponible.\n\nSeguir proceso de agendar cita con nuevo especialista.",
      nextStep: "step-2",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-2",
      title: "Preguntar Razón de Ingreso",
      description: "Identificar el programa del paciente",
      type: "question",
      content: "Consultar al paciente cuál fue su razón de ingreso al programa.",
      options: [
        {
          id: "diabetes",
          label: "Diabetes",
          nextStep: "step-3",
        },
        {
          id: "zero",
          label: "Zero (pérdida de peso)",
          nextStep: "step-3",
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-3",
      title: "Contención",
      description: "Aplicar ideas de retención",
      type: "question",
      content: "¿El paciente aceptó alguna de las opciones de retención ofrecidas?",
      options: [
        {
          id: "acepta",
          label: "Sí, no quiere cancelar",
          nextStep: "step-no-cancela",
        },
        {
          id: "no-acepta",
          label: "No, sí quiere cancelar",
          nextStep: "step-cancela",
        },
      ],
      estimatedTime: "2 minutos",
    },
    {
      id: "step-no-cancela",
      title: "Retención Exitosa",
      description: "El paciente decide no cancelar",
      type: "action",
      content:
        "1. Hacer Ticket para dar seguimiento\n2. Dejar nota detallada del caso\n3. Confirmar siguiente acción con el paciente",
      tip: "Agradecer al paciente por continuar con Clivi",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-cancela",
      title: "Procesar Cancelación",
      description: "El paciente confirma que quiere cancelar",
      type: "action",
      content:
        "1. Cerrar como duplicado\n2. Realizar Guía Práctica de solicitud de baja\n3. Redactar nota detallada\n4. Explicar que se van a comunicar con él (Churn - es baja)\n5. Compartir link de HubSpot cuando se contacte para dar seguimiento\n6. Pedir horario de contacto preferido",
      warning: "Asegurarse de completar toda la documentación antes de cerrar",
      estimatedTime: "5 minutos",
    },
  ],
  "proc-envio-medicamento": [
    {
      id: "step-1",
      title: "Revisar Chargebee",
      description: "Verificar información de pago",
      type: "action",
      content: "Revisar en Chargebee:\n\n• Pago próximo\n• Validar método de pago registrado",
      nextStep: "step-2",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Validar Fechas de Pago",
      description: "Confirmar estado del pago",
      type: "question",
      content:
        "Verificar si está próximo el pago o si ya pagaron.\nValidar que vamos a hacer cobro para validar la autorización.",
      options: [
        {
          id: "pago-proximo",
          label: "Pago próximo / Ya pagaron",
          nextStep: "step-3",
        },
        {
          id: "pago-pendiente",
          label: "Pago pendiente / Sin autorización",
          nextStep: "step-pendiente",
        },
      ],
      estimatedTime: "2 minutos",
    },
    {
      id: "step-pendiente",
      title: "Gestionar Pago Pendiente",
      description: "Resolver situación de pago",
      type: "action",
      content: "Contactar al paciente para resolver el pago pendiente antes de proceder con el envío.",
      nextStep: "step-3",
      warning: "No proceder con envío hasta confirmar pago",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-3",
      title: "Pago Autorizado",
      description: "Crear guía práctica",
      type: "action",
      content:
        "Una vez autorizado el pago:\n\n1. Abrir Guía Práctica\n2. Completar información de envío\n3. Confirmar dirección con el paciente",
      tip: "Verificar que la dirección sea correcta antes de generar la guía",
      estimatedTime: "3 minutos",
    },
  ],
  "proc-cambio-fecha-pago": [
    {
      id: "step-1",
      title: "Revisar Chargebee",
      description: "Verificar fechas actuales de pago",
      type: "action",
      content:
        "Ingresar a Chargebee y revisar:\n\n• Fechas de pagos actuales\n• Historial de pagos\n• Método de pago registrado",
      nextStep: "step-2",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Validar Nueva Fecha de Cobro",
      description: "Confirmar fecha deseada con el paciente",
      type: "action",
      content: "Preguntar al paciente la nueva fecha de cobro deseada y confirmar que es factible.",
      nextStep: "step-3",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-3",
      title: "Creación de Guía Práctica",
      description: "Documentar el cambio",
      type: "action",
      content: "Crear guía práctica con:\n\n• Fecha anterior\n• Nueva fecha solicitada\n• Motivo del cambio",
      nextStep: "step-4",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-4",
      title: "Validar con Supervisor",
      description: "Aprobar cambio de fecha",
      type: "action",
      content: "Validar con Supervisor para hacer el cargo en la nueva fecha.",
      tip: "Confirmar al paciente una vez aprobado el cambio",
      estimatedTime: "2 minutos",
    },
  ],
  "proc-error-direccion": [
    {
      id: "step-1",
      title: "Sondear Motivo del Cambio",
      description: "Entender por qué necesita cambiar la dirección",
      type: "action",
      content:
        "Preguntar al paciente por qué necesita cambiar la dirección de entrega:\n\n• Mudanza\n• Error al registrar\n• Preferencia de otra ubicación",
      nextStep: "step-2",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Revisar Dirección en Admin",
      description: "Verificar dirección registrada",
      type: "action",
      content: "Ingresar al Admin y revisar la dirección actualmente registrada para el paciente.",
      nextStep: "step-3",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-3",
      title: "Revisar Guía Registrada",
      description: "Verificar si ya hay guía generada",
      type: "action",
      content:
        "Revisar la dirección de la guía registrada.\n\nSi ya se generó guía con dirección incorrecta, coordinar con logística para corrección.",
      tip: "Si la guía ya fue enviada, contactar a paquetería para redireccionar",
      estimatedTime: "2 minutos",
    },
  ],
  "proc-confirmacion-delivery": [
    {
      id: "step-1",
      title: "Recepción de Aviso",
      description: "Avisos de paquetería por WhatsApp",
      type: "info",
      content:
        "Los avisos llegan por WhatsApp:\n\n• Confirmación de envío\n• Cuando la paquetería toma el paquete\n• Cuando se entrega al día siguiente",
      nextStep: "step-2",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-2",
      title: "Validar Conversación en Admin",
      description: "Verificar estado del envío",
      type: "action",
      content: "Validar la conversación en Admin para confirmar el estado actual del delivery.",
      tip: "Comunicar al paciente el status actualizado de su envío",
      estimatedTime: "2 minutos",
    },
  ],
  "proc-compra-medicamento": [
    {
      id: "step-1",
      title: "Preguntar Motivo de Compra",
      description: "Identificar razón de la compra adicional",
      type: "question",
      content: "¿Cuál es el motivo de la compra adicional de medicamento?",
      options: [
        {
          id: "robo-extravio",
          label: "Robo / Extravío o Daño",
          nextStep: "step-farmacia",
        },
        {
          id: "sin-medicamento",
          label: "Ya no tiene medicamento",
          nextStep: "step-adelantar",
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-farmacia",
      title: "Gestión con Farmacia",
      description: "Proceso de compra por robo/extravío",
      type: "action",
      content: "Dirigir a Farmacia para compra.\n\n⚠️ NO vender a pacientes Balance (Revisar guía de envío)",
      nextStep: "step-crear-negocio",
      warning: "Verificar que el paciente no sea de plan Balance",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-adelantar",
      title: "Adelantar Pago",
      description: "Opción de adelantar pago",
      type: "action",
      content: "Si el paciente ya no tiene medicamento, se puede adelantar el pago.",
      nextStep: "step-crear-negocio",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-crear-negocio",
      title: "Crear Negocio",
      description: "Registrar en HubSpot",
      type: "action",
      content:
        "Crear negocio - Supervisor o persona del domingo\n\nCompra de medicamento / Laboratorio:\n• Pipeline - Medicine\n• Pregunta o llamada entrante\n• Supplies Ties - Seleccionar cuál\n• Etapa del negocio\n• Valor - DE LA FARMACIA o del archivo verde (PRECIO)",
      nextStep: "step-proceso-pago",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-proceso-pago",
      title: "Proceso de Pago",
      description: "Gestionar cobro",
      type: "action",
      content:
        "Etapa - Ready:\n• Cambiar a charge medicine\n• Valor\n• Método de pago - Siempre dar Subscription o Tarjeta distinta\n• IVA\n• Medicamento\n\nLe llega un link a WhatsApp si agregó otra tarjeta, debe confirmar el link - 5 días hábiles.\n\nSi compra en tienda física, retención tiene que crear una deuda como pagada.",
      tip: "Confirmar con el paciente que recibió el link de pago",
      estimatedTime: "3 minutos",
    },
  ],
  "proc-adelanto-pago": [
    {
      id: "step-1",
      title: "Información Inicial",
      description: "Reglas de adelanto de pago",
      type: "info",
      content:
        "Se pueden adelantar 1 pago.\n\nEdith Silva - cuando quieren pagos trimestrales o semestrales o liga de pago para MSI.\n\nIndagar por qué se está adelantando el pago.",
      nextStep: "step-2",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Verificar Pago",
      description: "Revisar en Chargebee",
      type: "question",
      content:
        "En el apartado de notas (Esperar unos minutos):\n\n1. Pago confirmado se valida en Chargebee - Aparece como Paid con notificación del día creado\n2. Pago declinado - No aparece nada",
      options: [
        {
          id: "pago-exitoso",
          label: "Pago confirmado (Paid)",
          nextStep: "step-guia-practica",
        },
        {
          id: "pago-fallido",
          label: "Pago declinado",
          nextStep: "step-error-pago",
        },
      ],
      estimatedTime: "3 minutos",
    },
    {
      id: "step-error-pago",
      title: "Gestionar Error de Pago",
      description: "Resolver problemas con tarjeta",
      type: "action",
      content:
        "Preguntar si hay algún problema con la tarjeta:\n\n• Verificar que esté encendida y que cuente con fondos\n• Si todo OK volver a intentar (mínimo 3 veces)\n• Indicar que el banco lo puede detectar como fraudulento",
      nextStep: "step-alternativas",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-alternativas",
      title: "Alternativas de Pago",
      description: "Cambio de método de pago",
      type: "action",
      content:
        "Alternativas:\n\n1. Cambio método de pago\n2. Ir a Chargebee\n3. Darle click en el ojito\n4. Dar click en actualizar método de pago\n5. El cliente llena los campos\n6. Validar en Chargebee la actualización (Transacciones)\n7. Confirmar\n8. Hacer un nuevo intento de adelanto de pago, dándole refresh",
      nextStep: "step-escalar",
      estimatedTime: "5 minutos",
    },
    {
      id: "step-escalar",
      title: "Escalar si No Funciona",
      description: "Contactar a Héctor",
      type: "action",
      content:
        "Si no queda:\n\n1. Compartir con Héctor - grupo de Gmail - retención\n2. Redactar detalle del problema y mandar link de HubSpot\n3. Esperar confirmación del pago para generar PQR\n4. Si Héctor no está, estar pendiente del ticket",
      nextStep: "step-guia-practica",
      warning: "No cerrar el caso hasta confirmar resolución",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-guia-practica",
      title: "Crear Guía Práctica",
      description: "Documentar el adelanto de pago",
      type: "action",
      content:
        "Guía práctica - Por motivo envío de medicamento:\n\n1. Solicitud de asistencia PX\n2. Se crea guía práctica\n3. Aparece la guía del lado derecho\n4. Nueva solicitud - PQR Escalado\n5. *Escalamiento a PQR* - Guía de tipificación\n6. Grupo de Supplies - Se comparte link del PQR realizado, se describe el detalle del motivo del caso gestionado\n7. Dejar nota en perfil de todo lo sucedido por motivo envío de medicamento\n\nTipificación:\n• L1 - Gestión Financiera y de Cuenta\n• L2 - Solicitud o Gestión de Pago\n• L3 - Adelantar Pago",
      estimatedTime: "5 minutos",
    },
  ],
  "proc-payment-error": [
    {
      id: "step-1",
      title: "Revisión 360",
      description: "Verificar estado del paciente",
      type: "action",
      content: "REVISIÓN 360 - Verificar que no tenga Payment Error.\n\nBuscar factura con deuda en Chargebee.",
      nextStep: "step-2",
      tip: "Esta revisión se hace entre 12 am y 1 pm",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Cobrar la Deuda",
      description: "Proceso de cobro",
      type: "action",
      content:
        "1. Solicitar autorización con el paciente\n2. Confirmar últimos dígitos de la tarjeta\n3. Hacer cobro en Chargebee\n4. Mandar confirmación de pago",
      nextStep: "step-3",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-3",
      title: "Verificar Resultado",
      description: "Confirmar si el cobro fue exitoso",
      type: "question",
      content: "¿El cobro fue exitoso?",
      options: [
        {
          id: "cobro-exitoso",
          label: "Sí, cobro exitoso",
          nextStep: "step-fin",
        },
        {
          id: "cobro-fallido",
          label: "No, rechazo por banco o fondos insuficientes",
          nextStep: "step-error",
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-error",
      title: "Gestionar Error de Cobro",
      description: "Opciones cuando falla el cobro",
      type: "action",
      content:
        "Errores comunes:\n• Rechazo por el banco\n• Fondos insuficientes\n\nSOLO a solicitud del cliente se le puede intentar cobrar.\n\nSi Px ya no quiere nada, documentar y cerrar.",
      nextStep: "step-cambio-tarjeta",
      warning: "No insistir si el paciente no desea continuar",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-cambio-tarjeta",
      title: "Cambio de Tarjeta",
      description: "Proceso desde HubSpot",
      type: "action",
      content:
        'Cambio de Tarjeta desde HubSpot:\n\n1. Ir a Admin\n2. Bot Acción - "Migrate to Chargebee"\n3. Le llega el link al paciente\n4. El paciente hace el registro de su tarjeta\n5. Intentar cobro nuevamente',
      estimatedTime: "5 minutos",
    },
    {
      id: "step-fin",
      title: "Cobro Exitoso",
      description: "Proceso completado",
      type: "info",
      content: "Cobro realizado exitosamente. Enviar confirmación al paciente y documentar en el sistema.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-upgrade": [
    {
      id: "step-1",
      title: "Solicitud de Aumento de Dosis",
      description: "Paciente pide upgrade",
      type: "action",
      content:
        "Cuando el paciente pide aumento de dosis:\n\n1. Visualizar en Admin qué dosis tiene actualmente\n2. Indicar que un aumento de dosis es un aumento de costos dependiendo en qué dosis se encuentre\n\n⚠️ NO SE PUEDEN DAR COSTOS directamente",
      nextStep: "step-2",
      warning: "Nunca dar costos sin validación del especialista",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Validar con Especialista",
      description: "Coordinar con área médica",
      type: "action",
      content:
        "1. Primero necesitamos validar con especialista para que valide un aumento\n2. Upgrades team se comunica para brindar información completa sobre aumento de dosis\n3. Hacer task a Salud en Admin (Evolución Tórpida - cuando no ve progreso)\n4. Subir dosis / el paciente quiere ver si ya es momento de subir su dosis\n5. Detallar la solicitud del paciente para su aumento de dosis",
      nextStep: "step-3",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-3",
      title: "Comunicar al Paciente",
      description: "Informar siguiente paso",
      type: "action",
      content:
        "Decirle al paciente que ya se solicitó con su especialista para que se contacten con él para hacer su valoración.\n\nPreguntar si acepta que lo contacten.\n\nSe cierra el ticket y dejamos nota.",
      nextStep: "step-4",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-4",
      title: "Verificar Negocio Existente",
      description: "Si el especialista ya indicó aumento",
      type: "question",
      content:
        "Si el especialista le dijo que iba a tener un aumento, revisar Negocios de HubSpot.\n\n¿Existe un negocio para este paciente?",
      options: [
        {
          id: "negocio-existe",
          label: "Sí, existe negocio",
          nextStep: "step-verificar-etapa",
        },
        {
          id: "no-negocio",
          label: "No hay negocio",
          nextStep: "step-crear-task",
        },
      ],
      estimatedTime: "2 minutos",
    },
    {
      id: "step-verificar-etapa",
      title: "Verificar Etapa del Negocio",
      description: "Revisar estado en HubSpot",
      type: "question",
      content: "¿En qué etapa está el negocio?",
      options: [
        {
          id: "etapa-seguimiento",
          label: "Ready, Follow up, Waiting decision, Payment link sent",
          nextStep: "step-en-proceso",
        },
        {
          id: "etapa-won",
          label: "Plan change WON",
          nextStep: "step-verificar-envio",
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-en-proceso",
      title: "Upgrade en Proceso",
      description: "Informar al paciente",
      type: "action",
      content:
        "Decir al paciente que el aumento ya se encuentra en seguimiento y hemos intentado contactarlo para darle la info pero seguimos sin éxito.\n\nEn el chat de Gmail, se etiqueta a Edith Silva para que le marque.",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-verificar-envio",
      title: "Verificar Órdenes de Envío",
      description: "Revisar en Admin",
      type: "action",
      content:
        'Revisar en Admin del paciente las órdenes de envío.\n\n¿Está registrada la orden de envío del nuevo medicamento?\n\n• Si NO está: Compartir en Supplies, notificando fecha de upgrade. "¿Me ayudan a enviar medicamento por favor?"\n• Si SÍ está: Seguir el proceso de envío de medicamento',
      estimatedTime: "3 minutos",
    },
    {
      id: "step-crear-task",
      title: "Crear Task para Upgrade",
      description: "No hay negocio existente",
      type: "action",
      content:
        "Si no hay negocio, revisar en Admin del paciente 2 cosas:\n\n1. Revisar en archivos la última receta (prescription)\n2. Tenemos que tener medicamento por un medicamento más alto\n3. Si ya hay receta, hacer una task a PX - Cambio de plan de paciente - Cambio de tratamiento\n4. Se detalla que hay una solicitud de aumento pero no hay negocio, para que le manden información\n\n⚠️ SALUD NO SE ESCALA POR PQR",
      warning: "Nunca escalar temas de Salud por PQR",
      estimatedTime: "5 minutos",
    },
  ],
  "proc-flujo-px-sin-cita": [
    {
      id: "step-1",
      title: "Revisar Citas Agendadas",
      description: "Verificar citas en Admin",
      type: "action",
      content: "Revisar citas agendadas en el Admin del paciente.",
      nextStep: "step-2",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-2",
      title: "Revisar Plan y Laboratorios",
      description: "Identificar tipo de plan del paciente",
      type: "action",
      content: "Revisar qué tipo de Plan tiene el paciente y los laboratorios agendados.",
      nextStep: "step-3",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-3",
      title: "Explicar Proceso de Citas",
      description: "Informar al paciente sobre el proceso",
      type: "question",
      content: "Explicar al paciente el proceso de las citas. ¿El paciente quiere agendar cita por primera vez?",
      options: [
        {
          id: "agendar-cita",
          label: "Sí, quiere agendar cita por Primera Vez",
          nextStep: "step-agendar",
          action: "Seguir proceso de agendamiento de citas",
        },
        {
          id: "paciente-molesto",
          label: "Paciente renuente o muy molesto",
          nextStep: "step-escalar",
        },
      ],
      estimatedTime: "2 minutos",
    },
    {
      id: "step-agendar",
      title: "Ajustar Fechas de Cobro/Envío",
      description: "Sincronizar tratamiento",
      type: "action",
      content:
        "Explicar la nueva sincronización del tratamiento y ajustar las siguientes fechas de cobro y de envío, asegurando que el ciclo sea de aproximadamente cada 28 días.\n\nEscalar con Team Leader si es necesario.",
      tip: "El ciclo debe ser de aproximadamente 28 días",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-escalar",
      title: "Escalar a Adherencia",
      description: "Transferir paciente molesto",
      type: "action",
      content:
        "Si el paciente está muy renuente o muy molesto:\n\n1. Mencionar al cliente que el equipo se estaría contactando con él por llamada\n2. Revisar quién tiene el ticket asignado\n3. Mandar a Adherencia (Equipo Inbound - Gmail)",
      warning: "Asegurar que el ticket quede correctamente asignado antes de transferir",
      estimatedTime: "2 minutos",
    },
  ],
  "proc-agendamiento-citas": [
    {
      id: "step-1",
      title: "Identificar Tipo de Cita",
      description: "Primera vez o subsecuente",
      type: "question",
      content: "¿Qué tipo de cita necesita el paciente?",
      options: [
        {
          id: "primera-vez",
          label: "Cita Primera Vez (45 minutos)",
          nextStep: "step-2",
        },
        {
          id: "subsecuente",
          label: "Cita Subsecuente (30 minutos)",
          nextStep: "step-2",
        },
      ],
      tip: "Cita Primera Vez requiere 45 minutos FORZOSAMENTE. Cita Subsecuente requiere 30 minutos.",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-2",
      title: "Identificar Tipo de Paciente",
      description: "Simple o Complejo",
      type: "question",
      content: "¿El paciente es Simple o Complejo?",
      options: [
        {
          id: "simple",
          label: "Paciente Simple",
          nextStep: "step-medicina-general",
        },
        {
          id: "complejo",
          label: "Paciente Complejo",
          nextStep: "step-especialista",
        },
        {
          id: "diabetes",
          label: "Diabetes",
          nextStep: "step-endocrinologo",
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-medicina-general",
      title: "Agendar con Medicina General",
      description: "Para pacientes simples",
      type: "action",
      content: "Agendar con Medicina General:\n\n• Diana\n• Gabrielle\n• Ma. Fernanda",
      tip: "Un paciente Simple puede agendarse con un médico Complejo para llenar huecos o adelantar cita",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-especialista",
      title: "Agendar con Médico Especialista",
      description: "Para pacientes complejos",
      type: "action",
      content: "Agendar con Médicos Especialistas disponibles según la especialidad requerida.",
      warning: "Un paciente Complejo NUNCA debe ir con un médico Simple",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-endocrinologo",
      title: "Agendar con Endocrinólogo",
      description: "Para pacientes con Diabetes",
      type: "action",
      content:
        "Agendar con Endocrinólogos del grupo específico:\n\n• Carmona\n• Pricila\n• Darielle\n• Maripaz\n• Mariela",
      warning: "Pacientes con Diabetes SIEMPRE deben ir con Endocrinólogos",
      estimatedTime: "2 minutos",
    },
  ],
}

// Nombres de categorías para mostrar
export const categoryNames: Record<string, string> = {
  cancelacion: "Cancelación",
  medicamento: "Envío de Medicamento",
  pagos: "Gestión de Pagos",
  envios: "Envíos y Entregas",
  compras: "Compra de Medicamento",
  upgrade: "Upgrade",
  citas: "Citas y Seguimiento",
}

// Procesos recientes (simulados)
export const recentProcesses = [
  {
    id: "proc-cancelacion",
    title: "Cancelación de Paciente",
    category: "Cancelación",
    lastUsed: "Hace 2 horas",
    usage: 15,
    avgTime: "12 min",
    status: "frequent",
  },
  {
    id: "proc-envio-medicamento",
    title: "Envío de Medicamento",
    category: "Medicamento",
    lastUsed: "Hace 4 horas",
    usage: 28,
    avgTime: "6 min",
    status: "frequent",
  },
  {
    id: "proc-adelanto-pago",
    title: "Adelanto de Pago",
    category: "Pagos",
    lastUsed: "Ayer",
    usage: 12,
    avgTime: "10 min",
    status: "normal",
  },
  {
    id: "proc-payment-error",
    title: "Payment Error",
    category: "Pagos",
    lastUsed: "Hace 2 días",
    usage: 8,
    avgTime: "8 min",
    status: "normal",
  },
  {
    id: "proc-upgrade",
    title: "Upgrade de Dosis",
    category: "Upgrade",
    lastUsed: "Hace 3 días",
    usage: 19,
    avgTime: "7 min",
    status: "frequent",
  },
]

export const PROCESS_CATEGORIES = processCategories
export const CLIVI_PROCESSES = processList
