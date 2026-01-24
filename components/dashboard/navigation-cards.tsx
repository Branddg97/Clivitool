"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Edit,
  RefreshCw,
  CreditCard,
  Phone,
  AlertTriangle,
  FileText,
  Users,
  UserMinus,
  Pill,
  Truck,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { processCategories } from "@/lib/processes-data"
import { useTabs } from "@/components/tabs/tabs-manager"

const iconMap: Record<string, any> = {
  Shield,
  Edit,
  RefreshCw,
  CreditCard,
  Phone,
  AlertTriangle,
  FileText,
  Users,
  UserMinus,
  Pill,
  Truck,
  ShoppingCart,
  TrendingUp,
}

export function NavigationCards() {
  const { openTab } = useTabs()

  const handleCardClick = (categoryId: string, categoryTitle: string) => {
    openTab({
      title: categoryTitle,
      path: `/processes/${categoryId}`,
      type: "category",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Categorías de Procesos</h2>
        <Badge variant="secondary" className="text-sm">
          {processCategories.reduce((acc, cat) => acc + cat.processes, 0)} procesos disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {processCategories.map((category) => {
          const IconComponent = iconMap[category.icon] || Pill
          return (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-l-transparent hover:border-l-purple-500"
              onClick={() => handleCardClick(category.id, category.title)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{category.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {category.processes} proceso{category.processes !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600 mt-2">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Tiempo promedio:</span>
                  <span className="font-medium text-gray-700">{category.avgTime}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
