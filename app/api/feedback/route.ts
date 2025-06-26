import { NextResponse } from "next/server"
import db from  "@/lib/nodb"

export async function POST(request: Request) {
  try {
    const { userId, userName, userEmail, rating, comment, category } = await request.json()

    if (!userId || !rating || !comment) {
      return NextResponse.json({ error: "User ID, rating, and comment are required" }, { status: 400 })
    }

    const feedback = await db.feedback.insert({
      userId,
      userName,
      userEmail,
      rating: Number(rating),
      comment,
      category: category || "general",
      status: "pending",
      adminResponse: "",
    })

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
        feedbackId: feedback._id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 400 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")

    const filter: Record<string, string | undefined> = {}
    if (category && category !== "all") filter.category = category
    if (status && status !== "all") filter.status = status

    const feedback = await db.feedback.find({
      filter,
      sort: "-createdAt",
      ...(limit && { limit: Number(limit) }),
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Feedback fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
