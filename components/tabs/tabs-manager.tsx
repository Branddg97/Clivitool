"use client"

import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { processList } from "@/lib/processes-data"

interface Tab {
  id: string
  title: string
  path: string
  type: "process" | "dashboard" | "search" | "category" | "profile"
  processId?: string
}

interface TabsContextType {
  tabs: Tab[]
  activeTabId: string | null
  openTab: (tab: Omit<Tab, "id">) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void
  getTabTitle: (path: string) => string
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function useTabs() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error("useTabs must be used within TabsProvider")
  }
  return context
}

// Hook seguro que retorna null si el contexto no está disponible
export function useTabsSafe() {
  const context = useContext(TabsContext)
  return context || null
}

export function TabsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  // Obtener título del proceso
  const getProcessTitle = (processId: string): string => {
    for (const category of Object.values(processList)) {
      const process = category.find((p) => p.id === processId)
      if (process) return process.title
    }
    return "Proceso"
  }

  // Obtener título de la ruta
  const getTabTitle = (path: string): string => {
    if (path === "/dashboard") return "Dashboard"
    if (path === "/profile") return "Perfil"
    if (path.startsWith("/search")) return "Búsqueda"
    if (path.startsWith("/processes/")) {
      const categoryId = path.split("/processes/")[1]
      return categoryId || "Categoría"
    }
    if (path.startsWith("/process/")) {
      const processId = path.split("/process/")[1]
      return getProcessTitle(processId)
    }
    return "Página"
  }

  // Abrir una nueva pestaña
  const openTab = (tab: Omit<Tab, "id">) => {
    // Solo permitir pestañas de dashboard, process o category
    if (tab.type !== "dashboard" && tab.type !== "process" && tab.type !== "category") {
      return
    }

    // Limitar a máximo 5 pestañas
    if (tabs.length >= 5) {
      alert('Máximo de 5 pestañas permitidas. Cierra una pestaña para abrir otra.')
      return
    }

    const tabId = `${tab.type}-${Date.now()}`
    const newTab: Tab = {
      ...tab,
      id: tabId,
      title: tab.title || getTabTitle(tab.path),
    }

    setTabs((prev) => {
      // Para dashboard, permitir múltiples pestañas con el mismo path pero diferente ID
      if (tab.type === "dashboard") {
        // Agregar nueva pestaña de dashboard
        return [...prev, newTab]
      }
      
      // Para process y category, verificar si ya existe una pestaña con la misma ruta
      const existingTab = prev.find((t) => t.path === tab.path && t.type === tab.type)
      if (existingTab) {
        setActiveTabId(existingTab.id)
        return prev
      }
      // Agregar nueva pestaña
      return [...prev, newTab]
    })

    setActiveTabId(tabId)
    router.push(tab.path)
  }

  // Cerrar una pestaña
  const closeTab = (tabId: string) => {
    setTabs((prev) => {
      const filtered = prev.filter((t) => t.id !== tabId)
      
      // Si se cierra la pestaña activa, activar otra
      if (activeTabId === tabId) {
        if (filtered.length > 0) {
          const lastTab = filtered[filtered.length - 1]
          setActiveTabId(lastTab.id)
          router.push(lastTab.path)
        } else {
          // Si no hay más pestañas, ir al dashboard
          setActiveTabId(null)
          router.push("/dashboard")
        }
      }
      
      return filtered
    })
  }

  // Establecer pestaña activa
  const setActiveTab = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId)
    if (tab) {
      setActiveTabId(tabId)
      router.push(tab.path)
    }
  }

  // Sincronizar pestaña activa con la ruta actual
  useEffect(() => {
    if (tabs.length === 0) return

    const currentTab = tabs.find((t) => t.path === pathname)
    if (currentTab && currentTab.id !== activeTabId) {
      setActiveTabId(currentTab.id)
    }
  }, [pathname, tabs, activeTabId])

  // Cargar pestañas desde localStorage al iniciar
  useEffect(() => {
    // Solo cargar pestañas si hay usuario logueado
    if (typeof window !== 'undefined') {
      const user = sessionStorage.getItem("user")
      const pathname = window.location.pathname
      
      if (!user || pathname === '/login') {
        return // No cargar pestañas si no hay usuario o estamos en login
      }
    }

    const savedTabs = localStorage.getItem("openTabs")
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs)
        // Filtrar solo pestañas válidas (dashboard, process, category)
        const validTabs = parsedTabs.filter((t: Tab) => 
          t.type === "dashboard" || 
          t.type === "process" || 
          t.type === "category"
        )
        
        if (validTabs.length > 0) {
          setTabs(validTabs)
          const currentTab = validTabs.find((t: Tab) => t.path === pathname)
          if (currentTab) {
            setActiveTabId(currentTab.id)
          } else {
            // Si la ruta actual no está en las pestañas válidas, crear una nueva solo si es dashboard o process
            let tabType: Tab["type"] = "dashboard"
            let processId: string | undefined

            if (pathname.startsWith("/process/")) {
              tabType = "process"
              processId = pathname.split("/process/")[1]
            } else if (pathname.startsWith("/processes/")) {
              tabType = "category"
            } else if (pathname === "/dashboard") {
              tabType = "dashboard"
            } else {
              return // No crear pestaña para otras rutas
            }

            const newTab: Tab = {
              id: `${tabType}-${Date.now()}`,
              title: getTabTitle(pathname),
              path: pathname,
              type: tabType,
              processId,
            }
            setTabs([...validTabs, newTab])
            setActiveTabId(newTab.id)
          }
        }
      } catch (error) {
        console.error("Error loading tabs:", error)
      }
    }
    
    // Si no hay pestañas guardadas y estamos en dashboard, crear una pestaña de dashboard
    if (!savedTabs && typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const user = sessionStorage.getItem("user")
      
      if (user && pathname === "/dashboard") {
        const dashboardTab: Tab = {
          id: "dashboard-initial",
          title: "Dashboard",
          path: "/dashboard",
          type: "dashboard",
        }
        setTabs([dashboardTab])
        setActiveTabId(dashboardTab.id)
      }
    }
  }, [])

  // Guardar pestañas en localStorage
  useEffect(() => {
    if (tabs.length > 0) {
      // Solo guardar pestañas válidas
      const validTabs = tabs.filter(t => 
        t.type === "dashboard" || 
        t.type === "process" || 
        t.type === "category"
      )
      localStorage.setItem("openTabs", JSON.stringify(validTabs))
    }
  }, [tabs])

  return (
    <TabsContext.Provider
      value={{
        tabs,
        activeTabId,
        openTab,
        closeTab,
        setActiveTab,
        getTabTitle,
      }}
    >
      {children}
    </TabsContext.Provider>
  )
}

export function ConditionalTabsHeader() {
  const { tabs } = useTabs()
  
  // Solo mostrar pestañas si hay un usuario logueado y no estamos en login
  if (typeof window !== 'undefined') {
    const user = sessionStorage.getItem("user")
    const pathname = window.location.pathname
    
    if (!user || pathname === '/login') {
      return null
    }
  }
  
  return <TabsHeader />
}

export function TabsHeader() {
  const { tabs, activeTabId, closeTab, setActiveTab, openTab } = useTabs()

  const openNewTab = () => {
    // Limitar a máximo 5 pestañas
    if (tabs.length >= 5) {
      alert('Máximo de 5 pestañas permitidas. Cierra una pestaña para abrir otra.')
      return
    }

    // Crear nuevo dashboard con nombre único
    const dashboardNumber = tabs.filter(t => t.type === "dashboard").length + 1
    openTab({
      title: `Dashboard ${dashboardNumber}`,
      path: "/dashboard",
      type: "dashboard",
    })
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto tabs-scroll">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors cursor-pointer
                ${
                  activeTabId === tab.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-sm font-medium whitespace-nowrap truncate max-w-[200px]">
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="ml-1 hover:bg-gray-200 rounded p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {/* Botón para nueva pestaña */}
          <button
            onClick={openNewTab}
            className="flex items-center space-x-1 px-4 py-2 border-b-2 border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
            title="Nueva pestaña"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Nueva pestaña</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function TabsBar() {
  const { tabs, activeTabId, closeTab, setActiveTab } = useTabs()

  if (tabs.length === 0) return null

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto tabs-scroll">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors cursor-pointer
                ${
                  activeTabId === tab.id
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-transparent hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                }
              `}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-sm font-medium whitespace-nowrap truncate max-w-[200px]">
                {tab.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="ml-1 hover:bg-gray-200 rounded p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

