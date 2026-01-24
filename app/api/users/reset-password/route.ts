import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, resetAll = false } = body

    if (resetAll) {
      // Reset all passwords
      const results = userStore.resetAllPasswords()

      return NextResponse.json({
        success: true,
        message: `Successfully reset ${results.length} passwords`,
        data: results.map((r) => ({
          userId: r.userId,
          email: r.email,
          tempPassword: r.tempPassword,
        })),
      })
    } else {
      // Reset single password
      if (!userId) {
        return NextResponse.json(
          {
            success: false,
            error: "userId is required",
          },
          { status: 400 },
        )
      }

      const tempPassword = userStore.resetPassword(userId)

      if (!tempPassword) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 404 },
        )
      }

      const user = userStore.getUserById(userId)

      return NextResponse.json({
        success: true,
        message: "Password reset successfully",
        data: {
          userId,
          email: user?.email,
          tempPassword,
        },
      })
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reset password",
      },
      { status: 500 },
    )
  }
}
