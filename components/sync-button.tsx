"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface SyncButtonProps {
  onSyncComplete?: (data: any) => void
}

export function SyncButton({ onSyncComplete }: SyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSync = async () => {
    setIsSyncing(true)
    setSyncStatus('idle')

    try {
      const response = await fetch('/api/sync-processes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Error al sincronizar')
      }

      const data = await response.json()
      setSyncStatus('success')
      
      // Guardar en localStorage
      localStorage.setItem('processes-data', JSON.stringify(data))
      
      // Recargar la página para aplicar cambios
      setTimeout(() => {
        window.location.reload()
      }, 1500)

      if (onSyncComplete) {
        onSyncComplete(data)
      }
    } catch (error) {
      console.error('Error syncing:', error)
      setSyncStatus('error')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant={syncStatus === 'error' ? 'destructive' : 'default'}
      className="flex items-center gap-2"
    >
      {isSyncing ? (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          Sincronizando...
        </>
      ) : syncStatus === 'success' ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          ¡Sincronizado!
        </>
      ) : syncStatus === 'error' ? (
        <>
          <AlertCircle className="h-4 w-4" />
          Error - Reintentar
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4" />
          Sincronizar con Google Sheets
        </>
      )}
    </Button>
  )
}
