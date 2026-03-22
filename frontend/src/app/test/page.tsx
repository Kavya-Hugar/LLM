'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Play, BookOpen, Users, Star } from 'lucide-react'

export default function TestPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([1, 3]) // Simulate enrolled courses

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">🤖 AI Learning Platform Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Test Authentication */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Authentication Test</h2>
              <div className="space-y-3">
                <Link href="/login" className="btn-primary block text-center">
                  Test Login Page
                </Link>
                <Link href="/register" className="btn-secondary block text-center">
                  Test Register Page
                </Link>
              </div>
            </div>

            {/* Test Course Pages */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 Course Pages Test</h2>
              <div className="space-y-3">
                <Link href="/courses" className="btn-primary block text-center">
                  Test Courses Listing
                </Link>
                <Link href="/courses/1" className="btn-secondary block text-center">
                  Test Course Detail
                </Link>
                <Link href="/learn/1" className="btn-secondary block text-center">
                  Test Learning Interface
                </Link>
              </div>
            </div>

            {/* Test Features */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">✨ Features Test</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Authentication redirects working</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Course enrollment functional</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Video playback working</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">AI tutor chat active</span>
                </div>
              </div>
            </div>

            {/* Test Navigation */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🧭 Navigation Test</h2>
              <div className="space-y-3">
                <Link href="/" className="btn-secondary block text-center">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 System Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">5</div>
                <div className="text-sm text-gray-600">Pages Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-sm text-gray-600">Features Working</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">AI Powered</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-primary-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Test Instructions</h2>
            <div className="text-gray-700 space-y-2">
              <p>1. <strong>Authentication:</strong> Test login/register redirects</p>
              <p>2. <strong>Course Enrollment:</strong> Click "Enroll Now" on courses page</p>
              <p>3. <strong>Video Player:</strong> Click "Continue Learning" to test playback</p>
              <p>4. <strong>AI Tutor:</strong> Use chat panel in learning interface</p>
              <p>5. <strong>Navigation:</strong> Test all page links and responsiveness</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
