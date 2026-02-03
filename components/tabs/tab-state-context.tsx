"use client"

import { createContext, useContext, ReactNode, useState } from "react"

interface TabState {
  [tabId: string]: {
    currentProcess?: string
    navigationHistory: string[]
  }
}

interface TabContextType {
  tabStates: TabState
  updateTabState: (tabId: string, updates: Partial<TabState[string]>) => void
  getTabState: (tabId: string) => TabState[string]
}

const TabContext = createContext<TabContextType | undefined>(undefined)

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabStates, setTabStates] = useState<TabState>({})

  const updateTabState = (tabId: string, updates: Partial<TabState[string]>) => {
    setTabStates((prev: TabState) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        ...updates
      }
    }))
  }

  const getTabState = (tabId: string) => {
    return tabStates[tabId] || { navigationHistory: [] }
  }

  return (
    <TabContext.Provider value={{
      tabStates,
      updateTabState,
      getTabState
    }}>
      {children}
    </TabContext.Provider>
  )
}

export function useTabState() {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error("useTabState must be used within TabProvider")
  }
  return context
}
