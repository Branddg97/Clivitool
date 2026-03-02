"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, EyeOff, Save } from "lucide-react"
import { processCategories, processList, type Process, type ProcessCategory } from "@/lib/processes-data"

interface ProcessFormData {
  id: string
  title: string
  description: string
  category: string
  steps: number
  avgTime: string
  difficulty: "Fácil" | "Medio" | "Difícil"
  usage: number
}

interface CategoryFormData {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
}

export default function ManageProcessesPage() {
  const [activeTab, setActiveTab] = useState<"processes" | "categories">("processes")
  const [showProcessDialog, setShowProcessDialog] = useState(false)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [editingCategory, setEditingCategory] = useState<ProcessCategory | null>(null)
  const [message, setMessage] = useState("")
  
  const [processForm, setProcessForm] = useState<ProcessFormData>({
    id: "",
    title: "",
    description: "",
    category: "",
    steps: 1,
    avgTime: "5-10 min",
    difficulty: "Medio",
    usage: 0
  })

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    id: "",
    title: "",
    description: "",
    icon: "FileText",
    color: "bg-gray-500",
    href: ""
  })

  const [processes, setProcesses] = useState<Process[]>([])
  const [categories, setCategories] = useState<ProcessCategory[]>([])

  const iconOptions = [
    "FileText", "User", "Settings", "Package", "Truck", "CreditCard", 
    "Calendar", "Clock", "CheckCircle", "AlertCircle", "Info", "Home"
  ]

  const colorOptions = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-gray-500"
  ]

  const handleSubmitProcess = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!processForm.title || !processForm.description || !processForm.category) {
      setMessage("Por favor, completa todos los campos requeridos")
      return
    }

    try {
      const newProcess: Process = {
        ...processForm,
        lastUpdated: new Date().toLocaleDateString()
      }

      if (editingProcess) {
        // Editar proceso existente
        setProcesses(prev => prev.map(p => p.id === editingProcess.id ? newProcess : p))
        setMessage("Proceso actualizado exitosamente")
      } else {
        // Crear nuevo proceso
        setProcesses(prev => [...prev, newProcess])
        setMessage("Proceso creado exitosamente")
      }

      // Reset form
      setProcessForm({
        id: "",
        title: "",
        description: "",
        category: "",
        steps: 1,
        avgTime: "5-10 min",
        difficulty: "Medio",
        usage: 0
      })
      setEditingProcess(null)
      setShowProcessDialog(false)
    } catch (error) {
      setMessage("Error al guardar el proceso")
    }
  }

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    if (!categoryForm.title || !categoryForm.description) {
      setMessage("Por favor, completa todos los campos requeridos")
      return
    }

    try {
      const newCategory: ProcessCategory = {
        ...categoryForm,
        processes: 0,
        avgTime: "5-10 min"
      }

      if (editingCategory) {
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? newCategory : c))
        setMessage("Categoría actualizada exitosamente")
      } else {
        setCategories(prev => [...prev, newCategory])
        setMessage("Categoría creada exitosamente")
      }

      // Reset form
      setCategoryForm({
        id: "",
        title: "",
        description: "",
        icon: "FileText",
        color: "bg-gray-500",
        href: ""
      })
      setEditingCategory(null)
      setShowCategoryDialog(false)
    } catch (error) {
      setMessage("Error al guardar la categoría")
    }
  }

  const handleEditProcess = (process: Process) => {
    setEditingProcess(process)
    setProcessForm({
      id: process.id,
      title: process.title,
      description: process.description,
      category: process.category,
      steps: process.steps,
      avgTime: process.avgTime,
      difficulty: process.difficulty,
      usage: process.usage
    })
    setShowProcessDialog(true)
  }

  const handleEditCategory = (category: ProcessCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      id: category.id,
      title: category.title,
      description: category.description,
      icon: category.icon,
      color: category.color,
      href: category.href
    })
    setShowCategoryDialog(true)
  }

  const handleDeleteProcess = (processId: string) => {
    if (confirm("¿Estás seguro de eliminar este proceso?")) {
      setProcesses(prev => prev.filter(p => p.id !== processId))
      setMessage("Proceso eliminado exitosamente")
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategories(prev => prev.filter(c => c.id !== categoryId))
      setMessage("Categoría eliminada exitosamente")
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800"
      case "Medio": return "bg-yellow-100 text-yellow-800"
      case "Difícil": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestionar Procesos</h1>
          <p className="text-gray-600">Crea y administra procesos y categorías del sistema</p>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("processes")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "processes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Procesos ({processes.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Categorías ({categories.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Procesos Tab */}
        {activeTab === "processes" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Procesos del Sistema</CardTitle>
                  <CardDescription>Gestiona los procesos disponibles para los agentes</CardDescription>
                </div>
                <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProcess(null)
                      setProcessForm({
                        id: "",
                        title: "",
                        description: "",
                        category: "",
                        steps: 1,
                        avgTime: "5-10 min",
                        difficulty: "Medio",
                        usage: 0
                      })
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Proceso
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingProcess ? "Editar Proceso" : "Crear Nuevo Proceso"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitProcess} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={processForm.title}
                            onChange={(e) => setProcessForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Título del proceso"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoría</Label>
                          <Select value={processForm.category} onValueChange={(value) => setProcessForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={processForm.description}
                          onChange={(e) => setProcessForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe el proceso"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="steps">Número de Pasos</Label>
                          <Input
                            id="steps"
                            type="number"
                            min="1"
                            value={processForm.steps}
                            onChange={(e) => setProcessForm(prev => ({ ...prev, steps: parseInt(e.target.value) || 1 }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="avgTime">Tiempo Promedio</Label>
                          <Input
                            id="avgTime"
                            value={processForm.avgTime}
                            onChange={(e) => setProcessForm(prev => ({ ...prev, avgTime: e.target.value }))}
                            placeholder="5-10 min"
                          />
                        </div>
                        <div>
                          <Label htmlFor="difficulty">Dificultad</Label>
                          <Select value={processForm.difficulty} onValueChange={(value: "Fácil" | "Medio" | "Difícil") => setProcessForm(prev => ({ ...prev, difficulty: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fácil">Fácil</SelectItem>
                              <SelectItem value="Medio">Medio</SelectItem>
                              <SelectItem value="Difícil">Difícil</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        {editingProcess ? "Actualizar Proceso" : "Crear Proceso"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {processes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay procesos creados</p>
              ) : (
                <div className="space-y-4">
                  {processes.map((process) => (
                    <div key={process.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{process.title}</h3>
                        <p className="text-sm text-gray-600">{process.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getDifficultyColor(process.difficulty)}>
                            {process.difficulty}
                          </Badge>
                          <Badge variant="outline">{process.steps} pasos</Badge>
                          <Badge variant="outline">{process.avgTime}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProcess(process)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProcess(process.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Categorías Tab */}
        {activeTab === "categories" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Categorías del Sistema</CardTitle>
                  <CardDescription>Organiza los procesos en categorías</CardDescription>
                </div>
                <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingCategory(null)
                      setCategoryForm({
                        id: "",
                        title: "",
                        description: "",
                        icon: "FileText",
                        color: "bg-gray-500",
                        href: ""
                      })
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Categoría
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? "Editar Categoría" : "Crear Nueva Categoría"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCategory} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={categoryForm.title}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Título de la categoría"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="href">URL Path</Label>
                          <Input
                            id="href"
                            value={categoryForm.href}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, href: e.target.value }))}
                            placeholder="nombre-categoria"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe la categoría"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="icon">Icono</Label>
                          <Select value={categoryForm.icon} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map(icon => (
                                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="color">Color</Label>
                          <Select value={categoryForm.color} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {colorOptions.map(color => (
                                <SelectItem key={color} value={color}>
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded ${color}`}></div>
                                    {color}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button type="submit" className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        {editingCategory ? "Actualizar Categoría" : "Crear Categoría"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No hay categorías creadas</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded ${category.color} flex items-center justify-center text-white`}>
                          {/* Icon placeholder - en producción usarías el icono real */}
                          <span className="text-xs font-bold">{category.icon[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{category.title}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                          <p className="text-xs text-gray-500 mt-1">/{category.href}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
