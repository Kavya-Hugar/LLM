'use client'

import { motion } from 'framer-motion'
import { BookOpen, Headphones, TrendingUp, Brain } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Structured Video Learning',
    description: 'Carefully organized courses with progressive lesson structure ensures optimal learning flow and knowledge retention.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Headphones,
    title: 'AI Tutor Assistant',
    description: 'Get instant help from our AI tutor that understands your context and provides personalized learning support.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: TrendingUp,
    title: 'Smart Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and insights to keep you motivated and on track.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: Brain,
    title: 'Intelligent Recommendations',
    description: 'AI-powered course recommendations based on your learning style, goals, and progress patterns.',
    color: 'bg-orange-100 text-orange-600'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose AI Learning Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of online education with our innovative features designed to enhance your learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center hover:shadow-2xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${feature.color}`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
