"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star, MessageSquare, Filter, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import type { Feedback } from "@/lib/nodb"

export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
  })
  const [responses, setResponses] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchFeedback()
  }, [filters])

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.category !== "all") params.set("category", filters.category)
      if (filters.status !== "all") params.set("status", filters.status)

      const res = await fetch(`/api/feedback?${params}`)
      if (res.ok) {
        const data = await res.json()
        setFeedback(data)
      }
    } catch (error) {
      console.error("Failed to fetch feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFeedback = async (id: string, status: string, adminResponse?: string) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          adminResponse,
          adminUserId: "admin_demo",
        }),
      })

      if (res.ok) {
        fetchFeedback() // Refresh the list
        setResponses((prev) => ({ ...prev, [id]: "" })) // Clear response field
      }
    } catch (error) {
      console.error("Failed to update feedback:", error)
    }
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

  const stats = {
    total: feedback.length,
    open: feedback.filter((f) => f.status === "open").length,
    avgRating:
      feedback.length > 0 ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1) : "0",
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

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="ui">UI/UX</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading feedback...</div>
          ) : feedback.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No feedback found matching your filters.</p>
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
                      value={responses[item._id] || ""}
                      onChange={(e) =>
                        setResponses((prev) => ({
                          ...prev,
                          [item._id]: e.target.value,
                        }))
                      }
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateFeedback(item._id, "reviewed", responses[item._id])}
                        variant="outline"
                        size="sm"
                      >
                        Mark as Reviewed
                      </Button>
                      <Button
                        onClick={() => updateFeedback(item._id, "closed", responses[item._id])}
                        variant="outline"
                        size="sm"
                      >
                        Close
                      </Button>
                      {responses[item._id] && (
                        <Button onClick={() => updateFeedback(item._id, item.status, responses[item._id])} size="sm">
                          <Send className="mr-2 h-4 w-4" />
                          Send Response
                        </Button>
                      )}
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
