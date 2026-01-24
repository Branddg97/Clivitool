import { type NextRequest, NextResponse } from "next/server"

interface SyncStatus {
  lastSync: string
  status: "success" | "error" | "in-progress"
  processesUpdated: number
  errors: string[]
  nextSync: string
}

// Simulated sync status
let syncStatus: SyncStatus = {
  lastSync: "2024-01-15T10:30:00Z",
  status: "success",
  processesUpdated: 12,
  errors: [],
  nextSync: "2024-01-15T11:30:00Z",
}

export async function GET() {
  // Simulate checking sync status
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json({
    success: true,
    data: syncStatus,
    confluenceInfo: {
      spaceKey: "CLIVI-SUPPORT",
      baseUrl: "https://clivi.atlassian.net",
      connected: true,
      lastHealthCheck: new Date().toISOString(),
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { forceSync = false } = body

    // Simulate sync process
    syncStatus.status = "in-progress"
    syncStatus.processesUpdated = 0
    syncStatus.errors = []

    // Simulate sync delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate random sync results
    const updatedCount = Math.floor(Math.random() * 15) + 1
    const hasErrors = Math.random() < 0.1 // 10% chance of errors

    syncStatus = {
      lastSync: new Date().toISOString(),
      status: hasErrors ? "error" : "success",
      processesUpdated: updatedCount,
      errors: hasErrors ? ["Failed to sync process val-003: Connection timeout"] : [],
      nextSync: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Next hour
    }

    return NextResponse.json({
      success: true,
      data: syncStatus,
      message: `Sync completed. ${updatedCount} processes updated.`,
    })
  } catch (error) {
    syncStatus.status = "error"
    syncStatus.errors = [error instanceof Error ? error.message : "Unknown sync error"]

    return NextResponse.json(
      {
        success: false,
        error: "Sync failed",
        data: syncStatus,
      },
      { status: 500 },
    )
  }
}
