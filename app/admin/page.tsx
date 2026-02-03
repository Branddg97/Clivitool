"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { clientAuth } from "@/lib/client-auth"
import { canAccessRoute, type UserRole } from "@/lib/permissions"
import { ConfluenceStatus } from "@/components/admin/confluence-status"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, User, BarChart3, Plus, UserPlus } from "lucide-react"
import { processCategories } from "@/lib/processes-data"
import { useTabsSafe } from "@/components/tabs/tabs-manager"
import { useState } from "react"

export default function AdminPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPermissions = () => {
      const user = clientAuth.getCurrentUser()
      
      if (!user) {
        // Si no hay usuario, redirigir al login
        if (typeof window !== 'undefined') {
          window.location.href = "/login"
        }
        setIsLoading(false)
        return
      }

      // Establecer el rol del usuario
      setUserRole(user.role as UserRole)

      // Verificar si puede acceder a /admin
      if (!canAccessRoute(user.role, "/admin")) {
        // Si no puede acceder, redirigir al dashboard
        if (typeof window !== 'undefined') {
          window.location.href = "/dashboard"
        }
        setIsLoading(false)
        return
      }

      setIsLoading(false)
    }

    checkPermissions()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestión y monitoreo del sistema de procesos</p>
        </div>

        <div className="space-y-8">
          <ConfluenceStatus />

          <Card>
            <CardHeader>
              <CardTitle>Accesos Rápidos</CardTitle>
              <CardDescription>Herramientas de administración</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/manage-processes")}
                >
                  <Edit className="h-6 w-6" />
                  <span>Gestionar Procesos</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/create-user")}
                >
                  <UserPlus className="h-6 w-6" />
                  <span>Crear Usuario</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/users")}
                >
                  <User className="h-6 w-6" />
                  <span>Gestionar Usuarios</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/analytics")}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span>Ver Analíticas</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/processes/new/edit")}
                >
                  <Plus className="h-6 w-6" />
                  <span>Nuevo Proceso</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
