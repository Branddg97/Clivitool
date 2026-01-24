import { type NextRequest, NextResponse } from "next/server"

// Simulated Confluence API data
const confluenceProcesses = [
  {
    id: "val-001",
    confluenceId: "123456789",
    title: "Validación de INE",
    description: "Proceso para validar la autenticidad del INE del cliente",
    category: "validations",
    lastModified: "2024-01-15T10:30:00Z",
    version: 3,
    author: "Maria Rodriguez",
    content: {
      steps: [
        {
          id: "step-1",
          title: "Inicio de Validación",
          content: "Preparación para validar el INE del cliente...",
          lastUpdated: "2024-01-15T10:30:00Z",
        },
        {
          id: "step-2",
          title: "Solicitar INE al Cliente",
          content: "Pedir al cliente que proporcione su INE...",
          lastUpdated: "2024-01-15T10:30:00Z",
        },
      ],
    },
    metadata: {
      avgTime: "4 min",
      difficulty: "Fácil",
      usage: 156,
      tags: ["validación", "INE", "identidad"],
    },
  },
  {
    id: "data-001",
    confluenceId: "123456790",
    title: "Cambio de Correo Electrónico",
    description: "Proceso para actualizar el email del cliente",
    category: "data-changes",
    lastModified: "2024-01-14T15:45:00Z",
    version: 2,
    author: "Carlos Martinez",
    content: {
      steps: [
        {
          id: "step-1",
          title: "Verificar Identidad",
          content: "Confirmar la identidad del cliente antes del cambio...",
          lastUpdated: "2024-01-14T15:45:00Z",
        },
      ],
    },
    metadata: {
      avgTime: "3 min",
      difficulty: "Fácil",
      usage: 203,
      tags: ["cambio", "correo", "email"],
    },
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const lastSync = searchParams.get("lastSync")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    let filteredProcesses = confluenceProcesses

    // Filter by category if provided
    if (category) {
      filteredProcesses = confluenceProcesses.filter((process) => process.category === category)
    }

    // Filter by last sync time if provided (for incremental updates)
    if (lastSync) {
      const syncDate = new Date(lastSync)
      filteredProcesses = confluenceProcesses.filter((process) => new Date(process.lastModified) > syncDate)
    }

    return NextResponse.json({
      success: true,
      data: filteredProcesses,
      metadata: {
        total: filteredProcesses.length,
        lastSync: new Date().toISOString(),
        confluenceSpace: "APLAZO-SUPPORT",
        apiVersion: "v1",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch processes from Confluence",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { processId, updates } = body

    // Simulate updating a process in Confluence
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Find the process to update
    const processIndex = confluenceProcesses.findIndex((p) => p.id === processId)

    if (processIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Process not found",
        },
        { status: 404 },
      )
    }

    // Simulate update
    confluenceProcesses[processIndex] = {
      ...confluenceProcesses[processIndex],
      ...updates,
      lastModified: new Date().toISOString(),
      version: confluenceProcesses[processIndex].version + 1,
    }

    return NextResponse.json({
      success: true,
      data: confluenceProcesses[processIndex],
      message: "Process updated successfully in Confluence",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update process in Confluence",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
