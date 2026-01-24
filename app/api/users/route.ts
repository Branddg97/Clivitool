import { NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function GET() {
  try {
    const users = userStore.getAllUsers()
    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
      },
      { status: 500 },
    )
  }
}
