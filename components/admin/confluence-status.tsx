"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle, AlertTriangle, Clock, Database, Zap } from "lucide-react"
import { confluenceService, type SyncResponse } from "@/lib/confluence-service"

export function ConfluenceStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSyncStatus = async () => {
    try {
      setError(null)
      const status = await confluenceService.getSyncStatus()
      setSyncStatus(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch sync status")
    } finally {
      setIsLoading(false)
    }
  }

  const triggerSync = async (forceSync = false) => {
    try {
      setIsSyncing(true)
      setError(null)
      const result = await confluenceService.triggerSync(forceSync)
      setSyncStatus(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to trigger sync")
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    fetchSyncStatus()
    const interval = setInterval(fetchSyncStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Cargando estado de Confluence...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "in-progress":
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Estado de Confluence</span>
              </CardTitle>
              <CardDescription>Sincronización con la documentación de procesos</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => fetchSyncStatus()} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <Button
                size="sm"
                onClick={() => triggerSync(false)}
                disabled={isSyncing || syncStatus?.data?.status === "in-progress"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Sincronizar
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {syncStatus && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">Conexión</div>
                    <div className="text-xs text-gray-600">Conectado</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Espacio</div>
                    <div className="text-xs text-gray-600">APLAZO-SUPPORT</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-sm">Última verificación</div>
                    <div className="text-xs text-gray-600">Hace 2 min</div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(syncStatus.data.status)}
                    <span className="font-medium">Estado de Sincronización</span>
                  </div>
                  <Badge className={getStatusColor(syncStatus.data.status)}>
                    {syncStatus.data.status === "success" && "Exitosa"}
                    {syncStatus.data.status === "error" && "Error"}
                    {syncStatus.data.status === "in-progress" && "En progreso"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Última sincronización:</span>
                    <div className="font-medium">
                      {new Date(syncStatus.data.lastSync).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Procesos actualizados:</span>
                    <div className="font-medium">{syncStatus.data.processesUpdated}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Próxima sincronización:</span>
                    <div className="font-medium">
                      {new Date(syncStatus.data.nextSync).toLocaleString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Errores:</span>
                    <div className="font-medium">{syncStatus.data.errors.length}</div>
                  </div>
                </div>

                {syncStatus.data.status === "in-progress" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Sincronizando procesos...</span>
                      <span>75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}

                {syncStatus.data.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm text-red-800 mb-2">Errores de sincronización:</h4>
                    <div className="space-y-1">
                      {syncStatus.data.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerSync(true)}
                  disabled={isSyncing || syncStatus.data.status === "in-progress"}
                >
                  Sincronización forzada
                </Button>
                <Button variant="ghost" size="sm">
                  Ver logs detallados
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
