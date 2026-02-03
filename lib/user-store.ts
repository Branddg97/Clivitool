// In-memory user store for demo purposes
// In production, this would be replaced with a real database

export interface User {
  id: string
  name: string
  email: string
  password: string // In production, this would be hashed
  role: "admin" | "agent" | "supervisor"
  status: "active" | "inactive"
  lastLogin: string
  passwordLastChanged: string
}

// Initial mock users with passwords
const initialUsers: User[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@clivi.com",
    password: "password", // In production, this would be hashed
    role: "supervisor",
    status: "active",
    lastLogin: "2024-01-20T14:30:00Z",
    passwordLastChanged: "2023-12-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Carlos Martínez",
    email: "carlos.martinez@clivi.com",
    password: "password",
    role: "agent",
    status: "active",
    lastLogin: "2024-01-20T15:45:00Z",
    passwordLastChanged: "2023-11-15T09:30:00Z",
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@clivi.com",
    password: "password",
    role: "agent",
    status: "active",
    lastLogin: "2024-01-20T13:20:00Z",
    passwordLastChanged: "2024-01-05T11:00:00Z",
  },
  {
    id: "4",
    name: "Luis Hernández",
    email: "luis.hernandez@clivi.com",
    password: "password",
    role: "agent",
    status: "active",
    lastLogin: "2024-01-19T16:00:00Z",
    passwordLastChanged: "2023-10-20T14:00:00Z",
  },
  {
    id: "5",
    name: "Admin Sistema",
    email: "admin@clivi.com",
    password: "admin123",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-20T16:00:00Z",
    passwordLastChanged: "2024-01-10T08:00:00Z",
  },
  {
    id: "6",
    name: "Brandon Ramos",
    email: "brandon.ramos@evolvecx.io",
    password: "12345",
    role: "admin",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Rodrigo Castro",
    email: "rodrigo.castro@evolvecx.io",
    password: "123456",
    role: "agent",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Prueba Usuario",
    email: "prueba@evolvecx.io",
    password: "123456",
    role: "agent",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date().toISOString(),
  },
]

// Helper functions for localStorage persistence
const STORAGE_KEY = 'clivi_users'

const saveUsersToStorage = (users: User[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error("Error guardando usuarios:", error)
    }
  }
}

const loadUsersFromStorage = (): User[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error)
    }
  }
  return []
}

// Initialize users from storage or use initial users
let users: User[] = loadUsersFromStorage()
if (users.length === 0) {
  users = [...initialUsers]
  saveUsersToStorage(users)
}

export const userStore = {
  // Get all users (without passwords for security)
  getAllUsers: () => {
    return users.map(({ password, ...user }) => user)
  },

  // Get user by email (with password for authentication)
  getUserByEmail: (email: string) => {
    return users.find((user) => user.email === email)
  },

  // Get user by ID (without password)
  getUserById: (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return null
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // Add new user
  addUser: (user: Omit<User, 'id' | 'lastLogin' | 'passwordLastChanged'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      lastLogin: new Date().toISOString(),
      passwordLastChanged: new Date().toISOString(),
    }
    users.push(newUser)
    saveUsersToStorage(users) // Save to localStorage
    return newUser
  },

  // Update user password
  updatePassword: (userId: string, newPassword: string) => {
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return false

    users[userIndex] = {
      ...users[userIndex],
      password: newPassword, // In production, hash this
      passwordLastChanged: new Date().toISOString(),
    }
    saveUsersToStorage(users) // Save to localStorage
    return true
  },

  // Reset password to temporary value
  resetPassword: (userId: string) => {
    const tempPassword = generateTemporaryPassword()
    const success = userStore.updatePassword(userId, tempPassword)
    return success ? tempPassword : null
  },

  // Reset all passwords
  resetAllPasswords: () => {
    const results = users.map((user) => {
      const tempPassword = generateTemporaryPassword()
      userStore.updatePassword(user.id, tempPassword)
      return {
        userId: user.id,
        email: user.email,
        tempPassword,
      }
    })
    return results
  },

  // Verify password
  verifyPassword: (email: string, password: string) => {
    console.log("=== VERIFY PASSWORD ===")
    console.log("Email buscado:", email)
    console.log("Password ingresado:", password)
    
    const user = users.find((u) => u.email === email)
    
    if (!user) {
      console.log("❌ Usuario no encontrado para email:", email)
      console.log("Emails disponibles:", users.map(u => u.email))
      return false
    }
    
    console.log("✅ Usuario encontrado:", { id: user.id, email: user.email, role: user.role })
    console.log("Password guardado:", user.password)
    console.log("Password ingresado:", password)
    
    // In production, use bcrypt.compare()
    const isValid = user.password === password
    console.log("❓ Password válido:", isValid)
    console.log("========================")
    
    return isValid
  },

  // Update last login
  updateLastLogin: (userId: string) => {
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return false

    users[userIndex] = {
      ...users[userIndex],
      lastLogin: new Date().toISOString(),
    }
    return true
  },

  // Update user
  updateUser: (userId: string, updates: Partial<Omit<User, 'id' | 'lastLogin' | 'passwordLastChanged'>>) => {
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    const updatedUser = {
      ...users[userIndex],
      ...updates,
      passwordLastChanged: updates.password ? new Date().toISOString() : users[userIndex].passwordLastChanged,
    }

    users[userIndex] = updatedUser
    saveUsersToStorage(users) // Save to localStorage
    return updatedUser
  },

  // Delete user
  deleteUser: (userId: string) => {
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return false
    users.splice(userIndex, 1)
    saveUsersToStorage(users) // Save to localStorage
    return true
  },

  // Debug method to check localStorage
  debugStorage: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      console.log("=== DEBUG STORAGE ===")
      console.log("localStorage tiene datos:", !!stored)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          console.log("Usuarios en localStorage:", parsed.map((u: User) => ({ id: u.id, email: u.email, role: u.role, status: u.status })))
        } catch (error) {
          console.error("Error parseando localStorage:", error)
        }
      }
      console.log("Usuarios en memoria:", users.map((u: User) => ({ id: u.id, email: u.email, role: u.role, status: u.status })))
      console.log("===================")
    }
  },
}

// Generate a random temporary password
function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  let password = ""
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
