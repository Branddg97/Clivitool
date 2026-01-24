import { type NextRequest, NextResponse } from "next/server"
import { userStore } from "@/lib/user-store"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Verify credentials
    const isValid = userStore.verifyPassword(email, password)

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      )
    }

    // Get user data
    const user = userStore.getUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    // Update last login
    userStore.updateLastLogin(user.id)

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      { status: 500 },
    )
  }
}
