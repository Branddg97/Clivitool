/**
 * Procesador Automático de CSV a Procesos
 * Convierte CSV directamente a la estructura de procesos
 */

import { ProcessStep, Process, ProcessCategory } from "./processes-data"

export interface CSVProcess {
  id: string
  title: string
  category: string
  steps: number
  avgTime: string
  difficulty: string
  description: string
  processSteps: string
}

export interface ProcessedData {
  categories: ProcessCategory[]
  processes: Record<string, Process[]>
  steps: Record<string, ProcessStep[]>
}

export class CSVProcessor {
  private static iconMap: Record<string, string> = {
    cancelacion: "UserMinus",
    supplies: "Truck",
    citas: "Calendar",
    cuentas: "User",
    pagos: "CreditCard",
    envios: "Package",
    error: "AlertTriangle",
    soporte: "HelpCircle",
    administracion: "Settings"
  }

  private static colorMap: Record<string, string> = {
    cancelacion: "bg-red-500",
    supplies: "bg-green-500",
    citas: "bg-blue-500",
    cuentas: "bg-purple-500",
    pagos: "bg-yellow-500",
    envios: "bg-orange-500",
    error: "bg-red-600",
    soporte: "bg-blue-600",
    administracion: "bg-gray-600"
  }

  static processCSV(csvContent: string): ProcessedData {
    const lines = csvContent.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      throw new Error('CSV must have at least header and one data row')
    }

    const header = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const processes: CSVProcess[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i])
      if (values.length >= 8) {
        processes.push({
          id: values[0].trim(),
          title: values[1].trim(),
          category: values[2].trim(),
          steps: parseInt(values[3]) || 1,
          avgTime: values[4].trim(),
          difficulty: this.normalizeDifficulty(values[5].trim()),
          description: values[6].trim(),
          processSteps: values[7].trim()
        })
      }
    }

    return this.convertToProcessData(processes)
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"' && (i === 0 || line[i-1] === ',')) {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim())
    return result
  }

  private static normalizeDifficulty(difficulty: string): "Fácil" | "Medio" | "Difícil" {
    const normalized = difficulty.toLowerCase()
    if (normalized.includes('facil')) return "Fácil"
    if (normalized.includes('medio')) return "Medio"
    if (normalized.includes('dificil')) return "Difícil"
    return "Medio" // Default
  }

  private static convertToProcessData(csvProcesses: CSVProcess[]): ProcessedData {
    // Extraer categorías únicas
    const categoryNames = [...new Set(csvProcesses.map(p => p.category))]
    
    // Crear categorías
    const categories: ProcessCategory[] = categoryNames.map(category => {
      const processesInCategory = csvProcesses.filter(p => p.category === category)
      const totalSteps = processesInCategory.reduce((sum, p) => sum + p.steps, 0)
      const avgTime = this.calculateAverageTime(processesInCategory)
      
      return {
        id: category,
        title: this.capitalizeFirst(category),
        description: this.generateCategoryDescription(category, processesInCategory),
        icon: this.iconMap[category] || "FileText",
        color: this.colorMap[category] || "bg-gray-500",
        processes: processesInCategory.length,
        avgTime,
        href: `/processes/${category}`
      }
    })

    // Crear procesos
    const processes: Record<string, Process[]> = {}
    categoryNames.forEach(category => {
      processes[category] = csvProcesses
        .filter(p => p.category === category)
        .map(csv => ({
          id: csv.id,
          title: csv.title,
          description: csv.description,
          category: csv.category,
          steps: csv.steps,
          avgTime: csv.avgTime,
          difficulty: csv.difficulty,
          usage: 0,
          lastUpdated: "Hoy"
        }))
    })

    // Crear pasos
    const steps: Record<string, ProcessStep[]> = {}
    csvProcesses.forEach(csv => {
      steps[csv.id] = this.parseSteps(csv.processSteps)
    })

    return {
      categories,
      processes,
      steps
    }
  }

  private static parseSteps(stepsJson: string): ProcessStep[] {
    try {
      const parsed = JSON.parse(stepsJson)
      return this.convertStepsToFormat(parsed)
    } catch (error) {
      console.warn(`Failed to parse steps JSON: ${error.message}`)
      return this.generateDefaultSteps()
    }
  }

  private static convertStepsToFormat(stepsData: any): ProcessStep[] {
    const steps: ProcessStep[] = []
    
    if (stepsData.ramas) {
      // Formato con ramas (como el CSV original)
      stepsData.ramas.forEach((rama: any, index: number) => {
        const stepPrefix = `step-${index + 1}`
        
        // Paso inicial de decisión
        steps.push({
          id: stepPrefix,
          title: rama.tipo,
          description: `Proceso: ${rama.tipo}`,
          type: "question",
          content: stepsData.decision_inicial || `Seleccionar: ${rama.tipo}`,
          estimatedTime: "1 minuto",
          options: rama.pasos.map((_: any, optIndex: number) => ({
            id: `opt-${optIndex}`,
            label: rama.tipo,
            nextStep: `${stepPrefix}-${optIndex + 1}`
          }))
        })
        
        // Pasos de la rama
        rama.pasos.forEach((paso: string, pasoIndex: number) => {
          steps.push({
            id: `${stepPrefix}-${pasoIndex + 1}`,
            title: `Paso ${pasoIndex + 1}`,
            description: paso,
            type: this.detectStepType(paso),
            content: paso,
            estimatedTime: this.estimateTime(paso)
          })
        })
      })
    } else if (stepsData.pasos) {
      // Formato simple de pasos
      stepsData.pasos.forEach((paso: any, index: number) => {
        steps.push({
          id: `step-${index + 1}`,
          title: paso.title || `Paso ${index + 1}`,
          description: paso.descripcion || paso,
          type: paso.type || this.detectStepType(paso),
          content: paso.content || paso,
          estimatedTime: paso.estimatedTime || this.estimateTime(paso),
          nextStep: index < stepsData.pasos.length - 1 ? `step-${index + 2}` : undefined
        })
      })
    }
    
    return steps
  }

  private static detectStepType(content: string): "info" | "question" | "action" | "validation" {
    const lowerContent = content.toLowerCase()
    
    if (lowerContent.includes('¿') || lowerContent.includes('?')) return "question"
    if (lowerContent.includes('validar') || lowerContent.includes('verificar')) return "validation"
    if (lowerContent.includes('realizar') || lowerContent.includes('hacer') || lowerContent.includes('enviar')) return "action"
    return "info"
  }

  private static estimateTime(content: string): string {
    const words = content.split(' ').length
    if (words < 5) return "1 minuto"
    if (words < 10) return "2 minutos"
    if (words < 20) return "3 minutos"
    return "5 minutos"
  }

  private static generateDefaultSteps(): ProcessStep[] {
    return [
      {
        id: "step-1",
        title: "Proceso",
        description: "Paso del proceso",
        type: "info",
        content: "Contenido del proceso",
        estimatedTime: "1 minuto"
      }
    ]
  }

  private static calculateAverageTime(processes: CSVProcess[]): string {
    if (processes.length === 0) return "0 min"
    
    const times = processes.map(p => {
      const match = p.avgTime.match(/(\d+)-(\d+)/)
      if (match) {
        const min = parseInt(match[1])
        const max = parseInt(match[2])
        return (min + max) / 2
      }
      return 5 // Default
    })
    
    const avg = times.reduce((sum, time) => sum + time, 0) / times.length
    return `${Math.round(avg)}-${Math.round(avg + 2)} min`
  }

  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  private static generateCategoryDescription(category: string, processes: CSVProcess[]): string {
    const descriptions: Record<string, string> = {
      cancelacion: "Proceso de cancelación de pacientes y retención",
      supplies: "Proceso de envío de medicamentos y gestión de entregas",
      citas: "Proceso de agendamiento y seguimiento de citas médicas",
      cuentas: "Proceso de gestión de cuentas y acceso al sistema",
      pagos: "Proceso de gestión de pagos y facturación",
      envios: "Proceso de envío y recepción de paquetes",
      error: "Proceso de resolución de errores y incidencias",
      soporte: "Proceso de atención al cliente y soporte técnico",
      administracion: "Proceso de administración y gestión del sistema"
    }
    
    return descriptions[category] || `Procesos de ${category}`
  }

  static generateProcessFile(processedData: ProcessedData): string {
    return `// Archivo generado automáticamente desde CSV
// Fecha: ${new Date().toISOString()}
// Procesos: ${Object.values(processedData.processes).flat().length}
// Categorías: ${processedData.categories.length}

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
export const processCategories: ProcessCategory[] = ${JSON.stringify(processedData.categories, null, 2)}

// Lista de procesos por categoría
export const processList: Record<string, Process[]> = ${JSON.stringify(processedData.processes, null, 2)}

// Pasos detallados de cada proceso
export const processSteps: Record<string, ProcessStep[]> = ${JSON.stringify(processedData.steps, null, 2)}
`
  }
}

// Función de conveniencia para procesar CSV
export function processCSVFile(csvContent: string): string {
  const processedData = CSVProcessor.processCSV(csvContent)
  return CSVProcessor.generateProcessFile(processedData)
}

// Función para actualizar directamente el archivo
export function updateProcessesFromCSV(csvContent: string): void {
  const newFileContent = processCSVFile(csvContent)
  
  // Esto debería ser llamado desde un endpoint seguro
  console.log('Generated processes file content length:', newFileContent.length)
  return newFileContent
}
