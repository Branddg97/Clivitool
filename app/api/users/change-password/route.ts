import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, newPassword } = body

    if (!userId || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "userId and newPassword are required",
        },
        { status: 400 },
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 },
      )
    }

    const success = userStore.updatePassword(userId, newPassword)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update password",
      },
      { status: 500 },
    )
  }
}
