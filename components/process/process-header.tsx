"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { processList } from "@/lib/processes-data"

interface ProcessHeaderProps {
  processId: string
}

function getProcessInfo(processId: string) {
  for (const category of Object.values(processList)) {
    const process = category.find((p) => p.id === processId)
    if (process) {
      return {
        title: process.title,
        category: process.category,
        steps: process.steps,
        avgTime: process.avgTime,
        difficulty: process.difficulty,
      }
    }
  }
  return null
}

export function ProcessHeader({ processId }: ProcessHeaderProps) {
  const process = getProcessInfo(processId)

  if (!process) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-lg font-semibold text-gray-900">Proceso no encontrado</span>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/dashboard")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver al Dashboard
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{process.title}</h1>
              <Badge className={getDifficultyColor(process.difficulty)}>{process.difficulty}</Badge>
            </div>
            <p className="text-gray-600 mb-4">Categoría: {process.category}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>{process.steps} pasos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Tiempo estimado: {process.avgTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
