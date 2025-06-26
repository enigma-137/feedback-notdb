import { NextResponse } from "next/server"
import db from  "@/lib/nodb"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 })
    }

    const user = await db.users.insert({
      email: email.toLowerCase(),
      name,
      isAdmin: false,
    })

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: user._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user. Email might already exist." }, { status: 400 })
  }
}
