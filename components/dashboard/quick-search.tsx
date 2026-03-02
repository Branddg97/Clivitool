"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, TrendingUp } from "lucide-react"
import { processList, recentProcesses } from "@/lib/processes-data"

export function QuickSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  // Obtener todos los procesos para búsquedas populares
  const allProcesses = useMemo(() => {
    const processes: Array<{ id: string; title: string; usage: number }> = []
    Object.values(processList).forEach((categoryProcesses) => {
      categoryProcesses.forEach((process) => {
        processes.push({
          id: process.id,
          title: process.title,
          usage: process.usage,
        })
      })
    })
    return processes
  }, [])

  // Búsquedas populares: procesos más usados (ordenados por usage)
  const popularSearches = useMemo(() => {
    return allProcesses
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 6)
      .map((process) => process.title)
  }, [allProcesses])

  // Búsquedas recientes: títulos de los procesos recientes
  const recentSearches = useMemo(() => {
    return recentProcesses.map((process) => process.title)
  }, [])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Redirigir a la página de resultados de búsqueda
    router.push(`/search?q=${encodeURIComponent(query)}`)
    
    setIsSearching(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query)
    handleSearch(query)
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Búsqueda Rápida</h2>
          <p className="text-sm text-gray-600">Encuentre procesos por palabras clave o descripción</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
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
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Búsquedas populares</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  onClick={() => handleQuickSearch(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>

          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Búsquedas recientes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleQuickSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
