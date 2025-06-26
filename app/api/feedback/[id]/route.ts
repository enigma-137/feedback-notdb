import { NextResponse } from "next/server"
import db from  "@/lib/nodb"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status, adminResponse } = await request.json()

    // Thinking of verifing admin here
    // const admin = await db.users.findOne({ _id: adminUserId });
    // if (!admin?.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    const updates: Record<string, string | undefined> = {}
    if (status) updates.status = status
    if (adminResponse !== undefined) updates.adminResponse = adminResponse

    await db.feedback.update(id, updates)

    return NextResponse.json({ message: "Feedback updated successfully" })
  } catch (error) {
    console.error("Feedback update error:", error)
    return NextResponse.json({ error: "Failed to update feedback" }, { status: 400 })
  }
}
