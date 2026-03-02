import { ProcessList } from "@/components/processes/process-list"
import { ProcessBreadcrumb } from "@/components/processes/process-breadcrumb"
import { processCategories } from "@/lib/processes-data"

interface ProcessCategoryPageProps {
  params: {
    category: string
  }
}

export function generateStaticParams() {
  return processCategories.map((category) => ({
    category: category.id,
  }))
}

export default function ProcessCategoryPage({ params }: ProcessCategoryPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProcessBreadcrumb category={params.category} />
        <ProcessList category={params.category} />
      </div>
    </div>
  )
}
