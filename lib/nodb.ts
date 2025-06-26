import { createClient } from "notdb"

export interface User {
  _id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface Feedback {
  _id: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  category: "feature" | "bug" | "general" | "ui" | "performance"
  status: "open" | "reviewed" | "closed"
  adminResponse?: string
  createdAt: string
  updatedAt: string
}

const db = createClient({
  apiKey: process.env.NOTDB_API_KEY || "NOTDB_API_KEY",
  schema: {
    users: {
      properties: {
        email: { type: "string", required: true, unique: true },
        name: { type: "string", required: true },
        isAdmin: { type: "boolean", default: false },
        password: { type: "string", required: true },
      },
    },
    feedback: {
      properties: {
        userId: { type: "string", required: true },
        userName: { type: "string", required: true },
        userEmail: { type: "string", required: true },
        rating: { type: "number", required: true, min: 1, max: 5 },
        comment: { type: "string", required: true },
        category: {
          type: "string",
          enum: ["feature", "bug", "general", "ui", "performance"],
          default: "general",
        },
        status: {
          type: "string",
          enum: ["open", "reviewed", "closed"],
          default: "open",
        },
        adminResponse: { type: "string" },
      },
    },
  },
})

export default db
