import { NextResponse } from "next/server"

// Simulated analytics data
const analyticsData = {
  overview: {
    totalProcesses: 61,
    activeAgents: 24,
    completedToday: 187,
    avgResponseTime: 4.2,
    successRate: 94.3,
    totalUsageThisMonth: 2847,
  },
  processUsage: [
    { name: "Validación de INE", usage: 156, category: "Validaciones", avgTime: 4.2, successRate: 96.8 },
    { name: "Cambio de Correo", usage: 203, category: "Cambios de Datos", avgTime: 3.1, successRate: 98.2 },
    { name: "Reembolso por Cancelación", usage: 167, category: "Reembolsos", avgTime: 7.3, successRate: 89.4 },
    { name: "Cambio de Número", usage: 134, category: "Contacto", avgTime: 3.8, successRate: 95.1 },
    { name: "Problema con Pago", usage: 89, category: "Pagos", avgTime: 6.2, successRate: 87.6 },
  ],
  categoryPerformance: [
    { category: "Validaciones", processes: 12, usage: 456, avgTime: 4.1, successRate: 95.2 },
    { category: "Cambios de Datos", processes: 8, usage: 389, avgTime: 3.5, successRate: 96.8 },
    { category: "Reembolsos", processes: 6, usage: 234, avgTime: 7.8, successRate: 88.9 },
    { category: "Pagos", processes: 10, usage: 198, avgTime: 5.9, successRate: 89.3 },
    { category: "Contacto", processes: 4, usage: 167, avgTime: 3.2, successRate: 94.7 },
  ],
  timeSeriesData: [
    { date: "2024-01-08", completed: 145, avgTime: 4.5, errors: 8 },
    { date: "2024-01-09", completed: 167, avgTime: 4.2, errors: 6 },
    { date: "2024-01-10", completed: 189, avgTime: 4.1, errors: 12 },
    { date: "2024-01-11", completed: 156, avgTime: 4.3, errors: 9 },
    { date: "2024-01-12", completed: 178, avgTime: 4.0, errors: 7 },
    { date: "2024-01-13", completed: 203, avgTime: 3.9, errors: 5 },
    { date: "2024-01-14", completed: 187, avgTime: 4.2, errors: 11 },
  ],
  agentPerformance: [
    { name: "María González", processes: 23, avgTime: 3.8, successRate: 97.2, efficiency: "Excelente" },
    { name: "Carlos Martínez", processes: 19, avgTime: 4.1, successRate: 95.8, efficiency: "Muy Buena" },
    { name: "Ana Rodríguez", processes: 21, avgTime: 4.5, successRate: 93.4, efficiency: "Buena" },
    { name: "Luis Hernández", processes: 17, avgTime: 5.2, successRate: 89.7, efficiency: "Regular" },
  ],
  errorAnalysis: [
    { type: "Datos incorrectos", count: 15, percentage: 34.1 },
    { type: "Proceso incompleto", count: 12, percentage: 27.3 },
    { type: "Timeout de sistema", count: 8, percentage: 18.2 },
    { type: "Error de validación", count: 6, percentage: 13.6 },
    { type: "Otros", count: 3, percentage: 6.8 },
  ],
}

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  try {
    return NextResponse.json({
      success: true,
      data: analyticsData,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
