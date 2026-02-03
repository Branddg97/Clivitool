"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft, FileText } from "lucide-react"
import { processList, type Process } from "@/lib/processes-data"
import Link from "next/link"

export default function SearchPage() {
  // Obtener query parameter de la URL del lado del cliente
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    // Extraer query parameter de la URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const query = urlParams.get('q')
      if (query) {
        setSearchQuery(query)
      }
    }
  }, [])

  // Obtener todos los procesos para buscar
  const allProcesses = useMemo(() => {
    const processes: (Process & { category: string })[] = []
    Object.entries(processList).forEach(([category, categoryProcesses]) => {
      categoryProcesses.forEach((process) => {
        processes.push({
          ...process,
          category,
        })
      })
    })
    return processes
  }, [])

  // Filtrar procesos basados en la búsqueda
  const filteredProcesses = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    return allProcesses.filter((process) => {
      // Buscar en título
      if (process.title.toLowerCase().includes(query)) return true
      
      // Buscar en descripción
      if (process.description.toLowerCase().includes(query)) return true
      
      // Buscar en categoría
      if (process.category.toLowerCase().includes(query)) return true
      
      return false
    })
  }, [searchQuery, allProcesses])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    
    // Actualizar URL con el parámetro de búsqueda
    if (typeof window !== 'undefined' && searchQuery.trim()) {
      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(searchQuery)}`
      window.history.pushState({}, '', newUrl)
    }
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
    }, 300)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cancelacion: "bg-red-100 text-red-800",
      medicamento: "bg-green-100 text-green-800",
      pagos: "bg-blue-100 text-blue-800",
      citas: "bg-purple-100 text-purple-800",
      delivery: "bg-orange-100 text-orange-800",
      general: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.general
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      cancelacion: "Cancelación",
      medicamento: "Medicamento",
      pagos: "Pagos",
      citas: "Citas",
      delivery: "Delivery",
      general: "General",
    }
    return labels[category] || labels.general
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados de Búsqueda</h1>
          <p className="text-gray-600">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Busque procesos por palabras clave"}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Procesos</CardTitle>
            <CardDescription>Encuentre procesos por palabras clave o descripción</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch}>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ej: Cancelación, Envío de Medicamento, Adelanto de Pago..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resultados Encontrados</span>
                <Badge variant="secondary">
                  {filteredProcesses.length} {filteredProcesses.length === 1 ? "resultado" : "resultados"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredProcesses.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                  <p className="text-gray-600 mb-4">
                    No hay procesos que coincidan con "{searchQuery}"
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Sugerencias:</p>
                    <ul className="text-sm text-gray-500 list-disc list-inside">
                      <li>Verifique la ortografía de las palabras</li>
                      <li>Use términos más generales</li>
                      <li>Pruebe con palabras clave como: cancelación, medicamento, pago, cita</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProcesses.map((process) => (
                    <div
                      key={process.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {process.title}
                            </h3>
                            <Badge className={getCategoryColor(process.category)}>
                              {getCategoryLabel(process.category)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{process.description}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {process.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {process.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {process.avgTime}
                            </Badge>
                          </div>
                        </div>
                        <Link href={`/process/${process.id}`}>
                          <Button variant="outline" size="sm">
                            Ver Proceso
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
