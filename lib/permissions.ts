// Sistema de permisos y roles
export type UserRole = "admin" | "agent" | "supervisor"

export interface Permission {
  canViewAdmin: boolean
  canManageUsers: boolean
  canManageProcesses: boolean
  canViewProcesses: boolean
  canAccessDashboard: boolean
  canViewProfile: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  admin: {
    canViewAdmin: true,
    canManageUsers: true,
    canManageProcesses: true,
    canViewProcesses: true,
    canAccessDashboard: true,
    canViewProfile: true,
  },
  supervisor: {
    canViewAdmin: false,
    canManageUsers: false,
    canManageProcesses: false,
    canViewProcesses: true,
    canAccessDashboard: true,
    canViewProfile: true,
  },
  agent: {
    canViewAdmin: false,
    canManageUsers: false,
    canManageProcesses: false,
    canViewProcesses: true,
    canAccessDashboard: true,
    canViewProfile: true,
  },
}

export function hasPermission(userRole: UserRole, permission: keyof Permission): boolean {
  return ROLE_PERMISSIONS[userRole][permission]
}

export function canAccessRoute(userRole: UserRole, path: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole]
  
  if (path.startsWith("/admin")) {
    return permissions.canViewAdmin
  }
  
  if (path.startsWith("/process") || path.startsWith("/processes")) {
    return permissions.canViewProcesses
  }
  
  if (path === "/dashboard") {
    return permissions.canAccessDashboard
  }
  
  if (path === "/profile") {
    return permissions.canViewProfile
  }
  
  // Rutas permitidas para todos
  return ["/login", "/"].includes(path)
}
