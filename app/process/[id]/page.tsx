import { DecisionTree } from "@/components/process/decision-tree"
import { ProcessHeader } from "@/components/process/process-header"
import { processList } from "@/lib/processes-data"

interface ProcessPageProps {
  params: {
    id: string
  }
}

export function generateStaticParams() {
  const allProcessIds: string[] = []
  
  Object.values(processList).forEach((processes) => {
    processes.forEach((process) => {
      allProcessIds.push(process.id)
    })
  })
  
  return allProcessIds.map((id) => ({
    id: id,
  }))
}

export default function ProcessPage({ params }: ProcessPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProcessHeader processId={params.id} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DecisionTree processId={params.id} />
      </main>
    </div>
  )
}
