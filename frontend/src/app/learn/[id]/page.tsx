'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import YouTube from 'react-youtube'
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize2, 
  Settings, 
  MessageSquare,
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

// Mock course data
const courseData = {
  1: {
    id: 1,
    title: 'Complete Python Programming',
    instructor: 'Dr. Sarah Johnson',
    currentLesson: {
      id: 1,
      title: 'Introduction to Python',
      videoId: 'dQw4w9WgXcQ', // YouTube video ID
      duration: '12:34',
      isCompleted: true
    },
    sections: [
      {
        id: 1,
        title: 'Introduction to Python',
        lessons: [
          {
            id: 1,
            title: 'Introduction to Python',
            duration: '12:34',
            isCompleted: true,
            isLocked: false
          },
          {
            id: 2,
            title: 'Setting Up Python Environment',
            duration: '8:45',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 3,
            title: 'Your First Python Program',
            duration: '15:20',
            isCompleted: false,
            isLocked: false
          }
        ]
      },
      {
        id: 2,
        title: 'Python Fundamentals',
        lessons: [
          {
            id: 4,
            title: 'Variables and Data Types',
            duration: '10:15',
            isCompleted: false,
            isLocked: false
          },
          {
            id: 5,
            title: 'Operators and Expressions',
            duration: '12:30',
            isCompleted: false,
            isLocked: true
          }
        ]
      }
    ]
  }
}

export default function LearningPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showAITutor, setShowAITutor] = useState(false)
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      message: '👋 Welcome to your Python course! I\'m your AI tutor and I\'m here to help you master Python programming. Feel free to ask me about:\n\n📖 Lesson concepts and explanations\n💻 Code examples and debugging\n🎯 Learning objectives\n📝 Assignment help\n\nWhat would you like to start with?',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [player, setPlayer] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      const courseId = parseInt(params.id as string)
      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const courseDetails = courseData[courseId as keyof typeof courseData]
      
      if (!courseDetails) {
        toast.error('Course not found')
        router.push('/courses')
        return
      }
      
      setCourse(courseDetails)
      setCurrentLesson(courseDetails.currentLesson)
      setIsLoading(false)
    }

    fetchCourse()
  }, [params.id, router])

  const handleLessonClick = (lesson: any) => {
    if (lesson.isLocked) {
      toast.error('Please complete previous lessons first')
      return
    }
    setCurrentLesson(lesson)
    setIsPlaying(false)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: aiMessages.length + 1,
      sender: 'user',
      message: newMessage,
      timestamp: new Date()
    }

    setAiMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true) // Show typing indicator

    // Simulate AI response with contextual answers
    setTimeout(() => {
      let aiResponse = ''
      const lowerMessage = newMessage.toLowerCase()
      
      // Contextual AI responses based on course content
      if (lowerMessage.includes('python') || lowerMessage.includes('code')) {
        aiResponse = 'Python is a versatile programming language! For this course, you\'ll learn about variables, data types, control flow, and object-oriented programming. Would you like me to explain any specific concept?'
      } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
        aiResponse = 'I\'m here to help! You can ask me about:\n\n📚 Course content explanations\n💻 Code examples and debugging\n🎯 Learning objectives\n📝 Assignment help\n\nWhat specific topic would you like help with?'
      } else if (lowerMessage.includes('variable') || lowerMessage.includes('var')) {
        aiResponse = 'Variables in Python are containers for storing data values. You create them using assignment statements like `x = 5` or `name = "Python"`. Python is dynamically typed, so you don\'t need to declare variable types. Want to see an example?'
      } else if (lowerMessage.includes('function') || lowerMessage.includes('def')) {
        aiResponse = 'Functions in Python are defined using the `def` keyword. They help you organize code into reusable blocks. Here\'s the basic structure:\n\n```python\ndef function_name(parameters):\n    # function body\n    return result\n```\n\nWould you like me to walk through creating a specific function?'
      } else if (lowerMessage.includes('error') || lowerMessage.includes('bug')) {
        aiResponse = 'Debugging is a normal part of learning! Common issues include:\n\n• Syntax errors (check indentation and colons)\n• Name errors (typos in variable names)\n• Logic errors (incorrect conditions)\n\nCan you share the specific error message you\'re seeing?'
      } else {
        aiResponse = `That's a great question about "${newMessage}"! Based on this Python course, I can help you understand the concepts better. The key is to practice regularly and don't hesitate to ask questions. What specific aspect would you like me to elaborate on?`
      }

      const responseMessage = {
        id: aiMessages.length + 2,
        sender: 'ai',
        message: aiResponse,
        timestamp: new Date()
      }
      setAiMessages(prev => [...prev, responseMessage])
      setIsTyping(false) // Hide typing indicator
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const onPlayerReady = (event: any) => {
    setPlayer(event.target)
  }

  const onPlayerStateChange = (event: any) => {
    const playerState = event.target.getPlayerState()
    setIsPlaying(playerState === 1) // 1 = playing
  }

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Course Content</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {course.title}
            </div>
          </div>

          {/* Course Sections */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {course.sections.map((section: any) => (
                <div key={section.id}>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Section {section.id}: {section.title}
                  </h3>
                  <div className="space-y-2">
                    {section.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                          currentLesson?.id === lesson.id
                            ? 'bg-primary-100 text-primary-700'
                            : lesson.isCompleted
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : lesson.isLocked
                            ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                        disabled={lesson.isLocked}
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          {lesson.isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : lesson.isLocked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-current rounded-full" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {lesson.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {lesson.duration}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="bg-black relative aspect-video">
          {currentLesson?.videoId && (
            <YouTube
              videoId={currentLesson.videoId}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  rel: 0,
                  showinfo: 0,
                  modestbranding: 1,
                  fs: 1
                }
              }}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          )}
          
          {/* Custom Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg">
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
              <div className="text-sm">
                {currentLesson?.duration}
              </div>
              <button className="p-2 hover:bg-white/20 rounded-lg">
                <Maximize2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentLesson?.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {currentLesson?.duration}
            </div>
            {currentLesson?.isCompleted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Completed
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center gap-2 text-gray-700"
            >
              <Menu className="w-5 h-5" />
              <span>Course Content</span>
            </button>
            <button
              onClick={() => setShowAITutor(!showAITutor)}
              className="flex items-center gap-2 text-gray-700"
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <div className="flex-1 bg-white p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <BookOpen className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Lesson Notes</h3>
                  <p className="text-gray-600">
                    Comprehensive notes covering all concepts discussed in this lesson.
                  </p>
                </div>
                <div className="glass-card p-6">
                  <Settings className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Resources</h3>
                  <p className="text-gray-600">
                    Downloadable code examples and practice exercises.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tutor Panel */}
          <div className={`${showAITutor ? 'w-96' : 'w-0'} transition-all duration-300 bg-white border-l border-gray-200 overflow-hidden`}>
            <div className="h-full flex flex-col">
              {/* AI Tutor Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">AI Tutor</h3>
                  <button
                    onClick={() => setShowAITutor(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {aiMessages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.message}
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-lg max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <span className="text-sm">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask your AI tutor..."
                    className="flex-1 input-field"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="btn-primary px-4 py-2"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
