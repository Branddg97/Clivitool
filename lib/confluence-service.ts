export interface SyncResponse {
  success: boolean
  data: {
    status: "success" | "error" | "in-progress"
    lastSync: string
    nextSync: string
    processesUpdated: number
    errors: string[]
  }
}

class ConfluenceService {
  async getSyncStatus(): Promise<SyncResponse> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      data: {
        status: "success",
        lastSync: new Date(Date.now() - 120000).toISOString(),
        nextSync: new Date(Date.now() + 1800000).toISOString(),
        processesUpdated: 12,
        errors: [],
      },
    }
  }

  async triggerSync(forceSync = false): Promise<SyncResponse> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      data: {
        status: "success",
        lastSync: new Date().toISOString(),
        nextSync: new Date(Date.now() + 1800000).toISOString(),
        processesUpdated: forceSync ? 15 : 3,
        errors: [],
      },
    }
  }
}

export const confluenceService = new ConfluenceService()
