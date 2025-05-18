import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json()

    // Simulate authentication
    if (action === "login") {
      const { email, password } = data

      // In a real app, you would validate credentials against a database
      if (email && password) {
        // Simulate successful login
        return NextResponse.json({
          success: true,
          user: {
            id: "user-1",
            name: email.split("@")[0],
            email,
          },
        })
      } else {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }
    }

    // Simulate registration
    else if (action === "register") {
      const { name, email, password } = data

      // In a real app, you would create a new user in the database
      if (name && email && password) {
        // Simulate successful registration
        return NextResponse.json({
          success: true,
          user: {
            id: "user-" + Date.now(),
            name,
            email,
          },
        })
      } else {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
      }
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
