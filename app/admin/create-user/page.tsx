"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserPlus, Eye, EyeOff, Edit, Bug } from "lucide-react"
import { userStore, type User } from "@/lib/user-store"

interface CreateUserData {
  name: string
  email: string
  password: string
  role: "admin" | "agent" | "supervisor"
  status: "active" | "inactive"
}

interface EditUserData {
  name: string
  email: string
  password?: string
  role: "admin" | "agent" | "supervisor"
  status: "active" | "inactive"
}

interface UserWithoutPassword {
  id: string
  name: string
  email: string
  role: "admin" | "agent" | "supervisor"
  status: "active" | "inactive"
  lastLogin: string
  passwordLastChanged: string
}

export default function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    role: "agent",
    status: "active"
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [createdUsers, setCreatedUsers] = useState<UserWithoutPassword[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editFormData, setEditFormData] = useState<EditUserData>({
    name: "",
    email: "",
    password: "",
    role: "agent",
    status: "active"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Validación básica
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Por favor, completa todos los campos")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setMessage("Por favor, ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = userStore.getUserByEmail(formData.email)
      if (existingUser) {
        setMessage("Ya existe un usuario con este correo electrónico")
        setIsLoading(false)
        return
      }

      // Crear nuevo usuario
      const newUser = userStore.addUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: formData.status
      })
      
      setCreatedUsers(prev => [...prev, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastLogin: newUser.lastLogin,
        passwordLastChanged: ""
      }])
      
      setMessage(`Usuario "${formData.name}" creado exitosamente`)
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "agent",
        status: "active"
      })
    } catch (error) {
      setMessage("Error al crear el usuario. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setEditFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status
    })
    setShowEditDialog(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!editingUser) return

    // Validación básica
    if (!editFormData.name || !editFormData.email) {
      setMessage("Por favor, completa todos los campos requeridos")
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editFormData.email)) {
      setMessage("Por favor, ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    if (editFormData.password && editFormData.password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      // Verificar si el email ya existe (y no es el mismo usuario)
      const existingUser = userStore.getUserByEmail(editFormData.email)
      if (existingUser && existingUser.id !== editingUser.id) {
        setMessage("Ya existe un usuario con este correo electrónico")
        setIsLoading(false)
        return
      }

      // Actualizar usuario
      const updates: Partial<Omit<User, 'id' | 'lastLogin' | 'passwordLastChanged'>> = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        status: editFormData.status
      }

      // Solo incluir contraseña si se proporcionó
      if (editFormData.password) {
        updates.password = editFormData.password
      }

      const updatedUser = userStore.updateUser(editingUser.id, updates)
      
      if (updatedUser) {
        setMessage(`Usuario "${editFormData.name}" actualizado exitosamente`)
        setShowEditDialog(false)
        setEditingUser(null)
        setEditFormData({
          name: "",
          email: "",
          password: "",
          role: "agent",
          status: "active"
        })
      } else {
        setMessage("Error al actualizar el usuario")
      }
    } catch (error) {
      setMessage("Error al actualizar el usuario. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800"
      case "supervisor": return "bg-purple-100 text-purple-800"
      case "agent": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrador"
      case "supervisor": return "Supervisor"
      case "agent": return "Agente"
      default: return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Usuario</h1>
          <p className="text-gray-600">Agrega nuevos usuarios al sistema con roles específicos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de creación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Información del Usuario
              </CardTitle>
              <CardDescription>
                Completa los datos para crear un nuevo usuario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value: "admin" | "agent" | "supervisor") => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agente - Acceso limitado a procesos</SelectItem>
                      <SelectItem value="supervisor">Supervisor - Acceso limitado a procesos</SelectItem>
                      <SelectItem value="admin">Administrador - Acceso completo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {message && (
                  <Alert>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creando usuario..." : "Crear Usuario"}
                </Button>
              </form>
            </CardContent>
          </Card>

            {/* Botón de debug */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="h-5 w-5 mr-2" />
                  Debug Storage
                </CardTitle>
                <CardDescription>
                  Herramientas para depurar el almacenamiento de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={() => userStore.debugStorage()}
                  className="w-full"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Ver Debug en Consola
                </Button>
              </CardContent>
            </Card>

            {/* Usuarios existentes */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Existentes</CardTitle>
              <CardDescription>
                Lista de usuarios en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userStore.getAllUsers().map((user) => {
                  const userWithPassword = userStore.getUserByEmail(user.email)
                  if (!userWithPassword) return null
                  
                  return (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(userWithPassword)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Usuarios creados recientemente */}
          <Card>
            <CardHeader>
              <CardTitle>Usuarios Creados Recientemente</CardTitle>
              <CardDescription>
                Lista de usuarios agregados en esta sesión
              </CardDescription>
            </CardHeader>
            <CardContent>
              {createdUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay usuarios creados todavía
                </p>
              ) : (
                <div className="space-y-3">
                  {createdUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información de roles */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información de Roles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Agente</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Acceso a dashboard</li>
                  <li>• Puede ver y ejecutar procesos</li>
                  <li>• Puede usar pestañas de procesos</li>
                  <li>• Puede iniciar y cerrar sesión</li>
                  <li>• Puede ver su perfil</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Supervisor</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Acceso a dashboard</li>
                  <li>• Puede ver y ejecutar procesos</li>
                  <li>• Puede usar pestañas de procesos</li>
                  <li>• Puede iniciar y cerrar sesión</li>
                  <li>• Puede ver su perfil</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Administrador</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Acceso completo a toda la herramienta</li>
                  <li>• Puede gestionar usuarios</li>
                  <li>• Puede crear y editar procesos</li>
                  <li>• Acceso a panel de administración</li>
                  <li>• Todas las funciones de agente y supervisor</li>
                </ul>
              </div>
            </div>

            {/* Formulario simplificado para registro rápido */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Registro Rápido de Usuario
                </CardTitle>
                <CardDescription>
                  Formulario simplificado para crear usuarios rápidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quick-name">Nombre Completo</Label>
                      <Input
                        id="quick-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="quick-email">Correo Electrónico</Label>
                      <Input
                        id="quick-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="usuario@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quick-password">Contraseña</Label>
                      <div className="relative">
                        <Input
                          id="quick-password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="quick-role">Rol</Label>
                      <Select value={formData.role} onValueChange={(value: "admin" | "agent" | "supervisor") => setFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agent">Agente - Acceso limitado a procesos</SelectItem>
                          <SelectItem value="supervisor">Supervisor - Acceso limitado a procesos</SelectItem>
                          <SelectItem value="admin">Administrador - Acceso completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creando usuario..." : "Crear Usuario"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Diálogo de edición de usuario */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Editar Usuario</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Nombre Completo</Label>
                      <Input
                        id="edit-name"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Juan Pérez"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Correo Electrónico</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="usuario@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-password">Nueva Contraseña (dejar en blanco para mantener)</Label>
                      <div className="relative">
                        <Input
                          id="edit-password"
                          type={showPassword ? "text" : "password"}
                          value={editFormData.password}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Mínimo 6 caracteres"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-role">Rol</Label>
                      <Select value={editFormData.role} onValueChange={(value: "admin" | "agent" | "supervisor") => setEditFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agent">Agente - Acceso limitado a procesos</SelectItem>
                          <SelectItem value="supervisor">Supervisor - Acceso limitado a procesos</SelectItem>
                          <SelectItem value="admin">Administrador - Acceso completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-status">Estado</Label>
                    <Select value={editFormData.status} onValueChange={(value: "active" | "inactive") => setEditFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {message && (
                    <Alert>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Actualizando usuario..." : "Actualizar Usuario"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
