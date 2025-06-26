import { NextResponse } from "next/server"
import db from  "@/lib/nodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.users.insert({
      email: email.toLowerCase(),
      name,
      isAdmin: false,
      password: hashedPassword,
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
