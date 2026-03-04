import { ProcessStep, Process, ProcessCategory } from "./processes-data"

// Pasos detallados de cada proceso desde el CSV
export const processStepsFromCSV: Record<string, ProcessStep[]> = {
  "proc-cancelacion": [
    {
      id: "step-1",
      title: "Decisión Inicial",
      description: "Determinar si el paciente se comunica para cancelar o para dar seguimiento a su cancelación",
      type: "question",
      content: "¿El paciente se comunica para cancelar o para dar seguimiento a su cancelación?",
      estimatedTime: "1 minuto",
      options: [
        {
          id: "opt-seguimiento",
          label: "Es seguimiento",
          nextStep: "step-seguimiento"
        },
        {
          id: "opt-cancelar",
          label: "Quiere cancelar",
          nextStep: "step-cancelar"
        }
      ]
    },
    {
      id: "step-seguimiento",
      title: "Seguimiento de Cancelación",
      description: "Validar Churn y agendar seguimiento",
      type: "action",
      content: "Validar que tenga un Churn para cancelación y quién lo tiene asignado. Pedir al paciente un día para agendar y un rango de horario.",
      estimatedTime: "3 minutos",
      nextStep: "step-seguimiento-2"
    },
    {
      id: "step-seguimiento-2",
      title: "Validar Horarios",
      description: "Validar horarios disponibles y confirmar con paciente",
      type: "action",
      content: "Validar horarios disponibles en calendario y confirmar con el paciente. Seleccionar horario y llenar datos del paciente.",
      estimatedTime: "5 minutos",
      nextStep: "step-seguimiento-3"
    },
    {
      id: "step-seguimiento-3",
      title: "Confirmar Contacto",
      description: "Confirmar horario y marcar como resuelto",
      type: "action",
      content: "Confirmar con el paciente el horario en que le marcarán y validar que sea claro. Marcar ticket como Resuelto.",
      estimatedTime: "2 minutos"
    },
    {
      id: "step-cancelar",
      title: "Motivo de Cancelación",
      description: "Investigar motivo de cancelación",
      type: "action",
      content: "Preguntar motivo de cancelación. Clasificar motivo y redirigir según corresponda.",
      estimatedTime: "3 minutos",
      nextStep: "step-cancelar-2"
    },
    {
      id: "step-cancelar-2",
      title: "Contención y Retención",
      description: "Aplicar estrategias de retención",
      type: "action",
      content: "Realizar contención: ser empáticos y defensores del paciente. Aplicar ideas de retención según caso.",
      estimatedTime: "5 minutos",
      nextStep: "step-cancelar-3"
    },
    {
      id: "step-cancelar-3",
      title: "Decisión Final",
      description: "Confirmar si el paciente quiere cancelar definitivamente",
      type: "question",
      content: "¿El paciente quiere cancelar definitivamente?",
      estimatedTime: "2 minutos",
      options: [
        {
          id: "opt-no-cancelar",
          label: "No quiere cancelar",
          nextStep: "step-no-cancelar"
        },
        {
          id: "opt-si-cancelar",
          label: "Sí quiere cancelar",
          nextStep: "step-si-cancelar"
        }
      ]
    },
    {
      id: "step-no-cancelar",
      title: "Seguimiento Programado",
      description: "Hacer ticket para seguimiento",
      type: "action",
      content: "Hacer ticket para seguimiento y dejar nota. Marcar como Resuelto.",
      estimatedTime: "2 minutos"
    },
    {
      id: "step-si-cancelar",
      title: "Proceso de Baja",
      description: "Iniciar proceso de cancelación definitiva",
      type: "action",
      content: "Cerrar como Resuelto. Realizar Guía Práctica de solicitud de baja. Escalar a área de Churn.",
      estimatedTime: "5 minutos"
    }
  ],
  "proc-envio-medicamento": [
    {
      id: "step-1",
      title: "Validar Tipo de Envío",
      description: "Determinar si es envío de primera vez o subsecuente",
      type: "question",
      content: "¿Es Envío de Primera vez?",
      estimatedTime: "1 minuto",
      options: [
        {
          id: "opt-primera-vez",
          label: "SI - Primera vez",
          nextStep: "step-primera-vez"
        },
        {
          id: "opt-subsecuente",
          label: "NO - Subsecuente",
          nextStep: "step-subsecuente"
        }
      ]
    },
    {
      id: "step-primera-vez",
      title: "Validar Envío Primera Vez",
      description: "Validar en Admin y compartir información de envío",
      type: "action",
      content: "Indicar que tarda aproximadamente 2 días. Validar en Admin > Feed > Delivery. Compartir liga de rastreo y tiempos (5-7 días hábiles).",
      estimatedTime: "3 minutos"
    },
    {
      id: "step-subsecuente",
      title: "Validar Envío Subsecuente",
      description: "Revisar pagos y confirmar envío",
      type: "action",
      content: "Revisar Chargebee: validar fechas de pago y status 'PAID'. Confirmar envío en Admin. Compartir liga de rastreo y solicitar envío a Supplies.",
      estimatedTime: "3 minutos"
    }
  ],
  "proc-error-direccion-entrega": [
    {
      id: "step-1",
      title: "Sondear Motivo",
      description: "Investigar por qué necesita cambiar la dirección",
      type: "action",
      content: "Sondear por qué necesita cambiar la dirección. Revisar dirección registrada en Admin y dirección de guía si aplica.",
      estimatedTime: "3 minutos",
      nextStep: "step-contactar-paciente"
    },
    {
      id: "step-contactar-paciente",
      title: "Contactar Paciente",
      description: "Realizar llamada para confirmar dirección",
      type: "action",
      content: "Realizar llamada al paciente para confirmar dirección (3 intentos cada 5 minutos).",
      estimatedTime: "15 minutos",
      nextStep: "step-decision-contacto"
    },
    {
      id: "step-decision-contacto",
      title: "Verificar Contacto",
      description: "Determinar si el paciente contestó",
      type: "question",
      content: "¿El paciente contestó a los 3 intentos?",
      estimatedTime: "1 minuto",
      options: [
        {
          id: "opt-si-contesto",
          label: "Sí contestó",
          nextStep: "step-confirmar-direccion"
        },
        {
          id: "opt-no-contesto",
          label: "No contestó",
          nextStep: "step-no-contacto"
        }
      ]
    },
    {
      id: "step-confirmar-direccion",
      title: "Confirmar Dirección",
      description: "Obtener y validar dirección completa",
      type: "action",
      content: "Confirmar dirección completa con el paciente. Solicitar datos completos. Validar cobertura por CP. Realizar cambio en Admin.",
      estimatedTime: "10 minutos"
    },
    {
      id: "step-no-contacto",
      title: "Sin Contacto",
      description: "Manejar caso sin contacto exitoso",
      type: "action",
      content: "Mandar mensaje por medios de contacto. Cerrar como Resuelto. Dejar nota de seguimiento. Aclarar que medicamento sigue en proceso.",
      estimatedTime: "5 minutos"
    }
  ],
  "proc-agendamiento-citas": [
    {
      id: "step-1",
      title: "Identificar Tipo de Cita",
      description: "Determinar duración y tipo de cita",
      type: "info",
      content: "Cita Primera Vez: 45 minutos (Long). Cita Subsecuente: 30 minutos (Short). Validar si tiene plan mensual. Psicología es Long.",
      estimatedTime: "1 minuto",
      nextStep: "step-identificar-paciente"
    },
    {
      id: "step-identificar-paciente",
      title: "Identificar Tipo de Paciente",
      description: "Clasificar complejidad del paciente",
      type: "info",
      content: "Paciente Simple: Medicina General (Diana, Gabrielle, Ma. Fernanda). Paciente Complejo: especialistas. Diabetes: endocrinólogos.",
      estimatedTime: "1 minuto",
      warning: "Un paciente Simple puede ir con médico Complejo, pero un Complejo NUNCA debe ir con médico Simple."
    }
  ],
  "proc-prueba": [
    {
      id: "step-1",
      title: "Validar Acceso",
      description: "Verificar si el usuario tiene acceso al correo",
      type: "question",
      content: "¿El usuario tiene acceso al correo electrónico registrado en el sistema?",
      estimatedTime: "1 minuto",
      options: [
        {
          id: "opt-si-acceso",
          label: "SI - Tiene acceso",
          nextStep: "step-si-acceso"
        },
        {
          id: "opt-no-acceso",
          label: "NO - No tiene acceso",
          nextStep: "step-no-acceso"
        }
      ]
    },
    {
      id: "step-si-acceso",
      title: "Enviar Enlace",
      description: "Enviar enlace de restablecimiento",
      type: "action",
      content: "Solicitar correo registrado y confirmar. Enviar enlace desde Admin > Security > Password Reset. Indicar que expira en 15 minutos.",
      estimatedTime: "2 minutos",
      nextStep: "step-confirmar-ingreso"
    },
    {
      id: "step-confirmar-ingreso",
      title: "Confirmar Ingreso",
      description: "Verificar que el usuario pudo ingresar",
      type: "validation",
      content: "Pedir que confirme cuando ya pudo ingresar correctamente. Recomendar cambiar contraseña segura y activar 2FA.",
      estimatedTime: "1 minuto"
    },
    {
      id: "step-no-acceso",
      title: "Validar Identidad",
      description: "Verificar identidad del usuario",
      type: "action",
      content: "Validar identidad solicitando teléfono + fecha de nacimiento (o CURP parcial). Revisar coincidencia en Admin > Users > Identity.",
      estimatedTime: "3 minutos",
      nextStep: "step-escalar-seguridad"
    },
    {
      id: "step-escalar-seguridad",
      title: "Escalar a Seguridad",
      description: "Enviar caso a equipo de seguridad",
      type: "action",
      content: "Escalar a Seguridad vía ticket interno con evidencia. Indicar que puede tardar 24-48 hrs. Una vez confirmado, enviar enlace alterno.",
      estimatedTime: "2 minutos"
    }
  ]
}
