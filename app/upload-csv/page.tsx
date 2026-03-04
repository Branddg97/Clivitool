"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function UploadCSVPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setResult(null)
    } else {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo CSV",
        variant: "destructive"
      })
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo CSV primero",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('csv', file)

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setResult({
          success: true,
          message: data.message
        })
        toast({
          title: "¡Éxito!",
          description: "Procesos actualizados correctamente",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Error desconocido"
        })
        toast({
          title: "Error",
          description: data.error || "No se pudieron actualizar los procesos",
          variant: "destructive"
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error de conexión"
      })
      toast({
        title: "Error",
        description: "No se pudo conectar con el servidor",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    const template = `ID del Proceso,Título,Categoría,Pasos,Tiempo Promedio,Dificultad,Descripción,Pasos Detallados
proc-ejemplo,Proceso de Ejemplo,categoria-ejemplo,3,5-10 min,Medio,"Descripción del proceso de ejemplo","{\\"decision_inicial\\":\\\"¿El paciente necesita ayuda?\\",\\\"ramas\\":[{\\"tipo\\\":\\\"Sí\\",\\\"pasos\\":[\\\"Validar información\\\",\\\"Revisar datos del paciente\\\"]},{\"tipo\\":\\\"No\\",\\\"pasos\\":[\\\"Ofrecer ayuda\\\",\\\"Escalar a especialista\\\"]}]}"`
    
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'procesos_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Subir CSV de Procesos
            </CardTitle>
            <CardDescription>
              Sube tu archivo CSV y actualiza automáticamente todos los procesos del sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Template Download */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">¿No tienes el formato CSV?</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Descarga la plantilla con el formato correcto
                  </p>
                </div>
                <Button 
                  onClick={handleDownloadTemplate}
                  variant="outline"
                  size="sm"
                  className="bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Descargar Plantilla
                </Button>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {file ? file.name : "Arrastra tu archivo CSV aquí"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {file ? `Tamaño: ${(file.size / 1024).toFixed(1)} KB` : "O haz clic para seleccionar"}
                  </p>
                </div>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 mr-2 border-2 border-gray-300 border-t-transparent" />
                  Procesando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir y Actualizar Procesos
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <div className="flex items-center">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  )}
                  <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                    {result.message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📋 Formato CSV Requerido:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Columnas requeridas:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code>ID del Proceso</code> - Identificador único (ej: proc-cancelacion)</li>
                  <li><code>Título</code> - Nombre visible del proceso</li>
                  <li><code>Categoría</code> - Categoría existente o nueva</li>
                  <li><code>Pasos</code> - Número de pasos</li>
                  <li><code>Tiempo Promedio</code> - Formato: "X-Y min"</li>
                  <li><code>Dificultad</code> - Fácil, Medio o Difícil</li>
                  <li><code>Descripción</code> - Descripción completa</li>
                  <li><code>Pasos Detallados</code> - JSON con la estructura de pasos</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
              >
                Volver al Dashboard
              </Button>
              
              {result?.success && (
                <Button onClick={() => window.location.reload()}>
                  Recargar Página
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
