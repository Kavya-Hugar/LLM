'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, Clock, Users, Star, Lock, Play } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

const courses = [
  {
    id: 1,
    title: 'Complete Python Programming',
    instructor: 'Dr. Sarah Johnson',
    thumbnail: '/api/placeholder/400/250',
    duration: '12 hours',
    lessons: 48,
    students: 15420,
    rating: 4.8,
    price: 89.99,
    level: 'Beginner',
    category: 'Programming',
    progress: 0,
    isEnrolled: false
  },
  {
    id: 2,
    title: 'Web Development Bootcamp',
    instructor: 'Mike Chen',
    thumbnail: '/api/placeholder/400/250',
    duration: '24 hours',
    lessons: 96,
    students: 23150,
    rating: 4.9,
    price: 129.99,
    level: 'Intermediate',
    category: 'Web Development',
    progress: 0,
    isEnrolled: false
  },
  {
    id: 3,
    title: 'Data Science Fundamentals',
    instructor: 'Prof. Emily Davis',
    thumbnail: '/api/placeholder/400/250',
    duration: '18 hours',
    lessons: 72,
    students: 18900,
    rating: 4.7,
    price: 109.99,
    level: 'Intermediate',
    category: 'Data Science',
    progress: 65,
    isEnrolled: true
  },
  {
    id: 4,
    title: 'Machine Learning A-Z',
    instructor: 'Dr. Alex Kumar',
    thumbnail: '/api/placeholder/400/250',
    duration: '30 hours',
    lessons: 120,
    students: 31200,
    rating: 4.9,
    price: 149.99,
    level: 'Advanced',
    category: 'Machine Learning',
    progress: 0,
    isEnrolled: false
  },
  {
    id: 5,
    title: 'React & Next.js Mastery',
    instructor: 'Jessica Lee',
    thumbnail: '/api/placeholder/400/250',
    duration: '20 hours',
    lessons: 80,
    students: 19800,
    rating: 4.8,
    price: 119.99,
    level: 'Intermediate',
    category: 'Web Development',
    progress: 30,
    isEnrolled: true
  },
  {
    id: 6,
    title: 'UI/UX Design Principles',
    instructor: 'David Martinez',
    thumbnail: '/api/placeholder/400/250',
    duration: '15 hours',
    lessons: 60,
    students: 12300,
    rating: 4.6,
    price: 99.99,
    level: 'Beginner',
    category: 'Design',
    progress: 0,
    isEnrolled: false
  }
]

const categories = ['All', 'Programming', 'Web Development', 'Data Science', 'Machine Learning', 'Design']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [enrollingCourses, setEnrollingCourses] = useState<number[]>([])
  const [coursesData, setCoursesData] = useState(courses)

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const handleEnroll = async (courseId: number) => {
    setEnrollingCourses(prev => [...prev, courseId])
    
    try {
      // Simulate API call for enrollment
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update course enrollment status
      setCoursesData(prev => prev.map(course => 
        course.id === courseId 
          ? { ...course, isEnrolled: true, progress: 0 }
          : course
      ))
      
      toast.success('Successfully enrolled in course!')
    } catch (error) {
      toast.error('Enrollment failed. Please try again.')
    } finally {
      setEnrollingCourses(prev => prev.filter(id => id !== courseId))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11 w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-4">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field px-4 py-2"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="input-field px-4 py-2"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex flex-col gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field px-4 py-2"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="input-field px-4 py-2"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            All Courses
            <span className="text-gray-600 font-normal text-lg ml-2">
              ({filteredCourses.length} courses)
            </span>
          </h1>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              {/* Course thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {course.isEnrolled ? (
                    <Play className="w-12 h-12 text-white" />
                  ) : (
                    <Lock className="w-12 h-12 text-white" />
                  )}
                </div>

                {/* Level badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </div>
              </div>

              {/* Course content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.instructor}</p>

                {/* Course stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Progress bar (for enrolled courses) */}
                {course.isEnrolled && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* CTA button */}
                {course.isEnrolled ? (
                  <Link
                    href={`/learn/${course.id}`}
                    className="w-full btn-primary text-center block"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingCourses.includes(course.id)}
                    className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrollingCourses.includes(course.id) ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enrolling...
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
