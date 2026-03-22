'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  Lock, 
  CheckCircle, 
  Circle, 
  ArrowLeft, 
  ArrowRight,
  BookOpen,
  Award,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock course data - in real app this would come from API
const courseData = {
  1: {
    id: 1,
    title: 'Complete Python Programming',
    instructor: 'Dr. Sarah Johnson',
    thumbnail: '/api/placeholder/800/400',
    duration: '12 hours',
    lessons: 48,
    students: 15420,
    rating: 4.8,
    price: 89.99,
    level: 'Beginner',
    category: 'Programming',
    description: 'Master Python programming from scratch with this comprehensive course covering everything from basics to advanced concepts.',
    whatYouLearn: [
      'Python fundamentals and syntax',
      'Object-oriented programming',
      'Data structures and algorithms',
      'File handling and exceptions',
      'Working with databases',
      'Building real-world applications'
    ],
    requirements: [
      'Basic computer skills',
      'No programming experience required',
      'Computer with internet access'
    ],
    sections: [
      {
        id: 1,
        title: 'Introduction to Python',
        lessons: 8,
        duration: '2 hours',
        isCompleted: true,
        isLocked: false
      },
      {
        id: 2,
        title: 'Python Fundamentals',
        lessons: 12,
        duration: '3 hours',
        isCompleted: true,
        isLocked: false
      },
      {
        id: 3,
        title: 'Control Flow and Functions',
        lessons: 10,
        duration: '2.5 hours',
        isCompleted: false,
        isLocked: false
      },
      {
        id: 4,
        title: 'Data Structures',
        lessons: 8,
        duration: '2 hours',
        isCompleted: false,
        isLocked: false
      },
      {
        id: 5,
        title: 'Object-Oriented Programming',
        lessons: 10,
        duration: '2.5 hours',
        isCompleted: false,
        isLocked: true
      }
    ]
  },
  2: {
    id: 2,
    title: 'Web Development Bootcamp',
    instructor: 'Mike Chen',
    thumbnail: '/api/placeholder/800/400',
    duration: '24 hours',
    lessons: 96,
    students: 23150,
    rating: 4.9,
    price: 129.99,
    level: 'Intermediate',
    category: 'Web Development'
  },
  3: {
    id: 3,
    title: 'Data Science Fundamentals',
    instructor: 'Prof. Emily Davis',
    thumbnail: '/api/placeholder/800/400',
    duration: '18 hours',
    lessons: 72,
    students: 18900,
    rating: 4.7,
    price: 109.99,
    level: 'Intermediate',
    category: 'Data Science'
  }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    // Simulate API call to fetch course details
    const fetchCourse = async () => {
      const courseId = parseInt(params.id as string)
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const courseDetails = courseData[courseId as keyof typeof courseData]
      
      if (!courseDetails) {
        toast.error('Course not found')
        router.push('/courses')
        return
      }
      
      setCourse(courseDetails)
      setIsLoading(false)
    }

    fetchCourse()
  }, [params.id, router])

  const handleEnroll = async () => {
    setIsEnrolling(true)
    
    try {
      // Simulate API call for enrollment
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Successfully enrolled in course!')
      
      // Redirect to learning page
      router.push(`/learn/${course.id}`)
    } catch (error) {
      toast.error('Enrollment failed. Please try again.')
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleStartLearning = () => {
    router.push(`/learn/${course.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/courses"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Course Hero */}
      <div className="bg-gradient-to-br from-primary-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{course.description}</p>
                
                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* What You'll Learn */}
                {course.whatYouLearn && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.whatYouLearn.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {course.requirements && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Requirements</h2>
                    <div className="space-y-3">
                      {course.requirements.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-6 sticky top-24"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl mb-6 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Level</span>
                    <span className="font-medium text-gray-900">{course.level}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">{course.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Certificate</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      Included
                    </span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="text-3xl font-bold text-gray-900 mb-6">
                    ${course.price}
                  </div>
                  
                  {course.isEnrolled ? (
                    <button
                      onClick={handleStartLearning}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEnrolling ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Enrolling...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Enroll Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      {course.sections && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Course Content</h2>
              <div className="space-y-4">
                {course.sections.map((section: any, index: number) => (
                  <div key={section.id} className="glass-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          {section.isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : section.isLocked ? (
                            <Lock className="w-6 h-6 text-gray-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Section {index + 1}: {section.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {section.lessons} lessons • {section.duration}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
