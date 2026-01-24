"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { useTabs } from "@/components/tabs/tabs-manager"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowLeft, Clock, FileText } from "lucide-react"
import { processList, processCategories, categoryNames } from "@/lib/processes-data"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  categoryName: string
  usage: number
  avgTime: string
  difficulty: string
  matchType: "title" | "description" | "category" | "keyword"
  relevance: number
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openTab } = useTabs()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Obtener todos los procesos
  const allProcesses = useMemo(() => {
    const processes: Array<{
      id: string
      title: string
      description: string
      usage: number
      category: string
      avgTime: string
      difficulty: string
    }> = []
    Object.values(processList).forEach((categoryProcesses) => {
      categoryProcesses.forEach((process) => {
        processes.push({
          id: process.id,
          title: process.title,
          description: process.description,
          usage: process.usage,
          category: process.category,
          avgTime: process.avgTime,
          difficulty: process.difficulty,
        })
      })
    })
    return processes
  }, [])

  // Función de búsqueda mejorada
  const searchProcesses = (query: string): SearchResult[] => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase().trim()
    const keywords = lowerQuery.split(" ").filter((k) => k.length > 1)
    const results: SearchResult[] = []

    allProcesses.forEach((process) => {
      const lowerTitle = process.title.toLowerCase()
      const lowerDescription = process.description.toLowerCase()
      const lowerCategory = process.category.toLowerCase()
      const categoryName = categoryNames[process.category] || process.category

      let matchType: "title" | "description" | "category" | "keyword" = "keyword"
      let relevance = 0

      // Coincidencia exacta en título (mayor relevancia)
      if (lowerTitle === lowerQuery) {
        matchType = "title"
        relevance = 100
      }
      // Coincidencia parcial en título
      else if (lowerTitle.includes(lowerQuery)) {
        matchType = "title"
        relevance = 80
      }
      // Coincidencia con palabras clave en título
      else if (keywords.some((keyword) => lowerTitle.includes(keyword))) {
        matchType = "title"
        relevance = 60
      }
      // Coincidencia en descripción
      else if (lowerDescription.includes(lowerQuery)) {
        matchType = "description"
        relevance = 50
      }
      // Coincidencia con palabras clave en descripción
      else if (keywords.some((keyword) => lowerDescription.includes(keyword))) {
        matchType = "description"
        relevance = 40
      }
      // Coincidencia en categoría
      else if (
        lowerCategory.includes(lowerQuery) ||
        categoryName.toLowerCase().includes(lowerQuery)
      ) {
        matchType = "category"
        relevance = 30
      }
      // Coincidencia con palabras clave en categoría
      else if (keywords.some((keyword) => lowerCategory.includes(keyword))) {
        matchType = "category"
        relevance = 20
      }
      // Coincidencia general con palabras clave
      else if (
        keywords.some(
          (keyword) =>
            lowerTitle.includes(keyword) ||
            lowerDescription.includes(keyword) ||
            lowerCategory.includes(keyword)
        )
      ) {
        matchType = "keyword"
        relevance = 10
      }

      if (relevance > 0) {
        results.push({
          id: process.id,
          title: process.title,
          description: process.description,
          category: process.category,
          categoryName,
          usage: process.usage,
          avgTime: process.avgTime,
          difficulty: process.difficulty,
          matchType,
          relevance,
        })
      }
    })

    // Ordenar por relevancia (mayor a menor)
    return results.sort((a, b) => b.relevance - a.relevance)
  }

  // Realizar búsqueda cuando cambia el query
  useEffect(() => {
    const query = searchParams.get("q") || ""
    setSearchQuery(query)

    if (query.trim()) {
      setIsSearching(true)
      setTimeout(() => {
        const searchResults = searchProcesses(query)
        setResults(searchResults)
        setIsSearching(false)
      }, 300)
    } else {
      setResults([])
    }
  }, [searchParams, allProcesses])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleProcessClick = (processId: string, processTitle: string) => {
    openTab({
      title: processTitle,
      path: `/process/${processId}`,
      type: "process",
      processId,
    })
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

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case "title":
        return "Título"
      case "description":
        return "Descripción"
      case "category":
        return "Categoría"
      case "keyword":
        return "Palabra clave"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda de Procesos</h1>
          <p className="text-gray-600">Encuentre procesos por palabras clave o descripción</p>
        </div>

        {/* Barra de búsqueda */}
        <Card className="mb-6">
          <CardContent className="p-6">
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
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        {isSearching ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-500">Buscando...</div>
            </CardContent>
          </Card>
        ) : results.length === 0 && searchQuery ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600">
                No hay procesos que coincidan con "{searchQuery}". Intenta con otras palabras clave.
              </p>
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Se encontraron <span className="font-semibold text-gray-900">{results.length}</span>{" "}
                {results.length === 1 ? "resultado" : "resultados"}
              </p>
            </div>

            {results.map((result) => (
              <Card
                key={result.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProcessClick(result.id, result.title)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                        <Badge className={getDifficultyColor(result.difficulty)}>
                          {result.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getMatchTypeLabel(result.matchType)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FileText className="h-3 w-3" />
                          <span>{result.categoryName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{result.avgTime}</span>
                        </div>
                        <span>•</span>
                        <span>{result.usage} usos</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Busca un proceso</h3>
              <p className="text-gray-600">
                Ingresa palabras clave en la barra de búsqueda para encontrar procesos.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

