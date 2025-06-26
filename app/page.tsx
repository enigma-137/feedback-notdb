import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, BarChart3, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Feedback Collection Platform</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Collect, manage, and respond to user feedback with our beautiful and intuitive platform. Built with Next.js,
            TypeScript, and NotDatabase.
          </p>
          <div className="flex flex-col md:flex-row  gap-4 justify-center">
            <Link href="/feedback/submit">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="mr-2 h-5 w-5" />
                Submit Feedback
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Easy Feedback Submission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Simple and intuitive form for users to submit their feedback with ratings and categories.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive admin dashboard to view, filter, and analyze all feedback submissions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Response Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Respond to feedback, update status, and maintain ongoing conversations with users.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Platform Overview</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-gray-600">Type Safe</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">5min</div>
              <div className="text-gray-600">Setup Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-gray-600">Scalability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">0</div>
              <div className="text-gray-600">Database Config</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
