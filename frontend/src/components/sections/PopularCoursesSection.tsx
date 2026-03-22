'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Users, Star, Lock } from 'lucide-react'
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
    progress: 0,
    isEnrolled: false
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
    progress: 0,
    isEnrolled: false
  }
]

export default function PopularCoursesSection() {
  const [enrollingCourses, setEnrollingCourses] = useState<number[]>([])
  const [coursesData, setCoursesData] = useState(courses)

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular courses loved by thousands of learners worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coursesData.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              {/* Course thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Course content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

                {/* Course stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {course.rating}
                  </div>
                </div>

                {/* Progress bar (for enrolled courses) */}
                {course.progress > 0 && (
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
                    href={`/courses/${course.id}`}
                    className="w-full btn-primary text-center block"
                  >
                    {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
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

        {/* View all courses button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/courses" className="btn-secondary text-lg px-8 py-4">
            View All Courses
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
