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
    processes: 1,
    avgTime: "3-5 min",
    href: "/processes/envios",
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
      steps: 18,
      avgTime: "15-20 min",
      difficulty: "Difícil",
      usage: 89,
      lastUpdated: "Hoy",
    },
  ],
  medicamento: [
    {
      id: "proc-envio-medicamento",
      title: "Envío de Medicamento",
      description: "Proceso para gestionar envíos de medicamento",
      category: "medicamento",
      steps: 4,
      avgTime: "5-8 min",
      difficulty: "Medio",
      usage: 156,
      lastUpdated: "Hoy",
    },
  ],
  pagos: [
    {
      id: "proc-cambio-fecha-pago",
      title: "Cambio Fecha de Pago",
      description: "Modificar la fecha de cobro del paciente",
      category: "pagos",
      steps: 7,
      avgTime: "8-12 min",
      difficulty: "Medio",
      usage: 134,
      lastUpdated: "Hoy",
    },
    {
      id: "proc-adelanto-pago",
      title: "Adelanto de Pago",
      description: "Adelantar pago por envío de medicamento",
      category: "pagos",
      steps: 12,
      avgTime: "10-15 min",
      difficulty: "Medio",
      usage: 98,
      lastUpdated: "Hoy",
    },
    {
      id: "proc-payment-error",
      title: "Payment Error",
      description: "Gestión de errores de pago y facturas con deuda",
      category: "pagos",
      steps: 6,
      avgTime: "6-10 min",
      difficulty: "Medio",
      usage: 112,
      lastUpdated: "Hoy",
    },
  ],
  envios: [
    {
      id: "proc-error-direccion",
      title: "Error en Dirección de Entrega",
      description: "Corrección de dirección de envío",
      category: "envios",
      steps: 10,
      avgTime: "8-12 min",
      difficulty: "Medio",
      usage: 78,
      lastUpdated: "Hoy",
    },
  ],
  citas: [
    {
      id: "proc-flujo-px-sin-cita",
      title: "Flujo PX sin Cita (Segundo Pago Próximo)",
      description: "Proceso para pacientes sin cita con segundo pago próximo",
      category: "citas",
      steps: 14,
      avgTime: "10-15 min",
      difficulty: "Difícil",
      usage: 87,
      lastUpdated: "Hoy",
    },
    {
      id: "proc-agendamiento-citas",
      title: "Agendamiento de Citas",
      description: "Proceso para agendar citas primera vez y subsecuentes",
      category: "citas",
      steps: 3,
      avgTime: "5-8 min",
      difficulty: "Fácil",
      usage: 145,
      lastUpdated: "Hoy",
    },
  ],
}

// Pasos detallados de cada proceso
export const processSteps: Record<string, ProcessStep[]> = {
  "proc-cancelacion": [
    {
      id: "step-1",
      title: "¿El paciente se comunica para cancelar o para dar seguimiento a su cancelación?",
      description: "Identificar el motivo principal de la comunicación",
      type: "question",
      content: "Preguntar si el paciente está llamando para cancelar o para dar seguimiento a una cancelación previa.",
      options: [
        { id: "seguimiento", label: "Seguimiento", nextStep: "step-seguimiento" },
        { id: "cancelar", label: "Cancelar", nextStep: "step-cancelar" }
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-seguimiento",
      title: "Proceso de Seguimiento",
      description: "Gestionar seguimiento de cancelación",
      type: "action",
      content: "Paso 1: Validar que tenga un Churn para cancelación y quien lo tiene Asignado.\n\nPaso 2: Pedir al paciente un día para agendar y un rango de horario.\n\nPaso 3: Validar horarios disponibles con el paciente de acuerdo al calendario que visualizamos, confirmar horario con el paciente.\n\nPaso 4: Seleccionar el horario y llenar los campos de Nombre y Apellido con los datos del PX.\n\nPaso 5: En el campo de correo electrónico poner el correo del paciente registrado con Clivi.\n\nPaso 6: Mencionar al paciente el horario en el que le estarían marcando, confirmar que la información sea clara.\n\nPaso 7: Marcar como Resuelto",
      nextStep: "step-completado",
      tip: "Validar siempre que el churn esté asignado antes de agendar",
      estimatedTime: "5 minutos",
    },
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
        },
      ],
      estimatedTime: "2 minutos",
    },
    {
      id: "step-cambiar-especialista",
      title: "Cambiar de Especialista",
      description: "Cambio de especialista por conflicto",
      type: "action",
      content: "Buscar el seguimiento con algún otro especialista disponible → Seguir proceso de agendar cita\n\nPreguntar el motivo\n\nGenerar Task por 'Queja'\n\nSi corresponde cita subsecuente se genera cambio de especialista en Calendly como agendamiento de cita de primera vez (Long)",
      nextStep: "step-razon-ingreso",
      tip: "Generar Task por 'Queja' si corresponde",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-razon-ingreso",
      title: "Paso 2 - Preguntar Razón de ingreso",
      description: "Identificar el plan del paciente",
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
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-contencion",
      title: "Paso 3 - Contención",
      description: "Proceso de contención del paciente",
      type: "action",
      content: "Ser muy empáticos y defensores del paciente\n\nIdeas de retención:\n\n• Gestión de Especialista: Validar sus citas agendadas, por si es posible reagendar su cita → Seguir proceso de Agendamiento de cita\n\n• Cambio de especialista: Buscar el seguimiento con algún otro especialista disponible → Seguir proceso de agendar cita\n\n• Envío de insumos: Identificar si aplica envio de insumos → Seguir proceso de envío de medicamentos\n\n• Downgrade: Se realiza disminución de dosis, cuando las dosis son altas ejemplo (Wegovy 1.8 en adelante a baja de dosis de 1mg). O se elimina el medicamento. Seleccionar al especialista como 'Gestión de especialista a Balance' y creación de Task a Salud (Admin)",
      nextStep: "step-confirmar-cancelacion",
      tip: "Mostrar empatía genuina y buscar soluciones alternativas",
      estimatedTime: "3 minutos",
    },
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
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-no-cancelar",
      title: "NO - No quiere cancelar",
      description: "Paciente decide no cancelar",
      type: "action",
      content: "Hacer Ticket para dar un seguimiento y dejar nota\n\nSe marca como Resuelto",
      nextStep: "step-completado",
      estimatedTime: "2 minutos",
    },
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
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-proceso-baja",
      title: "Proceso de Baja Estándar",
      description: "Proceso estándar de baja",
      type: "action",
      content: "Cerrar como Resuelto\n\nSe realiza Guía Práctica de solicitud de baja\n\nSe redacta nota\n\nExplicar que se van a comunicar con él (Área de Churn - es baja), se escala por medio del Chat de Gmail al grupo 'Nivel 2: Retención Soporte (Asunto Money)' arrobanado a la persona que tiene el ticket asignado\n\nAbrir el calendario de retenciones. (https://docs.google.com/spreadsheets/d/1LeZxuQLkz15cAIixmoLCLGIkQNnV0GF1FKHHpg7-tG0/edit?usp=sharing) Seleccionar la persona que tiene asignado el Churn.",
      nextStep: "step-completado",
      estimatedTime: "4 minutos",
    },
    {
      id: "step-escalacion-urgente",
      title: "Escalación Urgente",
      description: "Paciente muy molesto - escalación inmediata",
      type: "action",
      content: "Se escala por medio del Chat de Gmail al grupo 'Nivel 2: Retención Soporte (Asunto Money)' Arrobanado a la persona que tiene el ticket asignado\n\nCompartir link del perfil de Hubspot y describir la situación.",
      nextStep: "step-completado",
      tip: "Escalar inmediatamente si el paciente está muy molesto",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-completado",
      title: "Proceso Completado",
      description: "Proceso de cancelación finalizado",
      type: "info",
      content: "El proceso de cancelación ha sido completado según el flujo correspondiente.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-envio-medicamento": [
    {
      id: "step-1",
      title: "¿Es Envío de Primera vez?",
      description: "Determinar si es el primer envío o uno subsecuente",
      type: "question",
      content: "Preguntar si es el primer envío de medicamento para el paciente.",
      options: [
        { id: "primera-vez", label: "SI - Es envio de primera vez", nextStep: "step-primera-vez" },
        { id: "subsecuente", label: "NO - Es envío subsecuente", nextStep: "step-subsecuente" }
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-primera-vez",
      title: "SI - Es envio de primera vez",
      description: "Proceso para envíos de primera vez",
      type: "action",
      content: "Paso 1 - Indicarle que tarda aproximadamente 2 días en hacerse el envío de medicamento después de su cita.\n\nPaso 2 - Validar en Admin, en el apartado de 'Feed', en la fila de 'Delivery' dar clic en la fila y revisar en 'Detalles de la orden' en la sección derecha de historial.\n\nPaso 3 - En el apartado de 'Historial' validar en la columna de 'Delivery Status' y 'Operator', en la segunda fila tiene que aparecer 'Order Validated' y el nombre de alguna persona.\n\nPaso 4- Si ya se encuentra validado. Compartir la liga de rastreo de la paquetería y mencionar con el paciente que tarda de 5 hasta 7 días hábiles. Si es día viernes se estaría enviando hasta el dia lunes (sábado y domingo no se realizan envios)\n\nADET - Paqueteria en CDMX\nDHL - Paqueteria\nRepartidora Local - 10 kilómetros a la redonda de la oficina\nEntrega en oficina CLIVI - Dirección en oficinas",
      nextStep: "step-completado",
      tip: "Validar siempre que el Order Validated esté presente antes de compartir tracking",
      estimatedTime: "4 minutos",
    },
    {
      id: "step-subsecuente",
      title: "NO - Es envío subsecuente",
      description: "Proceso para envíos subsecuentes",
      type: "action",
      content: "Paso 1- Revisar Chargebee\nValidar fechas de Pago\nValidar que el pago se encuentre en Status 'PAID'\n\nPaso 2 - Confirmar el envio de medicamento\nValidar en Admin la fila de 'Delivery' en la sección de 'Feed'\n\nPaso 3 - Compartir la liga de la rastreo de la paquetería y mencionar con el paciente que tarda de 5 hasta 7 días hábiles. Si es día viernes se estaría enviando hasta el dia lunes (sábado y domingo no se realizan envios)\n\nPaso 4 - Compartir la liga del perfil del PX al grupo de Chat de Gmail de Supplies mencionando que se solicita el envio de medicamento",
      nextStep: "step-completado",
      tip: "Siempre validar el status PAID en Chargebee antes de confirmar envío",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-completado",
      title: "Envío Confirmado",
      description: "Proceso de envío completado",
      type: "info",
      content: "El proceso de envío de medicamento ha sido completado. Se ha proporcionado información de rastreo al paciente.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-cambio-fecha-pago": [
    {
      id: "step-1",
      title: "Paso 1 - Revisar Chargebee",
      description: "Validar información del paciente en Chargebee",
      type: "action",
      content: "Validar cuáles son sus Fechas de pagos\n\nValidar que no tenga adeudo",
      nextStep: "step-validar-adeudo",
      tip: "Siempre revisar primero el status de pagos y adeudos",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-validar-adeudo",
      title: "¿El Px cuenta con un adeudo?",
      description: "Determinar si existe adeudo pendiente",
      type: "question",
      content: "Verificar si el paciente tiene algún adeudo pendiente de pago.",
      options: [
        {
          id: "si-adeudo",
          label: "SI - Si tiene un adeudo",
          nextStep: "step-procesar-adeudo"
        },
        {
          id: "no-adeudo",
          label: "NO - No tiene adeudo",
          nextStep: "step-validar-fecha"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-procesar-adeudo",
      title: "Procesar Adeudo",
      description: "Gestionar el cobro del adeudo existente",
      type: "action",
      content: "Mencionarle que tenemos que hacer el cobro del adeudo\n\nDirigirnos a Chargebee, buscar el adeudo\n\nSeleccionar el adeudo y en la parte superior derecha seleccionar 'Recoja Ahora'\n\nRealizar el cobro del adeudo",
      nextStep: "step-validar-fecha",
      tip: "Documentar el cobro del adeudo antes de continuar",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-validar-fecha",
      title: "Paso 2 - Validar nueva fecha de cobro",
      description: "Confirmar nueva fecha de pago con paciente",
      type: "action",
      content: "Confirmar con el paciente cuál es su nueva fecha de pago",
      nextStep: "step-crear-guia",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-crear-guia",
      title: "Paso 3- Creación de guia práctica",
      description: "Generar guía práctica de solicitud",
      type: "action",
      content: "Creación de guía práctica 'Solicitud de cambio de fecha de pago'",
      nextStep: "step-validar-escalacion",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-validar-escalacion",
      title: "Paso 4- Validar escalación",
      description: "Evaluar necesidad de escalación",
      type: "action",
      content: "Confirmar con el paciente la solicitud de cambio de fecha de pago\n\nSi el paciente se encuentra molesto o es algo muy urgente, se informa por el Chat de Gmail 'Nivel 2: Retención Soporte (Asunto Money)'",
      nextStep: "step-completado",
      tip: "Escalar solo si el paciente está molesto o es urgente",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-completado",
      title: "Proceso Completado",
      description: "Cambio de fecha de pago finalizado",
      type: "info",
      content: "El proceso de cambio de fecha de pago ha sido completado exitosamente.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-adelanto-pago": [
    {
      id: "step-1",
      title: "Se pueden adelantar 1 pago",
      description: "Informar límite de adelantos",
      type: "info",
      content: "Se pueden adelantar 1 pago",
      nextStep: "step-indagar-motivo",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-indagar-motivo",
      title: "Paso 1- Indagar porque se está adelantando pago",
      description: "Identificar el motivo del adelanto",
      type: "action",
      content: "Indagar porque se está adelantando pago",
      nextStep: "step-revisar-chargebee",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-revisar-chargebee",
      title: "Paso 2- Revisar ChargeBee",
      description: "Validar información en Chargebee",
      type: "action",
      content: "Validar Fechas de Pago\n\nMencionar al PX que se estaría realizando el adelanto en su fecha de pago.",
      nextStep: "step-crear-guia",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-crear-guia",
      title: "Paso 3 - Creación de Guía Práctica",
      description: "Generar guía de adelanto",
      type: "action",
      content: "Crear guía práctica 'Adelantar Pago'\n\nSolo se puede adelantar 1 Pago",
      nextStep: "step-validar-pago",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-validar-pago",
      title: "Paso 4 - Validar que el pago sea exitoso",
      description: "Verificar resultado del pago",
      type: "action",
      content: "Esperar unos minutos y en Hubspot debe aparecer un resumen de pago, ya sea exitoso o fallido.",
      nextStep: "step-pago-exitoso",
      tip: "Esperar al menos 2-3 minutos para ver el resultado en Hubspot",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-pago-exitoso",
      title: "¿El pago fue exitoso?",
      description: "Determinar resultado del pago",
      type: "question",
      content: "Verificar si el adelanto de pago se procesó correctamente.",
      options: [
        {
          id: "si-exitoso",
          label: "SI - Si fue exitoso",
          nextStep: "step-confirmar-exitoso"
        },
        {
          id: "no-exitoso",
          label: "NO - No fue exitoso",
          nextStep: "step-validar-error"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-confirmar-exitoso",
      title: "SI - Si fue exitoso",
      description: "Confirmar pago exitoso",
      type: "action",
      content: "Confirmar con el PX que el adelanto de su pago fue exitoso\n\nAccionar el motivo por el cual solicitó el adelanto de pago",
      nextStep: "step-completado",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-validar-error",
      title: "NO - No fue exitoso",
      description: "Gestionar pago fallido",
      type: "action",
      content: "Validar en Chargebee el porqué no fue exitoso\n\nPreguntar si hay algún problema con la tarjeta\n\nVerificar que esté encendida y que cuente con fondos suficientes\n\nSi todo ok volver a intentar (máximo 3)\n\nSolo podemos hacer 3 intentos de cargo para evitar bloquear la tarjeta",
      nextStep: "step-cambiar-tarjeta",
      tip: "Documentar cada intento de pago fallido",
      estimatedTime: "4 minutos",
    },
    {
      id: "step-cambiar-tarjeta",
      title: "¿El PX solicitó cambiar su tarjeta de método de pago?",
      description: "Determinar si necesita cambiar método de pago",
      type: "question",
      content: "Preguntar si el paciente desea cambiar su método de pago.",
      options: [
        {
          id: "si-cambiar",
          label: "SI - Solicita cambiar su método de pago",
          nextStep: "step-proceso-cambio"
        },
        {
          id: "no-cambiar",
          label: "NO - No solicita método de Pago",
          nextStep: "step-escalar-intentos"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-proceso-cambio",
      title: "SI - Solicita cambiar su método de pago",
      description: "Proceso de cambio de método de pago",
      type: "action",
      content: "Brindar la opción de un link de pago\n\nIr al Chargbee\n\nDarle click en el ojito\n\nDar click en actualizar método de pago\n\nEl paciente llena los campos\n\nValidar en Chargbee la actualización (Transacciones)\n\nConfirmar\n\nHacer un nuevo intento de adelanto de pago, dando refresh",
      nextStep: "step-completado",
      estimatedTime: "5 minutos",
    },
    {
      id: "step-escalar-intentos",
      title: "NO - No solicita método de Pago",
      description: "Escalar por intentos fallidos",
      type: "action",
      content: "Si después de los intentos no se pudo realizar el pago escalar por medio de Chat\n\nCompartir la liga del perfil del PX al grupo de Chat de Gmail 'Nivel 2: Retención Soporte (Asunto Money)', mencionando que se solicita el adelanto de pago, arrobar a Hector Sanchez",
      nextStep: "step-completado",
      tip: "Escalar después de 3 intentos fallidos",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-completado",
      title: "Adelanto Completado",
      description: "Proceso de adelanto de pago finalizado",
      type: "info",
      content: "El proceso de adelanto de pago ha sido completado exitosamente.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-payment-error": [
    {
      id: "step-1",
      title: "Identificar Error de Pago",
      description: "Determinar el tipo de error de pago",
      type: "question",
      content: "Preguntar al paciente sobre el error específico que está experimentando.",
      options: [
        {
          id: "tarjeta-rechazada",
          label: "Tarjeta rechazada",
          nextStep: "step-validar-tarjeta",
        },
        {
          id: "fondos-insuficientes",
          label: "Fondos insuficientes",
          nextStep: "step-ofrecer-planes",
        },
        {
          id: "factura-con-deuda",
          label: "Factura con deuda",
          nextStep: "step-gestionar-deuda",
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-validar-tarjeta",
      title: "Validar Información de Tarjeta",
      description: "Verificar los datos de la tarjeta",
      type: "action",
      content: "Paso 1: Solicitar al paciente los datos de la tarjeta\n\nPaso 2: Verificar número, fecha de vencimiento y CVV\n\nPaso 3: Confirmar nombre del titular\n\nPaso 4: Validar que la tarjeta permita cargos internacionales",
      nextStep: "step-actualizar-tarjeta",
      tip: "Nunca almacenar datos de tarjetas en notas o chats",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-actualizar-tarjeta",
      title: "Actualizar Tarjeta en Chargebee",
      description: "Actualizar la información de pago",
      type: "action",
      content: "Paso 1: Entrar a Chargebee\n\nPaso 2: Buscar al paciente\n\nPaso 3: Dar clic en 'Payment Source'\n\nPaso 4: Actualizar la información de la tarjeta\n\nPaso 5: Guardar cambios",
      nextStep: "step-probar-pago",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-probar-pago",
      title: "Procesar Pago de Prueba",
      description: "Intentar procesar el pago",
      type: "action",
      content: "Paso 1: Intentar procesar el pago pendiente\n\nPaso 2: Verificar si el pago es exitoso\n\nPaso 3: Si falla, identificar el motivo específico",
      nextStep: "step-evaluar-resultado",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-ofrecer-planes",
      title: "Ofrecer Planes de Pago",
      description: "Presentar alternativas de pago",
      type: "action",
      content: "Paso 1: Explicar opciones de planes de pago\n\nPaso 2: Ofrecer fraccionamiento de deuda\n\nPaso 3: Presentar opciones de downgrade si aplica\n\nPaso 4: Acordar plan de pago con paciente",
      nextStep: "step-implementar-plan",
      tip: "Ser empático y flexible con las opciones de pago",
      estimatedTime: "4 minutos",
    },
    {
      id: "step-gestionar-deuda",
      title: "Gestionar Factura con Deuda",
      description: "Manejar facturas pendientes de pago",
      type: "action",
      content: "Paso 1: Identificar monto total de la deuda\n\nPaso 2: Revisar antigüedad de la factura\n\nPaso 3: Evaluar opciones de regularización\n\nPaso 4: Coordinar con equipo de cobranza si es necesario",
      nextStep: "step-regularizar-deuda",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-implementar-plan",
      title: "Implementar Plan de Pago",
      description: "Configurar el plan acordado",
      type: "action",
      content: "Paso 1: Configurar el plan de pago en Chargebee\n\nPaso 2: Establecer fechas y montos\n\nPaso 3: Confirmar configuración con paciente\n\nPaso 4: Enviar confirmación por correo",
      nextStep: "step-completado",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-regularizar-deuda",
      title: "Regularizar Deuda",
      description: "Procesar el pago de la deuda",
      type: "action",
      content: "Paso 1: Procesar pago de deuda total o parcial\n\nPaso 2: Actualizar estado de factura\n\nPaso 3: Confirmar regularización con paciente\n\nPaso 4: Programar próximos pagos si aplica",
      nextStep: "step-completado",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-evaluar-resultado",
      title: "Evaluar Resultado del Pago",
      description: "Verificar el estado final del pago",
      type: "action",
      content: "Paso 1: Verificar si el pago fue exitoso\n\nPaso 2: Si falló, ofrecer alternativas\n\nPaso 3: Documentar el resultado\n\nPaso 4: Escalar si es necesario",
      nextStep: "step-completado",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-completado",
      title: "Error de Pago Resuelto",
      description: "Proceso de error de pago finalizado",
      type: "info",
      content: "El proceso de gestión de error de pago ha sido completado. Se han tomado las acciones necesarias para resolver la situación.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-error-direccion": [
    {
      id: "step-1",
      title: "Paso 1 - Sondear por qué necesita cambiar la dirección",
      description: "Identificar el motivo del cambio de dirección",
      type: "action",
      content: "Sondear por qué necesita cambiar la dirección",
      nextStep: "step-revisar-admin",
      estimatedTime: "1 minuto",
    },
    {
      id: "step-revisar-admin",
      title: "Paso 2 - Revisar dirección registrada en Admin",
      description: "Verificar dirección actual en el sistema",
      type: "action",
      content: "Validar en Admin la sección de 'Perfil' en la sección de 'Home'",
      nextStep: "step-revisar-rastreo",
      tip: "Siempre validar la dirección registrada antes de hacer cambios",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-revisar-rastreo",
      title: "Paso 3 - Revisar dirección de la guia de rastreo",
      description: "Verificar dirección en envíos en proceso",
      type: "action",
      content: "Revisar dirección de la guia de rastreo (Si tiene algún envío en proceso)",
      nextStep: "step-intentar-llamada",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-intentar-llamada",
      title: "Paso 4 - Marcarle al paciente para que nos confirme la dirección",
      description: "Contactar al paciente para confirmar dirección",
      type: "action",
      content: "Marcarle al paciente para que nos confirme la dirección de entrega (3 intentos de llamada en intervalos de 5 min)",
      nextStep: "step-contesto-llamada",
      tip: "Documentar cada intento de llamada",
      estimatedTime: "5 minutos",
    },
    {
      id: "step-contesto-llamada",
      title: "¿El paciente contestó a los 3 intentos de llamada?",
      description: "Determinar si se logró contacto con el paciente",
      type: "question",
      content: "Verificar si el paciente respondió a las llamadas.",
      options: [
        {
          id: "si-contesto",
          label: "SI - Contestó por medio de llamada",
          nextStep: "step-validar-direccion"
        },
        {
          id: "no-contesto",
          label: "No - No Contestó por medio de llamada",
          nextStep: "step-mensaje-contacto"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-validar-direccion",
      title: "Paso 1 - Validar dirección de entrega",
      description: "Confirmar y validar nueva dirección",
      type: "action",
      content: "Confirmar con el PX la nueva dirección y comentarle que tenemos que validar la cobertura para el envío\n\nDirección Script:\n\nCalle\nNo. Exterior\nNo. Interior\nColonia\nMunicipio/Delegación\nCiudad/Estado\nCódigo Postal\nReferencias\n\nIngresar a https://lookerstudio.google.com/reporting/17ac3aa7-1026-4e38-8656-646f5b3e2d08/page/WbZUF?s=lMJU-PJkPnw y validar el CP que el paciente nos brindó.\n\nEn color verde muestra si 'Si aplica' y podemos modificar la dirección\n\nEn color rojo muestra si 'No aplica' por lo que no cuenta con cobertura y tendremos que solicitar una nueva dirección de envío y hacer el mismo proceso de validación de cobertura.",
      nextStep: "step-realizar-cambio",
      tip: "Validar siempre la cobertura antes de hacer el cambio",
      estimatedTime: "4 minutos",
    },
    {
      id: "step-realizar-cambio",
      title: "Paso 2- Realizar cambio de dirección",
      description: "Ejecutar el cambio de dirección en el sistema",
      type: "action",
      content: "Ir a Admin en la sección de 'Perfil' en el apartado de 'Dirección' donde dice 'Tipo de dirección - HOME'\n\nValidar con el paciente si este cambio de dirección sería por única ocasión, si es por única ocasión seleccionar 'OTHER' y modificar dirección.\n\nSi esta fuese su nueva dirección, es decir, la principal, seleccionar el apartado de 'HOME' y cambiar la dirección registrada.\n\nIngresar la nueva dirección anteriormente confirmada por el paciente y validada por la cobertura",
      nextStep: "step-crear-guia",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-crear-guia",
      title: "Paso 3 - Creación de Guía Práctica",
      description: "Generar guía práctica y notificar a supplies",
      type: "action",
      content: "Crear una Guía Práctica 'Solicitud a PX'\n\nCompartir la liga del perfil del PX al grupo de Chat de Gmail de Supplies mencionando que se solicita el envio de medicamento",
      nextStep: "step-completado",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-mensaje-contacto",
      title: "No - No Contestó por medio de llamada",
      description: "Proceso cuando no se logra contacto",
      type: "action",
      content: "Paso 1 - Mandar mensaje por medios de contacto\n\nCerrar interacción en Hubspot como Resuelto\n\nDejar nota de seguimiento de contacto\n\nMandar mensaje por Admin y brindar el numero de contacto de soporte\n\nEl medicamento seguirá en proceso de envío.",
      nextStep: "step-completado",
      tip: "Documentar claramente los intentos de contacto realizados",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-completado",
      title: "Proceso Completado",
      description: "Proceso de corrección de dirección finalizado",
      type: "info",
      content: "El proceso de corrección de dirección ha sido completado. Se ha actualizado la información y coordinado el reenvío si era necesario.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-flujo-px-sin-cita": [
    {
      id: "step-1",
      title: "¿El PX es de primera vez?",
      description: "Determinar si es paciente nuevo o existente",
      type: "question",
      content: "Preguntar si el paciente es de primera vez.",
      options: [
        {
          id: "si-primera-vez",
          label: "SI - Si es primera vez",
          nextStep: "step-primera-vez"
        },
        {
          id: "no-primera-vez",
          label: "NO - No es de primera vez",
          nextStep: "step-no-primera-vez"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-primera-vez",
      title: "SI - Si es primera vez",
      description: "Proceso para pacientes de primera vez",
      type: "action",
      content: "Paso 1 - Validar por que no se pudo tomar la primera cita\n\nPaso 2 - Validar resultados de laboratorio en Admin (Etiqueta LABS) visible en el apartado de Feed\n\nPaso 2.2 - Si no se encuentran los resultados de laboratorio, mencionar que tiene que acudir a realizar los laboratorios (Tienen vigencia de 1 mes internamente a partir de la creación de la orden)\n\nPaso 2.3 - Si ya excedió el tiempo, generar una nueva orden de laboratorio.\n\nPaso 3 - Si se encuentran los resultados de laboratorios, realizar agendamiento de cita de acuerdo al plan.\n\nPlan Limited - Citas únicamente de Alta Especialidad (Zero) Endocrinología (Diabetes)\n\n- Plan Complejo\n(Plan Zero) Alta Especialidad (Obesity Team)\n\n- Plan Simple\n- (Plan Zero) Alta Especialidad (Obesity Team, Genmad)\n\n******\n\nAdaptable - Cita de primera vez (Long) en el 6to mes, cita subsecuente (Short)\n\n- (Plan Zero)Alta Especialidad, Nutrición y Psicología (Medicina del deporte, indicada únicamente por Alta Especialidad)\n\n- (Plan Diabetes) Medicina General, Endocrinología, Nutrición y Psicología (Medicina del deporte indicada únicamente por Endocrinología)\n\nPlan Complejo\n- (Plan Zero) Alta Especialidad (Obesity Team), Nutrición y Psicología (Medicina del deporte, indicada únicamente por Alta Especialidad)\n- (Plan Diabetes) Medicina General, Endocrinología, Nutrición y Psicología (Medicina del deporte indicada únicamente por Endocrinología)\n\nPlan Simple\n- (Plan Zero) Alta Especialidad (Obesity Team, Genmad), Nutrición y Psicología (Medicina del deporte, indicada únicamente por Alta Especialidad)\n- (Plan Diabetes) Medicina General, Endocrinología (Diabetes Team), Nutrición y Psicología (Medicina del deporte indicada únicamente por Endocrinología)\n\nPaso 4- Seguir proceso de Agendamiento de Citas (Psicologia es la única que se agenda como 'Long')",
      nextStep: "step-agendar-cita",
      tip: "Validar siempre los resultados de laboratorio antes de agendar",
      estimatedTime: "6 minutos",
    },
    {
      id: "step-no-primera-vez",
      title: "NO - No es de primera vez",
      description: "Proceso para pacientes existentes",
      type: "action",
      content: "Paso 1 - Validar el porqué está solicitando la cita\n\nPaso 2 - Validar si tiene alguna cita próxima agendada en Admin\n\nPaso 3 - Validar si el motivo de solicitud de cita aplica",
      nextStep: "step-motivo-salud",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-motivo-salud",
      title: "¿La solicitud de cita tiene que ver con alguna cuestión de salud?",
      description: "Determinar si es un tema de salud",
      type: "question",
      content: "Evaluar si el motivo de la cita es relacionado con salud.",
      options: [
        {
          id: "si-salud",
          label: "SI - Evolución Tórpida, Efectos secundarios, etc",
          nextStep: "step-generar-task"
        },
        {
          id: "no-salud",
          label: "NO - No es un tema de salud",
          nextStep: "step-explicar-motivos"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-generar-task",
      title: "SI - Evolución Tórpida, Efectos secundarios, etc",
      description: "Generar task a salud",
      type: "action",
      content: "Paso 1 - Generar Task a salud",
      nextStep: "step-completado",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-explicar-motivos",
      title: "NO - No es un tema de salud",
      description: "Explicar por qué no se puede agendar",
      type: "action",
      content: "Paso 1- Mencionar por qué no se puede agendar la cita\n\nPaso 2- Explicar los motivos\n\nPaso 3- Validar que contiene su plan\n\nPlan Limited - Citas únicamente de Alta Especialidad (Zero) Endocrinología (Diabetes) / Nutrición y Psicología indicadas si el especialista de ambas especialidades lo considera\n\n- Plan Complejo\n(Plan Zero) Alta Especialidad (Obesity Team) / Plan Mensual o Adaptable\n\n- Plan Simple\n- (Plan Zero) Alta Especialidad (Obesity Team, Genmad) / Plan Mensual o Adaptable\n\n******\n\nPlan Adaptable - Cita de primera vez (Long) en el 6to mes, cita subsecuente (Short)\n\n- (Plan Zero)Alta Especialidad, Nutrición y Psicología (Medicina del deporte, indicada únicamente por Alta Especialidad)\n\n- (Plan Diabetes) Medicina General, Endocrinología, Nutrición y Psicología (Medicina del deporte indicada únicamente por Endocrinología)\n\n1- Plan Complejo - Si es cita Subsecuente (Short)\n- (Plan Zero) Alta Especialidad (Obesity Team), Nutrición y Psicología (Medicina del deporte, indicada únicamente por Alta Especialidad)\n- (Plan Diabetes) Medicina General, Endocrinología, Nutrición y Psicología (Medicina del deporte indicada únicamente por Endocrinología)\n\n2- Plan Simple - Si es cita Subsecuente (Short)\n- (Plan Zero) Alta Especialidad (Obesity Team, Genmad), Nutrición y Psicología (Medicina del deporte, indicada únicamente por Alta Especialidad)\n- (Plan Diabetes) Medicina General, Endocrinología (Diabetes Team), Nutrición y Psicología (Medicina del deporte indicada únicamente por Endocrinología)\n\nPaso 4- Si se le puede ofrecer alguna cita al paciente que entre dentro de su plan, seguir el proceso de 'Agendamiento de Citas' pero agendarla en 'Short' porque es una cita subsecuente (Psicología es la única que se agenda como 'Long')\n\nNO- Si el paciente está muy renuente o muy molesto, mencionar al paciente que el equipo se estaría contactando con el por llamada, revisamos quien tiene el ticket asignado y se manda a Adherencia (Equipo Inbound - Gmail)",
      nextStep: "step-ofrecer-cita",
      estimatedTime: "4 minutos",
    },
    {
      id: "step-ofrecer-cita",
      title: "¿Se le puede ofrecer cita dentro del plan?",
      description: "Determinar si se puede agendar cita",
      type: "question",
      content: "Evaluar si se puede ofrecer una cita que esté dentro del plan del paciente.",
      options: [
        {
          id: "si-ofrecer",
          label: "SI - Se puede ofrecer cita",
          nextStep: "step-agendar-short"
        },
        {
          id: "no-ofrecer",
          label: "NO - No se puede ofrecer / Paciente molesto",
          nextStep: "step-escalar-adherencia"
        },
      ],
      estimatedTime: "1 minuto",
    },
    {
      id: "step-agendar-short",
      title: "SI - Se puede ofrecer cita",
      description: "Agendar cita subsecuente",
      type: "action",
      content: "Seguir el proceso de 'Agendamiento de Citas' pero agendarla en 'Short' porque es una cita subsecuente (Psicología es la única que se agenda como 'Long')",
      nextStep: "step-completado",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-escalar-adherencia",
      title: "NO - Paciente muy renuente o muy molesto",
      description: "Escalar a adherencia",
      type: "action",
      content: "Mencionar al paciente que el equipo se estaría contactando con él por llamada, revisamos quien tiene el ticket asignado y se manda a Adherencia (Equipo Inbound - Gmail)",
      nextStep: "step-completado",
      tip: "Escalar solo si el paciente está muy renuente o molesto",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-agendar-cita",
      title: "Paso 4- Seguir proceso de Agendamiento de Citas",
      description: "Agendar cita según corresponda",
      type: "action",
      content: "Seguir proceso de Agendamiento de Citas (Psicologia es la única que se agenda como 'Long')",
      nextStep: "step-completado",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-completado",
      title: "Flujo PX sin Cita Completado",
      description: "Proceso para pacientes sin cita finalizado",
      type: "info",
      content: "El proceso de flujo para paciente sin cita con segundo pago próximo ha sido completado exitosamente.",
      estimatedTime: "1 minuto",
    },
  ],
  "proc-agendamiento-citas": [
    {
      id: "step-1",
      title: "Paso 1- Identificar si es cita 'Primera Vez' o 'Cita Subsecuente'",
      description: "Determinar el tipo de cita",
      type: "action",
      content: "1.1 - Cita Primera Vez - 45 minutos forzosamente (Long)\n\n1.2 - CIta Subsecuente - 30 minutos (Short)\n\n1.3 - Validar si tiene un plan Mensual (Citas cada mes)\n\nPrimera Cita - Long\n\nCita Subsecuente - (Short)\n\nPsicología es la única que se agenda como 'Long'",
      nextStep: "step-identificar-paciente",
      estimatedTime: "2 minutos",
    },
    {
      id: "step-identificar-paciente",
      title: "Paso 2 - Identificar si es paciente Simple o Complejo",
      description: "Clasificar al paciente según su plan",
      type: "action",
      content: "2.1 - Paciente Simple - agenda con Medicina General - (Diana, Gabrielle, Ma. Fernanda).\n\n2.2 - Paciente Complejo - agenda con Médicos especialistas\n\n2.3 - Diabetes - Endocrinólogos (Grupo específico: Carmona, Pricila, Darielle, Maripaz, Mariela).\n\nNota Crítica: Un paciente Simple puede agendarse con un médico Complejo (para llenar huecos/adelantar), pero un paciente Complejo NUNCA debe ir con un médico Simple.",
      nextStep: "step-completado",
      tip: "Validar siempre el tipo de paciente antes de agendar",
      estimatedTime: "3 minutos",
    },
    {
      id: "step-completado",
      title: "Cita Agendada Exitosamente",
      description: "Proceso de agendamiento completado",
      type: "info",
      content: "La cita ha sido agendada exitosamente. El paciente ha recibido la confirmación y está registrado en el sistema.",
      estimatedTime: "1 minuto",
    },
  ],
}

// Procesos recientes para el dashboard
export const recentProcesses = [
  {
    id: "recent-1",
    title: "Cancelación de Paciente",
    category: "cancelacion",
    timestamp: "Hace 10 minutos",
    user: "Agente María González",
  },
  {
    id: "recent-2", 
    title: "Envío de Medicamento",
    category: "medicamento",
    timestamp: "Hace 25 minutos",
    user: "Agente Carlos Rodríguez",
  },
  {
    id: "recent-3",
    title: "Cambio Fecha de Pago",
    category: "pagos", 
    timestamp: "Hace 1 hora",
    user: "Agente Ana López",
  },
  {
    id: "recent-4",
    title: "Error en Dirección",
    category: "envios",
    timestamp: "Hace 2 horas",
    user: "Agente Pedro Martínez",
  },
  {
    id: "recent-5",
    title: "Agendamiento de Citas",
    category: "citas",
    timestamp: "Hace 3 horas",
    user: "Agente Laura Sánchez",
  },
]
