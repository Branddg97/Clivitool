"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, BarChart3 } from "lucide-react"
import { processList, processCategories } from "@/lib/processes-data"
import { useTabs } from "@/components/tabs/tabs-manager"

interface ProcessStat {
  processId: string
  processTitle: string
  completedAt: string
  timeElapsed: number // en minutos
  stepsCompleted: number
  totalSteps: number
  date: string
}

interface RecentProcess {
  id: string
  title: string
  category: string
  lastUsed: string
  timeElapsed: number
  completedAt: string
}

export function RecentProcesses() {
  const router = useRouter()
  const { openTab } = useTabs()
  const [todayStats, setTodayStats] = useState({
    processesUsed: 0,
    avgResponseTime: "0 min",
    completionRate: "0%",
  })
  const [recentProcesses, setRecentProcesses] = useState<RecentProcess[]>([])

  // Función para formatear tiempo relativo
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 1000 / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) {
      return "Hace un momento"
    } else if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
    } else if (diffDays === 1) {
      return "Ayer"
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`
    } else {
      return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
    }
  }

  // Función para formatear tiempo transcurrido
  const formatTimeElapsed = (minutes: number): string => {
    if (minutes < 1) {
      const seconds = Math.round(minutes * 60)
      return `${seconds} seg`
    } else if (minutes < 60) {
      return `${minutes.toFixed(1)} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const mins = Math.round(minutes % 60)
      return `${hours}h ${mins}min`
    }
  }

  // Función para obtener la categoría del proceso
  const getProcessCategory = (processId: string): string => {
    for (const [categoryId, processes] of Object.entries(processList)) {
      const process = processes.find((p) => p.id === processId)
      if (process) {
        const category = processCategories.find((c) => c.id === categoryId)
        return category?.title || categoryId
      }
    }
    return "Sin categoría"
  }

  // Función para cargar procesos recientes
  const loadRecentProcesses = () => {
    try {
      const statsData = localStorage.getItem("processStats")
      if (!statsData) {
        setRecentProcesses([])
        return
      }

      const allStats: ProcessStat[] = JSON.parse(statsData)

      // Ordenar por fecha de finalización (más recientes primero)
      const sortedStats = allStats.sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )

      // Tomar los últimos 5 procesos
      const recent = sortedStats.slice(0, 5).map((stat) => ({
        id: stat.processId,
        title: stat.processTitle,
        category: getProcessCategory(stat.processId),
        lastUsed: formatTimeAgo(stat.completedAt),
        timeElapsed: stat.timeElapsed,
        completedAt: stat.completedAt,
      }))

      setRecentProcesses(recent)
    } catch (error) {
      console.error("Error loading recent processes:", error)
      setRecentProcesses([])
    }
  }

  useEffect(() => {
    // Calcular estadísticas del día actual
    const calculateTodayStats = () => {
      try {
        const statsData = localStorage.getItem("processStats")
        if (!statsData) {
          setTodayStats({
            processesUsed: 0,
            avgResponseTime: "0 min",
            completionRate: "0%",
          })
          return
        }

        const allStats: ProcessStat[] = JSON.parse(statsData)
        const today = new Date().toISOString().split("T")[0]

        // Filtrar estadísticas de hoy
        const todayStats = allStats.filter((stat) => stat.date === today)

        if (todayStats.length === 0) {
          setTodayStats({
            processesUsed: 0,
            avgResponseTime: "0 min",
            completionRate: "0%",
          })
          return
        }

        // Calcular procesos utilizados
        const processesUsed = todayStats.length

        // Calcular tiempo promedio
        const totalTime = todayStats.reduce((sum, stat) => sum + stat.timeElapsed, 0)
        const avgTime = totalTime / processesUsed
        
        // Formatear tiempo promedio
        let avgResponseTime: string
        if (avgTime < 1) {
          // Si es menos de 1 minuto, mostrar en segundos
          const seconds = Math.round(avgTime * 60)
          avgResponseTime = `${seconds} seg`
        } else if (avgTime < 60) {
          // Si es menos de 60 minutos, mostrar en minutos
          avgResponseTime = `${avgTime.toFixed(1)} min`
        } else {
          // Si es más de 60 minutos, mostrar en horas y minutos
          const hours = Math.floor(avgTime / 60)
          const minutes = Math.round(avgTime % 60)
          avgResponseTime = `${hours}h ${minutes}min`
        }

        // Calcular tasa de éxito (procesos completados vs iniciados)
        // Asumimos que si está en las estadísticas, fue completado
        const completed = todayStats.length
        const completionRate = completed > 0 ? "100%" : "0%"

        setTodayStats({
          processesUsed,
          avgResponseTime,
          completionRate,
        })
      } catch (error) {
        console.error("Error calculating today stats:", error)
        setTodayStats({
          processesUsed: 0,
          avgResponseTime: "0 min",
          completionRate: "0%",
        })
      }
    }

    calculateTodayStats()
    loadRecentProcesses()

    // Recalcular cuando se actualiza el localStorage desde otras ventanas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "processStats") {
        calculateTodayStats()
        loadRecentProcesses()
      }
    }

    // Escuchar cambios en localStorage desde otras ventanas
    window.addEventListener("storage", handleStorageChange)

    // Verificar periódicamente para detectar cambios en la misma ventana
    const interval = setInterval(() => {
      calculateTodayStats()
      loadRecentProcesses()
    }, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleProcessClick = (processId: string, processTitle: string) => {
    openTab({
      title: processTitle,
      path: `/process/${processId}`,
      type: "process",
      processId,
    })
  }

  return (
    <div className="space-y-6">
      {/* Today's Stats */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Estadísticas de Hoy</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{todayStats.processesUsed}</div>
              <div className="text-sm text-gray-600">Procesos utilizados</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">{todayStats.avgResponseTime}</div>
                <div className="text-xs text-gray-600">Tiempo promedio</div>
              </div>
              <div className="text-center p-2 bg-cyan-50 rounded-lg">
                <div className="text-lg font-semibold text-cyan-600">{todayStats.completionRate}</div>
                <div className="text-xs text-gray-600">Tasa de éxito</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Processes */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">Procesos Recientes</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              Ver todos
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentProcesses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No hay procesos recientes</p>
              <p className="text-xs mt-1">Completa un proceso para verlo aquí</p>
            </div>
          ) : (
            recentProcesses.map((process) => (
              <div
                key={`${process.id}-${process.completedAt}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleProcessClick(process.id, process.title)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{process.title}</h4>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{process.category}</span>
                    <span>•</span>
                    <span>{process.lastUsed}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{formatTimeElapsed(process.timeElapsed)}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
