"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, RefreshCw, Key, CheckCircle, AlertTriangle, Edit, Trash2, User, Mail, Shield } from "lucide-react"
import { userStore } from "@/lib/user-store"
import { clientAuth } from "@/lib/client-auth"
import { canAccessRoute } from "@/lib/permissions"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "agent" | "supervisor"
  status: "active" | "inactive"
  lastLogin: string
  passwordLastChanged: string
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResetAllDialog, setShowResetAllDialog] = useState(false)
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  // Form data for editing user
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    role: "agent" as "admin" | "agent" | "supervisor",
    status: "active" as "active" | "inactive"
  })
  const [passwordError, setPasswordError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetMessage, setResetMessage] = useState("")
  const [resetDetails, setResetDetails] = useState<Array<{ email: string; tempPassword: string }>>([])

  useEffect(() => {
    const checkPermissions = () => {
      // Verificar si estamos en el cliente
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const user = clientAuth.getCurrentUser()
      
      if (!user) {
        // Redirigir al login
        window.location.href = "/login"
        setIsLoading(false)
        return
      }

      // Verificar si puede acceder a /admin
      if (!canAccessRoute(user.role, "/admin")) {
        // Redirigir al dashboard si no es admin
        window.location.href = "/dashboard"
        setIsLoading(false)
        return
      }

      // Cargar usuarios si está autorizado
      loadUsers()
      setIsLoading(false)
    }

    checkPermissions()
  }, [])

  const loadUsers = async () => {
    try {
      // Usar userStore directamente en modo estático
      const usersList = userStore.getAllUsers()
      setUsers(usersList)
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleResetAllPasswords = async () => {
    setIsLoading(true)
    setShowResetAllDialog(false)

    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetAll: true }),
      })

      const result = await response.json()

      if (result.success) {
        setResetDetails(result.data)
        setResetMessage(`Se han reseteado exitosamente las contraseñas de ${result.data.length} usuarios.`)
        setResetSuccess(true)
        await loadUsers() // Reload users to show updated timestamps
      }
    } catch (error) {
      console.error("Failed to reset passwords:", error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setResetSuccess(false)
        setResetDetails([])
      }, 10000)
    }
  }

  const handleResetSinglePassword = async (userId: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      const result = await response.json()

      if (result.success) {
        setResetDetails([{ email: result.data.email, tempPassword: result.data.tempPassword }])
        setResetMessage(`Contraseña reseteada para ${result.data.email}`)
        setResetSuccess(true)
        await loadUsers()
      }
    } catch (error) {
      console.error("Failed to reset password:", error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setResetSuccess(false)
        setResetDetails([])
      }, 10000)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError("")

    if (!newPassword || !confirmPassword) {
      setPasswordError("Por favor completa ambos campos")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (!selectedUser) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          newPassword,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setResetMessage(`Contraseña actualizada para ${selectedUser.email}`)
        setResetSuccess(true)
        setShowChangePasswordDialog(false)
        setNewPassword("")
        setConfirmPassword("")
        setSelectedUser(null)
        await loadUsers()
      } else {
        setPasswordError(result.error || "Error al cambiar la contraseña")
      }
    } catch (error) {
      setPasswordError("Error al cambiar la contraseña")
      console.error("Failed to change password:", error)
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setResetSuccess(false)
      }, 5000)
    }
  }

  const openChangePasswordDialog = (user: User) => {
    setSelectedUser(user)
    setNewPassword("")
    setConfirmPassword("")
    setPasswordError("")
    setShowChangePasswordDialog(true)
  }

  const openEditUserDialog = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setShowEditUserDialog(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    setPasswordError("")

    try {
      // Validar email único
      const existingUser = userStore.getUserByEmail(editFormData.email)
      if (existingUser && existingUser.id !== selectedUser.id) {
        setPasswordError("Ya existe un usuario con este correo electrónico")
        setIsLoading(false)
        return
      }

      // Actualizar usuario
      const updates = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        status: editFormData.status
      }

      const updatedUser = userStore.updateUser(selectedUser.id, updates)
      
      if (updatedUser) {
        setResetSuccess(true)
        setResetMessage(`Usuario "${editFormData.name}" actualizado exitosamente`)
        setShowEditUserDialog(false)
        loadUsers() // Recargar lista
      } else {
        setPasswordError("Error al actualizar el usuario")
      }
    } catch (error) {
      setPasswordError("Error al actualizar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setIsLoading(true)

    try {
      const success = userStore.deleteUser(selectedUser.id)
      
      if (success) {
        setResetSuccess(true)
        setResetMessage(`Usuario "${selectedUser.name}" eliminado exitosamente`)
        setShowDeleteDialog(false)
        loadUsers() // Recargar lista
      } else {
        setPasswordError("Error al eliminar el usuario")
      }
    } catch (error) {
      setPasswordError("Error al eliminar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      supervisor: "bg-blue-100 text-blue-800",
      agent: "bg-green-100 text-green-800",
    }
    const labels = {
      admin: "Administrador",
      supervisor: "Supervisor",
      agent: "Agente",
    }
    return <Badge className={colors[role as keyof typeof colors]}>{labels[role as keyof typeof labels]}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra usuarios y contraseñas del sistema</p>
        </div>

        {resetSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div>{resetMessage}</div>
              {resetDetails.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="font-semibold">Contraseñas temporales generadas:</p>
                  <div className="bg-white p-3 rounded border border-green-200 max-h-48 overflow-y-auto">
                    {resetDetails.map((detail, idx) => (
                      <div key={idx} className="text-sm font-mono mb-2">
                        <span className="font-semibold">{detail.email}:</span> {detail.tempPassword}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs">Guarda estas contraseñas temporales antes de que desaparezcan.</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuarios del Sistema</CardTitle>
                <CardDescription>Total: {users.length} usuarios</CardDescription>
              </div>
              <Button
                onClick={() => setShowResetAllDialog(true)}
                variant="destructive"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Key className="h-4 w-4 mr-2" />
                Resetear Todas las Contraseñas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o correo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    <TableHead>Contraseña Cambiada</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No se encontraron usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{formatDate(user.lastLogin)}</TableCell>
                        <TableCell className="text-sm text-gray-600">{formatDate(user.passwordLastChanged)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                              disabled={isLoading}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openChangePasswordDialog(user)}
                              disabled={isLoading}
                            >
                              <Key className="h-3 w-3 mr-1" />
                              Contraseña
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(user)}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <Edit className="h-4 w-4 mt-0.5 text-blue-600" />
              <p>
                <strong>Cambiar:</strong> Permite establecer una contraseña personalizada para un usuario específico.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <RefreshCw className="h-4 w-4 mt-0.5 text-blue-600" />
              <p>
                <strong>Resetear:</strong> Genera una contraseña temporal aleatoria que se muestra en pantalla.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Key className="h-4 w-4 mt-0.5 text-blue-600" />
              <p>Los usuarios deberán cambiar su contraseña temporal en el primer inicio de sesión por seguridad.</p>
            </div>
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-600" />
              <p>
                Esta acción no se puede deshacer. Asegúrate de notificar a los usuarios antes de realizar cambios
                masivos.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Reset All Dialog */}
      <AlertDialog open={showResetAllDialog} onOpenChange={setShowResetAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              ¿Resetear todas las contraseñas?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Esta acción reseteará las contraseñas de <strong>{users.length} usuarios</strong> en el sistema.
              </p>
              <p>Se generarán contraseñas temporales aleatorias que se mostrarán en pantalla.</p>
              <p className="text-red-600 font-medium">Esta acción no se puede deshacer. ¿Estás seguro de continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetAllPasswords} className="bg-red-600 hover:bg-red-700">
              Sí, Resetear Todas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Establece una nueva contraseña para {selectedUser?.name} ({selectedUser?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                disabled={isLoading}
              />
            </div>
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangePasswordDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Editar Usuario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del usuario"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Correo Electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Rol</Label>
              <select
                id="edit-role"
                value={editFormData.role}
                onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value as "admin" | "agent" | "supervisor" }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="agent">Agente</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-status">Estado</Label>
              <select
                id="edit-status"
                value={editFormData.status}
                onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as "active" | "inactive" }))}
                className="w-full p-2 border rounded-md"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            {passwordError && (
              <Alert>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trash2 className="h-5 w-5 mr-2 text-red-600" />
              Eliminar Usuario
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser?.name}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              Esta acción no se puede deshacer y eliminará permanentemente el usuario del sistema.
            </p>
            {passwordError && (
              <Alert>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleDeleteUser} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Eliminando..." : "Eliminar Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Procesando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
