import { NextResponse } from "next/server"
import db from "@/lib/nodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Check if any admin exists
    const existingAdmins = await db.users.find({ filter: { isAdmin: true }, limit: 1 })
    if (existingAdmins.length > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 })
    }

    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const adminUser = await db.users.insert({
      email: email.toLowerCase(),
      name,
      isAdmin: true, // This is the key - setting isAdmin to true
      password: hashedPassword,
    })

    return NextResponse.json(
      {
        message: "Admin user created successfully",
        userId: adminUser._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 400 })
  }
} 