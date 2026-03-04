/**
 * Gestor de Procesos - Sistema centralizado para manejar datos de procesos
 * Evita problemas de cache, importación y sincronización
 */

import { ProcessStep, Process, ProcessCategory } from "./processes-data"

// Interface para validación de datos
export interface ProcessDataValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Interface para datos completos de procesos
export interface CompleteProcessData {
  categories: ProcessCategory[]
  processes: Record<string, Process[]>
  steps: Record<string, ProcessStep[]>
  lastUpdated: string
  version: string
}

// Singleton para gestión de procesos
class ProcessManager {
  private static instance: ProcessManager
  private data: CompleteProcessData | null = null
  private validationCache: Map<string, ProcessDataValidation> = new Map()

  private constructor() {
    this.initializeData()
  }

  static getInstance(): ProcessManager {
    if (!ProcessManager.instance) {
      ProcessManager.instance = new ProcessManager()
    }
    return ProcessManager.instance
  }

  private initializeData(): void {
    try {
      // Importar datos desde el archivo principal
      const { processCategories, processList, processSteps } = require("./processes-data")
      
      this.data = {
        categories: processCategories,
        processes: processList,
        steps: processSteps,
        lastUpdated: new Date().toISOString(),
        version: "1.0.0"
      }

      // Validar datos al inicializar
      this.validateAllData()
    } catch (error) {
      console.error("Error initializing ProcessManager:", error)
      this.data = this.getFallbackData()
    }
  }

  private getFallbackData(): CompleteProcessData {
    return {
      categories: [
        {
          id: "error",
          title: "Error de Carga",
          description: "No se pudieron cargar los procesos",
          icon: "AlertTriangle",
          color: "bg-red-500",
          processes: 0,
          avgTime: "0 min",
          href: "/processes/error"
        }
      ],
      processes: {
        error: [{
          id: "error-process",
          title: "Error",
          description: "No se pudieron cargar los procesos",
          category: "error",
          steps: 1,
          avgTime: "0 min",
          difficulty: "Fácil",
          usage: 0,
          lastUpdated: new Date().toISOString()
        }]
      },
      steps: {
        "error-process": [{
          id: "step-error",
          title: "Error",
          description: "No se pudieron cargar los pasos",
          type: "info",
          content: "Por favor recargue la página o contacte al administrador",
          estimatedTime: "1 minuto"
        }]
      },
      lastUpdated: new Date().toISOString(),
      version: "fallback"
    }
  }

  private validateAllData(): void {
    const validation = this.validateData()
    if (!validation.isValid) {
      console.error("Process data validation failed:", validation.errors)
    }
    
    if (validation.warnings.length > 0) {
      console.warn("Process data warnings:", validation.warnings)
    }
  }

  public validateData(): ProcessDataValidation {
    const errors: string[] = []
    const warnings: string[] = []

    if (!this.data) {
      errors.push("No process data available")
      return { isValid: false, errors, warnings }
    }

    // Validar categorías
    if (!Array.isArray(this.data.categories) || this.data.categories.length === 0) {
      errors.push("No categories found")
    }

    // Validar procesos
    const processCount = Object.values(this.data.processes).flat().length
    if (processCount === 0) {
      errors.push("No processes found")
    } else if (processCount < 3) {
      warnings.push("Very few processes found")
    }

    // Validar pasos
    const stepCount = Object.keys(this.data.steps).length
    if (stepCount === 0) {
      errors.push("No process steps found")
    }

    // Validar consistencia
    Object.entries(this.data.processes).forEach(([category, processes]) => {
      processes.forEach(process => {
        if (!this.data.steps[process.id]) {
          warnings.push(`Process ${process.id} has no steps defined`)
        }
      })
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  public getCategories(): ProcessCategory[] {
    return this.data?.categories || []
  }

  public getProcesses(): Record<string, Process[]> {
    return this.data?.processes || {}
  }

  public getSteps(): Record<string, ProcessStep[]> {
    return this.data?.steps || {}
  }

  public getProcessById(id: string): Process | null {
    for (const categoryProcesses of Object.values(this.getProcesses())) {
      const process = categoryProcesses.find(p => p.id === id)
      if (process) return process
    }
    return null
  }

  public getStepsByProcessId(processId: string): ProcessStep[] {
    return this.getSteps()[processId] || []
  }

  public updateData(newData: Partial<CompleteProcessData>): void {
    if (!this.data) {
      this.initializeData()
      return
    }

    this.data = {
      ...this.data,
      ...newData,
      lastUpdated: new Date().toISOString()
    }

    this.validateAllData()
  }

  public getDataInfo(): { totalProcesses: number; totalSteps: number; lastUpdated: string } {
    const totalProcesses = Object.values(this.getProcesses()).flat().length
    const totalSteps = Object.keys(this.getSteps()).length
    
    return {
      totalProcesses,
      totalSteps,
      lastUpdated: this.data?.lastUpdated || "Unknown"
    }
  }

  // Método para limpiar cache y forzar recarga
  public clearCache(): void {
    this.validationCache.clear()
    this.initializeData()
  }

  // Método para exportar datos (para debugging)
  public exportData(): string {
    return JSON.stringify(this.data, null, 2)
  }
}

// Exportar instancia singleton
export const processManager = ProcessManager.getInstance()

// Exportar hooks para React
export function useProcessData() {
  return {
    categories: processManager.getCategories(),
    processes: processManager.getProcesses(),
    steps: processManager.getSteps(),
    validation: processManager.validateData(),
    dataInfo: processManager.getDataInfo()
  }
}

// Exportar funciones de utilidad
export function validateProcessStructure(data: any): ProcessDataValidation {
  const errors: string[] = []
  const warnings: string[] = []

  // Validar estructura básica
  if (!data || typeof data !== 'object') {
    errors.push("Invalid data structure")
    return { isValid: false, errors, warnings }
  }

  // Validar campos requeridos
  const requiredFields = ['categories', 'processes', 'steps']
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Exportar constantes para debugging
export const PROCESS_DEBUG = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: process.env.PROCESS_LOG_LEVEL || 'info',
  cacheTimeout: 5 * 60 * 1000, // 5 minutos
}
