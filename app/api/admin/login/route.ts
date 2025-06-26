import { NextResponse } from "next/server"
import db from "@/lib/nodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const users = await db.users.find({ filter: { email: email.toLowerCase() }, limit: 1 })
  const user = users[0]
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Set a cookie/session (for demo, use a simple cookie)
  return NextResponse.json({ message: "Login successful", userId: user._id }, {
    status: 200,
    headers: {
      "Set-Cookie": `admin_session=${user._id}; Path=/; HttpOnly; SameSite=Lax`,
    },
  })
} 