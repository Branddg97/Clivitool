"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ArrowRight, ArrowLeft, AlertTriangle, Info, Clock, User, FileText } from "lucide-react"
import { processSteps, processList } from "@/lib/processes-data"

interface DecisionTreeProps {
  processId: string
}

export function DecisionTree({ processId }: DecisionTreeProps) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [stepHistory, setStepHistory] = useState<number[]>([0])

  const steps = processSteps[processId] || []
  const currentStep = steps[currentStepIndex]

  useEffect(() => {
    setStartTime(new Date())
  }, [])

  if (!currentStep) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Proceso no encontrado</h3>
          <p className="text-gray-600">El proceso solicitado no está disponible.</p>
        </CardContent>
      </Card>
    )
  }

  const progress = ((completedSteps.length + 1) / steps.length) * 100

  const handleNext = (nextStepId?: string) => {
    setCompletedSteps((prev) => [...prev, currentStep.id])

    if (nextStepId) {
      const nextIndex = steps.findIndex((step) => step.id === nextStepId)
      if (nextIndex !== -1) {
        setStepHistory((prev) => [...prev, nextIndex])
        setCurrentStepIndex(nextIndex)
      }
    } else if (currentStep.nextStep) {
      const nextIndex = steps.findIndex((step) => step.id === currentStep.nextStep)
      if (nextIndex !== -1) {
        setStepHistory((prev) => [...prev, nextIndex])
        setCurrentStepIndex(nextIndex)
      }
    } else if (currentStepIndex < steps.length - 1) {
      setStepHistory((prev) => [...prev, currentStepIndex + 1])
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (stepHistory.length > 1) {
      const newHistory = [...stepHistory]
      newHistory.pop()
      const previousIndex = newHistory[newHistory.length - 1]
      setStepHistory(newHistory)
      setCurrentStepIndex(previousIndex)
      setCompletedSteps((prev) => prev.filter((stepId) => stepId !== currentStep.id))
    }
  }

  const handleFinish = () => {
    // Marcar el último paso como completado
    setCompletedSteps((prev) => [...prev, currentStep.id])
    
    // Calcular tiempo transcurrido en minutos (con decimales para precisión)
    const endTime = new Date()
    const timeElapsedMs = endTime.getTime() - startTime.getTime()
    const timeElapsed = Math.round((timeElapsedMs / 1000 / 60) * 10) / 10 // en minutos con 1 decimal
    
    // Obtener el título del proceso
    let processTitle = "Proceso desconocido"
    for (const category of Object.values(processList)) {
      const process = category.find((p) => p.id === processId)
      if (process) {
        processTitle = process.title
        break
      }
    }
    
    // Guardar estadísticas del proceso completado
    const processStats = {
      processId,
      processTitle,
      completedAt: endTime.toISOString(),
      timeElapsed, // en minutos con decimales
      stepsCompleted: completedSteps.length + 1,
      totalSteps: steps.length,
      date: new Date().toISOString().split("T")[0], // fecha en formato YYYY-MM-DD
    }
    
    // Obtener estadísticas existentes
    const existingStats = localStorage.getItem("processStats")
    const stats = existingStats ? JSON.parse(existingStats) : []
    
    // Agregar nueva estadística
    stats.push(processStats)
    
    // Mantener solo las últimas 1000 estadísticas para no llenar el localStorage
    const recentStats = stats.slice(-1000)
    localStorage.setItem("processStats", JSON.stringify(recentStats))
    
    // Redirigir al dashboard
    router.push("/dashboard")
  }

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      case "question":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "action":
        return <User className="h-5 w-5 text-purple-600" />
      case "validation":
        return <FileText className="h-5 w-5 text-green-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getStepTypeBadge = (type: string) => {
    switch (type) {
      case "info":
        return <Badge className="bg-blue-100 text-blue-800">Información</Badge>
      case "question":
        return <Badge className="bg-orange-100 text-orange-800">Decisión</Badge>
      case "action":
        return <Badge className="bg-purple-100 text-purple-800">Acción</Badge>
      case "validation":
        return <Badge className="bg-green-100 text-green-800">Validación</Badge>
      default:
        return <Badge>Paso</Badge>
    }
  }

  // Un paso es final si no tiene nextStep ni opciones (independientemente de su posición)
  const isLastStep = !currentStep.nextStep && !currentStep.options

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso: {completedSteps.length + 1} de {steps.length} pasos
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStepTypeIcon(currentStep.type)}
              <div>
                <CardTitle className="text-xl">{currentStep.title}</CardTitle>
                <CardDescription>{currentStep.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStepTypeBadge(currentStep.type)}
              {currentStep.estimatedTime && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{currentStep.estimatedTime}</span>
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-line">{currentStep.content}</p>
          </div>

          {/* Warning */}
          {currentStep.warning && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{currentStep.warning}</AlertDescription>
            </Alert>
          )}

          {/* Tip */}
          {currentStep.tip && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">{currentStep.tip}</AlertDescription>
            </Alert>
          )}

          {/* Options (for question type) */}
          {currentStep.options && currentStep.options.length > 0 && (
            <div className="space-y-3 pt-4">
              <p className="font-medium text-gray-700">Selecciona una opción:</p>
              <div className="grid gap-3">
                {currentStep.options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                    onClick={() => handleNext(option.nextStep)}
                  >
                    <ArrowRight className="h-4 w-4 mr-3 text-purple-600 flex-shrink-0" />
                    <span>{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={stepHistory.length <= 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {!currentStep.options && (
              <Button 
                onClick={isLastStep ? handleFinish : () => handleNext()} 
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Completed Steps Summary */}
      {completedSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pasos completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedSteps.map((stepId, index) => {
                const step = steps.find((s) => s.id === stepId)
                return step ? (
                  <div key={stepId} className="flex items-center space-x-3 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>
                      {index + 1}. {step.title}
                    </span>
                  </div>
                ) : null
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
