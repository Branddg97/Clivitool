"use client"

import { ConfluenceStatus } from "@/components/admin/confluence-status"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, User, BarChart3, Plus } from "lucide-react"

export default function AdminPage() {
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
                  onClick={() => (window.location.href = "/admin/processes")}
                >
                  <Edit className="h-6 w-6" />
                  <span>Gestionar Procesos</span>
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
