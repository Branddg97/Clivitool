import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NavigationCards } from "@/components/dashboard/navigation-cards"
import { QuickSearch } from "@/components/dashboard/quick-search"
import { RecentProcesses } from "@/components/dashboard/recent-processes"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido al Hub de Agentes</h1>
          <p className="text-gray-600">Navegue rápidamente por los procesos de atención al cliente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickSearch />
            <NavigationCards />
          </div>

          <div className="space-y-8">
            <RecentProcesses />
          </div>
        </div>
      </main>
    </div>
  )
}
