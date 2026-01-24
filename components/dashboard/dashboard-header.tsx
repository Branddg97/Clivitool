"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, HelpCircle, Plus, Search, LayoutDashboard, FolderOpen } from "lucide-react"
import Image from "next/image"
import { useTabsSafe } from "@/components/tabs/tabs-manager"
import { processCategories } from "@/lib/processes-data"

interface UserData {
  id: string
  name: string
  email: string
  role: string
}

export function DashboardHeader() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Obtener el contexto de pestañas de forma segura
  const tabsContext = useTabsSafe()
  const openTab = tabsContext?.openTab || null
  
  // Debug: verificar si el contexto está disponible
  useEffect(() => {
    console.log("DashboardHeader mounted, tabsContext:", tabsContext, "openTab:", openTab)
  }, [tabsContext, openTab])

  useEffect(() => {
    // Obtener datos del usuario desde sessionStorage
    const userData = sessionStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "AG"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleLogout = () => {
    // Limpiar datos de sesión
    sessionStorage.removeItem("user")
    // Redirigir al login
    router.push("/")
  }

  const handleOpenSearch = () => {
    console.log("handleOpenSearch called, openTab:", openTab, "tabsContext:", tabsContext)
    // Cerrar el menú después de un pequeño delay para asegurar que la acción se ejecute
    setTimeout(() => {
      setIsMenuOpen(false)
    }, 100)
    
    if (openTab) {
      console.log("Calling openTab for search")
      try {
        openTab({
          title: "Búsqueda",
          path: "/search",
          type: "search",
        })
      } catch (error) {
        console.error("Error opening tab:", error)
        router.push("/search")
      }
    } else {
      console.log("openTab not available, using router")
      router.push("/search")
    }
  }

  const handleOpenDashboard = () => {
    console.log("handleOpenDashboard called, openTab:", openTab, "tabsContext:", tabsContext)
    setTimeout(() => {
      setIsMenuOpen(false)
    }, 100)
    
    if (openTab) {
      console.log("Calling openTab for dashboard")
      try {
        openTab({
          title: "Dashboard",
          path: "/dashboard",
          type: "dashboard",
        })
      } catch (error) {
        console.error("Error opening tab:", error)
        router.push("/dashboard")
      }
    } else {
      console.log("openTab not available, using router")
      router.push("/dashboard")
    }
  }

  const handleOpenCategory = (categoryId: string, categoryTitle: string) => {
    console.log("handleOpenCategory called:", categoryId, categoryTitle, "openTab:", openTab)
    setTimeout(() => {
      setIsMenuOpen(false)
    }, 100)
    
    if (openTab) {
      console.log("Calling openTab for category")
      try {
        openTab({
          title: categoryTitle,
          path: `/processes/${categoryId}`,
          type: "category",
        })
      } catch (error) {
        console.error("Error opening tab:", error)
        router.push(`/processes/${categoryId}`)
      }
    } else {
      console.log("openTab not available, using router")
      router.push(`/processes/${categoryId}`)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Image src="/images/clivi-logo.png" alt="Clivi Logo" width={100} height={40} priority />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Agent Hub</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Pestaña
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56" 
                align="end" 
                onCloseAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={(e) => {
                  // Permitir que el menú se cierre normalmente
                }}
              >
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    handleOpenDashboard()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    handleOpenDashboard()
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault()
                    handleOpenSearch()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    handleOpenSearch()
                  }}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>Búsqueda</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                  Categorías
                </div>
                {processCategories.slice(0, 6).map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onSelect={(e) => {
                      e.preventDefault()
                      handleOpenCategory(category.id, category.title)
                    }}
                    onClick={(e) => {
                      e.preventDefault()
                      handleOpenCategory(category.id, category.title)
                    }}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    <span className="truncate">{category.title}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ayuda
            </Button>

            <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/admin/processes")}>
              Administrar Procesos
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Menú de usuario"
                >
                  <Avatar className="h-10 w-10 pointer-events-none">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                      {user ? getInitials(user.name) : "AG"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name || "Usuario"}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email || "usuario@clivi.com"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
