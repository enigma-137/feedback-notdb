"use client"

import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

interface Feedback {
  _id: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  category: string
  status: string
  adminResponse?: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [updating, setUpdating] = useState<Record<string, boolean>>({})
  // const router = useRouter()

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const res = await fetch("/api/feedback")
      if (res.ok) {
        const data = await res.json()
        setFeedback(data)
      } else {
        console.error("Failed to fetch feedback")
      }
    } catch (error) {
      console.error("Error fetching feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFeedback = async (id: string, updates: { status?: string; adminResponse?: string }) => {
    setUpdating(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        // Update local state
        setFeedback(prev => 
          prev.map(item => 
            item._id === id 
              ? { ...item, ...updates }
              : item
          )
        )
        // Clear response text
        setResponses(prev => ({ ...prev, [id]: "" }))
      } else {
        console.error("Failed to update feedback")
      }
    } catch (error) {
      console.error("Error updating feedback:", error)
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }))
    }
  }

  const deleteFeedback = async (id: string) => {
    setUpdating(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        // Remove from local state
        setFeedback(prev => prev.filter(item => item._id !== id))
        // Clear response text
        setResponses(prev => ({ ...prev, [id]: "" }))
      } else {
        console.error("Failed to delete feedback")
      }
    } catch (error) {
      console.error("Error deleting feedback:", error)
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleStatusUpdate = (id: string, status: string) => {
    updateFeedback(id, { status })
  }

  const handleClose = (id: string) => {
    deleteFeedback(id)
  }

  const handleSendResponse = (id: string) => {
    const response = responses[id]?.trim()
    if (response) {
      updateFeedback(id, { adminResponse: response, status: "reviewed" })
    }
  }

  const stats = {
    total: feedback.length,
    open: feedback.filter((f) => f.status === "open").length,
    avgRating:
      feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : "0",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "bug":
        return "bg-red-100 text-red-800"
      case "feature":
        return "bg-blue-100 text-blue-800"
      case "ui":
        return "bg-purple-100 text-purple-800"
      case "performance":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feedback...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and respond to user feedback</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Open Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.avgRating} ⭐</div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No feedback found.</p>
              </CardContent>
            </Card>
          ) : (
            feedback.map((item) => (
              <Card key={item._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.userName}</CardTitle>
                      <CardDescription>{item.userEmail}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getCategoryColor(item.category)}>{item.category}</Badge>
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{item.rating}/5 stars</span>
                    <span className="text-sm text-gray-500 ml-auto">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800">{item.comment}</p>
                  </div>

                  {item.adminResponse && (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800 mb-1">Admin Response:</p>
                      <p className="text-blue-700">{item.adminResponse}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your response..."
                      rows={3}
                      value={responses[item._id] || ""}
                      onChange={(e) => setResponses(prev => ({ ...prev, [item._id]: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusUpdate(item._id, "reviewed")}
                        disabled={updating[item._id] || item.status === "reviewed"}
                      >
                        {updating[item._id] ? "Updating..." : "Mark as Reviewed"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleClose(item._id)}
                        disabled={updating[item._id]}
                      >
                        {updating[item._id] ? "Deleting..." : "Delete"}
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleSendResponse(item._id)}
                        disabled={updating[item._id] || !responses[item._id]?.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {updating[item._id] ? "Sending..." : "Send Response"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
