import { NextResponse } from "next/server"
import db from "@/lib/nodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required" }, { status: 400 })
    }

    // replaced the admin True with the email so multiple users can be admin
    const existingUser = await db.users.find({ filter: { email: email.toLowerCase() }, limit: 1 })
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "The admin User with this email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const adminUser = await db.users.insert({
      email: email.toLowerCase(),
      name,
      isAdmin: true,
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