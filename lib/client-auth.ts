// Client-side authentication for static export
import { userStore, type User } from "@/lib/user-store"

export interface AuthResult {
  success: boolean
  data?: Omit<User, 'password'>
  error?: string
}

export const clientAuth = {
  // Verificar credenciales del lado del cliente
  login: async (email: string, password: string): Promise<AuthResult> => {
    try {
      // Validación básica
      if (!email || !password) {
        return {
          success: false,
          error: "Email y contraseña son requeridos"
        }
      }

      // Verificar credenciales usando el userStore
      const isValid = userStore.verifyPassword(email, password)
      
      if (!isValid) {
        return {
          success: false,
          error: "Credenciales incorrectas"
        }
      }

      // Obtener datos del usuario
      const user = userStore.getUserByEmail(email)
      if (!user) {
        return {
          success: false,
          error: "Usuario no encontrado"
        }
      }

      // Actualizar último login
      userStore.updateLastLogin(user.id)

      // Retornar datos del usuario (sin contraseña)
      const { password: _, ...userWithoutPassword } = user

      return {
        success: true,
        data: userWithoutPassword
      }
    } catch (error) {
      return {
        success: false,
        error: "Error al iniciar sesión"
      }
    }
  },

  // Verificar si hay usuario en sesión
  getCurrentUser: (): Omit<User, 'password'> | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const userStr = sessionStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  },

  // Cerrar sesión
  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("user")
      window.location.href = "/login"
    }
  }
}
