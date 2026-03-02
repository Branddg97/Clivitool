import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { processCategories } from "@/lib/processes-data"

interface ProcessBreadcrumbProps {
  category: string
  processTitle?: string
}

export function ProcessBreadcrumb({ category, processTitle }: ProcessBreadcrumbProps) {
  const categoryInfo = processCategories.find((c) => c.id === category)

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <Link href="/dashboard" className="flex items-center hover:text-purple-600 transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/dashboard" className="hover:text-purple-600 transition-colors">
        Procesos
      </Link>
      {categoryInfo && (
        <>
          <ChevronRight className="h-4 w-4" />
          {processTitle ? (
            <Link href={`/processes/${category}`} className="hover:text-purple-600 transition-colors">
              {categoryInfo.title}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{categoryInfo.title}</span>
          )}
        </>
      )}
      {processTitle && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{processTitle}</span>
        </>
      )}
    </nav>
  )
}
