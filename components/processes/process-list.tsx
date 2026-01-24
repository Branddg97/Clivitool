"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, FileText, Clock, TrendingUp } from "lucide-react"
import { processCategories, processList } from "@/lib/processes-data"
import { useTabs } from "@/components/tabs/tabs-manager"

interface ProcessListProps {
  category: string
}

export function ProcessList({ category }: ProcessListProps) {
  const { openTab } = useTabs()
  const [searchQuery, setSearchQuery] = useState("")

  const categoryInfo = processCategories.find((c) => c.id === category)
  const categoryProcesses = processList[category] || []

  const handleProcessClick = (processId: string, processTitle: string) => {
    openTab({
      title: processTitle,
      path: `/process/${processId}`,
      type: "process",
      processId,
    })
  }

  const filteredProcesses = categoryProcesses.filter(
    (process) =>
      process.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{categoryInfo?.title || "Procesos"}</h1>
          <p className="text-gray-600 mt-1">{categoryInfo?.description}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar proceso..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredProcesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">No se encontraron procesos en esta categoría</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProcesses.map((process) => (
            <Card
              key={process.id}
              onClick={() => handleProcessClick(process.id, process.title)}
              className="h-full hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-500"
            >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">{process.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">{process.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className={getDifficultyColor(process.difficulty)}>
                      {process.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {process.avgTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {process.usage} usos
                    </div>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      )}
    </div>
  )
}
