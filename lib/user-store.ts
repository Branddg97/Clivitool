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
    role: "agent",
    status: "active",
    lastLogin: new Date().toISOString(),
    passwordLastChanged: new Date().toISOString(),
  },
]

// In-memory store
const users: User[] = [...initialUsers]

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

  // Update user password
  updatePassword: (userId: string, newPassword: string) => {
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return false

    users[userIndex] = {
      ...users[userIndex],
      password: newPassword, // In production, hash this
      passwordLastChanged: new Date().toISOString(),
    }
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
    const user = users.find((u) => u.email === email)
    if (!user) return false
    // In production, use bcrypt.compare()
    return user.password === password
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
