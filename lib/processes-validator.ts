/**
 * Validador Automático de Procesos
 * Verifica integridad de datos antes del deployment
 */

import { ProcessStep, Process, ProcessCategory } from "./processes-data"

export interface ValidationResult {
  success: boolean
  errors: string[]
  warnings: string[]
  summary: {
    totalCategories: number
    totalProcesses: number
    totalSteps: number
    orphanedSteps: number
    invalidSteps: number
  }
}

export interface ProcessHealth {
  score: number // 0-100
  status: 'healthy' | 'warning' | 'critical'
  issues: string[]
}

export class ProcessValidator {
  static validateAll(): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    
    try {
      // Importar datos dinámicamente
      const processesData = require('./processes-data')
      const { processCategories, processList, processSteps } = processesData

      // Validar categorías
      const categoryValidation = this.validateCategories(processCategories)
      errors.push(...categoryValidation.errors)
      warnings.push(...categoryValidation.warnings)

      // Validar procesos
      const processValidation = this.validateProcesses(processList, processCategories)
      errors.push(...processValidation.errors)
      warnings.push(...processValidation.warnings)

      // Validar pasos
      const stepValidation = this.validateSteps(processSteps, processList)
      errors.push(...stepValidation.errors)
      warnings.push(...stepValidation.warnings)

      // Validar consistencia cruzada
      const crossValidation = this.validateCrossConsistency(processCategories, processList, processSteps)
      errors.push(...crossValidation.errors)
      warnings.push(...crossValidation.warnings)

      const summary = this.generateSummary(processCategories, processList, processSteps)

      return {
        success: errors.length === 0,
        errors,
        warnings,
        summary
      }

    } catch (error) {
      return {
        success: false,
        errors: [`Failed to load process data: ${error.message}`],
        warnings: [],
        summary: {
          totalCategories: 0,
          totalProcesses: 0,
          totalSteps: 0,
          orphanedSteps: 0,
          invalidSteps: 0
        }
      }
    }
  }

  private static validateCategories(categories: ProcessCategory[]): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!Array.isArray(categories)) {
      errors.push("Categories must be an array")
      return { errors, warnings }
    }

    if (categories.length === 0) {
      errors.push("No categories found")
      return { errors, warnings }
    }

    if (categories.length < 2) {
      warnings.push("Very few categories found")
    }

    // Validar cada categoría
    categories.forEach((category, index) => {
      if (!category.id) {
        errors.push(`Category ${index} missing id`)
      }
      if (!category.title) {
        errors.push(`Category ${category.id} missing title`)
      }
      if (!category.icon) {
        warnings.push(`Category ${category.id} missing icon`)
      }
      if (category.processes < 0) {
        errors.push(`Category ${category.id} has negative process count`)
      }
    })

    // Validar IDs únicos
    const ids = categories.map(c => c.id)
    const uniqueIds = new Set(ids)
    if (ids.length !== uniqueIds.size) {
      errors.push("Duplicate category IDs found")
    }

    return { errors, warnings }
  }

  private static validateProcesses(processes: Record<string, Process[]>, categories: ProcessCategory[]): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!processes || typeof processes !== 'object') {
      errors.push("Processes must be an object")
      return { errors, warnings }
    }

    const categoryIds = categories.map(c => c.id)
    const allProcesses = Object.values(processes).flat()

    if (allProcesses.length === 0) {
      errors.push("No processes found")
      return { errors, warnings }
    }

    // Validar cada proceso
    allProcesses.forEach((process, index) => {
      if (!process.id) {
        errors.push(`Process ${index} missing id`)
      }
      if (!process.title) {
        errors.push(`Process ${process.id} missing title`)
      }
      if (!process.category) {
        errors.push(`Process ${process.id} missing category`)
      } else if (!categoryIds.includes(process.category)) {
        errors.push(`Process ${process.id} has invalid category: ${process.category}`)
      }
      if (process.steps < 0) {
        errors.push(`Process ${process.id} has negative step count`)
      }
      if (!process.avgTime) {
        warnings.push(`Process ${process.id} missing avgTime`)
      }
      if (!process.difficulty || !['Fácil', 'Medio', 'Difícil'].includes(process.difficulty)) {
        errors.push(`Process ${process.id} has invalid difficulty: ${process.difficulty}`)
      }
    })

    // Validar IDs únicos
    const ids = allProcesses.map(p => p.id)
    const uniqueIds = new Set(ids)
    if (ids.length !== uniqueIds.size) {
      errors.push("Duplicate process IDs found")
    }

    return { errors, warnings }
  }

  private static validateSteps(steps: Record<string, ProcessStep[]>, processes: Record<string, Process[]>): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    if (!steps || typeof steps !== 'object') {
      errors.push("Steps must be an object")
      return { errors, warnings }
    }

    const processIds = Object.values(processes).flat().map(p => p.id)
    const allSteps = Object.values(steps).flat()

    if (allSteps.length === 0) {
      errors.push("No steps found")
      return { errors, warnings }
    }

    // Validar cada paso
    allSteps.forEach((step, index) => {
      if (!step.id) {
        errors.push(`Step ${index} missing id`)
      }
      if (!step.title) {
        errors.push(`Step ${step.id} missing title`)
      }
      if (!step.type || !['info', 'question', 'action', 'validation'].includes(step.type)) {
        errors.push(`Step ${step.id} has invalid type: ${step.type}`)
      }
      if (!step.content) {
        errors.push(`Step ${step.id} missing content`)
      }
      if (step.type === 'question' && (!step.options || step.options.length === 0)) {
        errors.push(`Question step ${step.id} must have options`)
      }
      if (step.options) {
        step.options.forEach((option, optIndex) => {
          if (!option.id) {
            errors.push(`Option ${optIndex} in step ${step.id} missing id`)
          }
          if (!option.label) {
            errors.push(`Option ${optIndex} in step ${step.id} missing label`)
          }
        })
      }
    })

    // Validar pasos huérfanos
    const stepIds = Object.keys(steps)
    const orphanedSteps = stepIds.filter(id => !processIds.includes(id))
    if (orphanedSteps.length > 0) {
      warnings.push(`Found ${orphanedSteps.length} orphaned steps: ${orphanedSteps.join(', ')}`)
    }

    return { errors, warnings }
  }

  private static validateCrossConsistency(categories: ProcessCategory[], processes: Record<string, Process[]>, steps: Record<string, ProcessStep[]>): { errors: string[]; warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []

    // Validar contadores de procesos por categoría
    categories.forEach(category => {
      const categoryProcesses = processes[category.id] || []
      if (categoryProcesses.length !== category.processes) {
        errors.push(`Category ${category.id} process count mismatch: expected ${category.processes}, found ${categoryProcesses.length}`)
      }
    })

    // Validar contadores de pasos por proceso
    Object.entries(processes).forEach(([categoryId, categoryProcesses]) => {
      categoryProcesses.forEach(process => {
        const processSteps = steps[process.id] || []
        if (processSteps.length !== process.steps) {
          errors.push(`Process ${process.id} step count mismatch: expected ${process.steps}, found ${processSteps.length}`)
        }
      })
    })

    // Validar nextStep references
    Object.entries(steps).forEach(([processId, processSteps]) => {
      processSteps.forEach(step => {
        if (step.nextStep && !steps[processId].find(s => s.id === step.nextStep)) {
          errors.push(`Invalid nextStep reference: ${step.nextStep} in process ${processId}`)
        }
        if (step.options) {
          step.options.forEach(option => {
            if (option.nextStep && !steps[processId].find(s => s.id === option.nextStep)) {
              errors.push(`Invalid option nextStep reference: ${option.nextStep} in process ${processId}`)
            }
          })
        }
      })
    })

    return { errors, warnings }
  }

  private static generateSummary(categories: ProcessCategory[], processes: Record<string, Process[]>, steps: Record<string, ProcessStep[]>) {
    const totalCategories = categories.length
    const totalProcesses = Object.values(processes).flat().length
    const totalSteps = Object.keys(steps).length
    
    // Calcular pasos huérfanos
    const processIds = Object.values(processes).flat().map(p => p.id)
    const orphanedSteps = Object.keys(steps).filter(id => !processIds.includes(id)).length

    // Calcular pasos inválidos (sin contenido o tipo inválido)
    const invalidSteps = Object.values(steps).flat().filter(step => 
      !step.content || !step.type || !['info', 'question', 'action', 'validation'].includes(step.type)
    ).length

    return {
      totalCategories,
      totalProcesses,
      totalSteps,
      orphanedSteps,
      invalidSteps
    }
  }

  static getHealthScore(validation: ValidationResult): ProcessHealth {
    const { errors, warnings, summary } = validation
    
    let score = 100
    const issues: string[] = []

    // Penalizar errores
    score -= errors.length * 20
    issues.push(...errors.map(e => `Error: ${e}`))

    // Penalizar advertencias
    score -= warnings.length * 5
    issues.push(...warnings.map(w => `Warning: ${w}`))

    // Penalizar problemas estructurales
    if (summary.orphanedSteps > 0) {
      score -= summary.orphanedSteps * 2
      issues.push(`${summary.orphanedSteps} orphaned steps`)
    }

    if (summary.invalidSteps > 0) {
      score -= summary.invalidSteps * 10
      issues.push(`${summary.invalidSteps} invalid steps`)
    }

    score = Math.max(0, score)

    let status: 'healthy' | 'warning' | 'critical'
    if (score >= 80) {
      status = 'healthy'
    } else if (score >= 50) {
      status = 'warning'
    } else {
      status = 'critical'
    }

    return { score, status, issues }
  }
}

// Exportar función de validación rápida
export function quickValidate(): ProcessHealth {
  const validation = ProcessValidator.validateAll()
  return ProcessValidator.getHealthScore(validation)
}

// Exportar función para debugging
export function debugProcessData(): void {
  console.group("🔍 Process Data Debug")
  
  const validation = ProcessValidator.validateAll()
  const health = ProcessValidator.getHealthScore(validation)
  
  console.log("Validation Result:", validation)
  console.log("Health Score:", health)
  
  if (!validation.success) {
    console.error("❌ Validation Failed:", validation.errors)
  }
  
  if (validation.warnings.length > 0) {
    console.warn("⚠️ Warnings:", validation.warnings)
  }
  
  console.log("📊 Summary:", validation.summary)
  console.groupEnd()
}
