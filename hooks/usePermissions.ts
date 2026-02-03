"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { clientAuth } from "@/lib/client-auth"
import { canAccessRoute, type UserRole } from "@/lib/permissions"

export function usePermissions() {
  const router = useRouter()
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPermissions = () => {
      const user = clientAuth.getCurrentUser()
      
      if (!user) {
        // Si no hay usuario, redirigir al login (excepto si ya estamos en login)
        if (pathname !== "/login") {
          router.push("/login")
        }
        setIsLoading(false)
        return
      }

      // Establecer el rol del usuario
      setUserRole(user.role as UserRole)

      // Verificar si puede acceder a la ruta actual
      if (!canAccessRoute(user.role as UserRole, pathname)) {
        // Si no puede acceder, redirigir al dashboard
        router.push("/dashboard")
      }

      setIsLoading(false)
    }

    checkPermissions()
  }, [pathname, router])

  return {
    userRole,
    isLoading,
    hasPermission: (permission: string) => {
      if (!userRole) return false
      // Aquí puedes implementar la lógica de permisos específicos
      return true // Por ahora, todos los usuarios logueados tienen permisos básicos
    }
  }
}
