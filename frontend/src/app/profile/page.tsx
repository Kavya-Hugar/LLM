'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  User, 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Target,
  Settings,
  LogOut,
  ChevronRight,
  Edit,
  Mail,
  Calendar,
  BarChart3,
  Download,
  Star,
  CheckCircle,
  Play,
  Lock as LockIcon,
  Unlock,
  Zap,
  Trophy,
  Flame,
  Users,
  Video,
  MessageSquare,
  Code,
  Brain,
  Heart,
  Activity,
  Bell,
  Shield,
  Key,
  Globe,
  Cpu,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  FileText,
  Image,
  Music,
  Palette,
  Layers,
  Package,
  GitBranch,
  Terminal,
  Server,
  CloudUpload,
  RefreshCw,
  Save,
  Trash2,
  Search,
  Filter,
  Menu,
  X as XIcon,
  Plus,
  Minus,
  MoreVertical,
  Home,
  BookMarked,
  Share2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [userStats, setUserStats] = useState({
    coursesEnrolled: 6,
    coursesCompleted: 3,
    totalHours: 24,
    streak: 7,
    certificates: 2,
    achievements: 12
  })

  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/api/placeholder/150/150',
    bio: 'Passionate learner exploring the world of AI and programming. Currently focused on Python development and machine learning.',
    joinedDate: 'January 15, 2024',
    level: 'Intermediate',
    points: 2450,
    rank: 'Advanced Learner'
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'course_completion',
      title: 'Completed: Python Fundamentals',
      description: 'Finished all lessons in Python Fundamentals section',
      timestamp: '2 hours ago',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked: Code Master',
      description: 'Completed 10 coding exercises in a row',
      timestamp: '1 day ago',
      icon: Trophy,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'course_enrollment',
      title: 'Enrolled: Machine Learning Basics',
      description: 'Started new ML course with video lessons',
      timestamp: '3 days ago',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 4,
      type: 'streak',
      title: '🔥 7 Day Learning Streak!',
      description: 'Keep up the great work!',
      timestamp: 'Today',
      icon: Flame,
      color: 'orange'
    }
  ])

  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      id: 1,
      title: 'Complete Python Programming',
      instructor: 'Dr. Sarah Johnson',
      progress: 85,
      thumbnail: '/api/placeholder/300/200',
      duration: '12 hours',
      lessons: 48,
      lastAccessed: '2 hours ago',
      status: 'in_progress'
    },
    {
      id: 2,
      title: 'Web Development Bootcamp',
      instructor: 'Mike Chen',
      progress: 45,
      thumbnail: '/api/placeholder/300/200',
      duration: '24 hours',
      lessons: 96,
      lastAccessed: '1 day ago',
      status: 'in_progress'
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      instructor: 'Prof. Emily Davis',
      progress: 100,
      thumbnail: '/api/placeholder/300/200',
      duration: '18 hours',
      lessons: 72,
      lastAccessed: '3 days ago',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Machine Learning A-Z',
      instructor: 'Dr. Alex Kumar',
      progress: 30,
      thumbnail: '/api/placeholder/300/200',
      duration: '30 hours',
      lessons: 120,
      lastAccessed: '1 week ago',
      status: 'not_started'
    }
  ])

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Complete 5 courses in one month',
      icon: Zap,
      unlocked: true,
      progress: 3,
      total: 5
    },
    {
      id: 2,
      title: 'Code Master',
      description: 'Complete 100 coding exercises',
      icon: Code,
      unlocked: true,
      progress: 85,
      total: 100
    },
    {
      id: 3,
      title: 'AI Expert',
      description: 'Complete all AI-related courses',
      icon: Brain,
      unlocked: false,
      progress: 2,
      total: 3
    },
    {
      id: 4,
      title: 'Perfect Attendance',
      description: '30-day learning streak',
      icon: Calendar,
      unlocked: true,
      progress: 30,
      total: 30
    },
    {
      id: 5,
      title: 'Course Hunter',
      description: 'Enroll in 20 different courses',
      icon: BookOpen,
      unlocked: false,
      progress: 12,
      total: 20
    }
  ])

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'english',
    autoplay: true,
    downloadQuality: 'high',
    privacy: 'public'
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast.success('Profile updated successfully!')
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    toast.success(`${key} setting updated!`)
  }

  const handleLogout = () => {
    toast.success('Logged out successfully!')
    router.push('/')
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">
                <BookOpen className="w-5 h-5 mr-2" />
                Back to Courses
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
              >
                <LogOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary text-sm"
                    >
                      Save Changes
                    </button>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Level {userProfile.level}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mt-4 text-center">
                    {userProfile.name}
                  </h3>
                  <p className="text-gray-600 text-center mt-1">
                    {userProfile.email}
                  </p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Joined {userProfile.joinedDate}
                  </p>
                </div>

                {!isEditing && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        defaultValue={userProfile.bio}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {userProfile.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        #{userProfile.rank}
                      </div>
                      <div className="text-sm text-gray-600">Rank</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userStats.coursesEnrolled}
                    </div>
                    <div className="text-sm text-gray-600">Courses Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userStats.coursesCompleted}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {userStats.totalHours}
                    </div>
                    <div className="text-sm text-gray-600">Hours Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {userStats.streak}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-6">
                      {/* Recent Activity */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                          {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                activity.color === 'green' ? 'bg-green-100' :
                                activity.color === 'yellow' ? 'bg-yellow-100' :
                                activity.color === 'blue' ? 'bg-blue-100' :
                                activity.color === 'orange' ? 'bg-orange-100' :
                                'bg-gray-100'
                              }`}>
                                <activity.icon className={`w-4 h-4 ${
                                  activity.color === 'green' ? 'text-green-600' :
                                  activity.color === 'yellow' ? 'text-yellow-600' :
                                  activity.color === 'blue' ? 'text-blue-600' :
                                  activity.color === 'orange' ? 'text-orange-600' :
                                  'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{activity.title}</div>
                                <div className="text-sm text-gray-600">{activity.description}</div>
                                <div className="text-xs text-gray-500">{activity.timestamp}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="glass-card p-4 text-center">
                          <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{userStats.certificates}</div>
                          <div className="text-sm text-gray-600">Certificates</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                          <Target className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{userStats.achievements}</div>
                          <div className="text-sm text-gray-600">Achievements</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{userStats.points}</div>
                          <div className="text-sm text-gray-600">Total Points</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'courses' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="glass-card p-4">
                            <div className="flex gap-4">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{course.title}</h4>
                                <p className="text-sm text-gray-600">{course.instructor}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex-1">
                                    <div className="text-xs text-gray-500">{course.lessons} lessons</div>
                                    <div className="text-xs text-gray-500">{course.duration}</div>
                                  </div>
                                  <div className={`text-xs font-medium ${
                                    course.status === 'completed' ? 'text-green-600' :
                                    course.status === 'in_progress' ? 'text-blue-600' :
                                    'text-gray-600'
                                  }`}>
                                    {course.status === 'completed' ? 'Completed' :
                                     course.status === 'in_progress' ? 'In Progress' :
                                     'Not Started'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium text-gray-900">{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    course.status === 'completed' ? 'bg-green-600' :
                                    course.status === 'in_progress' ? 'bg-blue-600' :
                                    'bg-gray-300'
                                  }`}
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              <button className="flex-1 btn-secondary text-sm">
                                {course.status === 'completed' ? (
                                  <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Review
                                  </>
                                ) : course.status === 'in_progress' ? (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Continue
                                  </>
                                ) : (
                                  <>
                                    <LockIcon className="w-4 h-4 mr-2" />
                                    Start
                                  </>
                                )}
                              </button>
                              <button className="btn-secondary text-sm">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                )}

                {activeTab === 'achievements' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`glass-card p-4 ${
                              achievement.unlocked ? 'opacity-100' : 'opacity-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                              }`}>
                                <achievement.icon className={`w-6 h-6 ${
                                  achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${
                                  achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                  {achievement.title}
                                </h4>
                                <p className={`text-sm ${
                                  achievement.unlocked ? 'text-gray-600' : 'text-gray-500'
                                }`}>
                                  {achievement.description}
                                </p>
                                <div className="mt-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-500">Progress</span>
                                    <span className={`text-xs font-medium ${
                                      achievement.unlocked ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                      {achievement.progress}/{achievement.total}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-full rounded-full transition-all duration-300 ${
                                        achievement.unlocked ? 'bg-yellow-600' : 'bg-gray-300'
                                      }`}
                                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                    />
                                  </div>
                                </div>
                                {!achievement.unlocked && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                    <LockIcon className="w-3 h-3" />
                                    <span>Complete more achievements to unlock</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="space-y-6">
                      {/* Account Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
                              <p className="text-xs text-gray-500">Receive email updates about your courses</p>
                            </div>
                            <button
                              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className="sr-only">Toggle email notifications</span>
                              <span
                                className={`inline-block h-4 w-4 rounded-full transform transition-transform ${
                                  settings.emailNotifications ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Push Notifications</label>
                              <p className="text-xs text-gray-500">Receive push notifications on your device</p>
                            </div>
                            <button
                              onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.pushNotifications ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className="sr-only">Toggle push notifications</span>
                              <span
                                className={`inline-block h-4 w-4 rounded-full transform transition-transform ${
                                  settings.pushNotifications ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Language</label>
                              <p className="text-xs text-gray-500">Choose your preferred language</p>
                            </div>
                            <select
                              value={settings.language}
                              onChange={(e) => handleSettingChange('language', e.target.value)}
                              className="input-field"
                            >
                              <option value="english">English</option>
                              <option value="spanish">Spanish</option>
                              <option value="french">French</option>
                              <option value="german">German</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Privacy Settings */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                              <p className="text-xs text-gray-500">Control who can see your profile</p>
                            </div>
                            <select
                              value={settings.privacy}
                              onChange={(e) => handleSettingChange('privacy', e.target.value)}
                              className="input-field"
                            >
                              <option value="public">Public</option>
                              <option value="friends">Friends Only</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Learning Preferences */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Autoplay Videos</label>
                              <p className="text-xs text-gray-500">Automatically play next lesson</p>
                            </div>
                            <button
                              onClick={() => handleSettingChange('autoplay', !settings.autoplay)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.autoplay ? 'bg-primary-600' : 'bg-gray-200'
                              }`}
                            >
                              <span className="sr-only">Toggle autoplay</span>
                              <span
                                className={`inline-block h-4 w-4 rounded-full transform transition-transform ${
                                  settings.autoplay ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Download Quality</label>
                              <p className="text-xs text-gray-500">Default video download quality</p>
                            </div>
                            <select
                              value={settings.downloadQuality}
                              onChange={(e) => handleSettingChange('downloadQuality', e.target.value)}
                              className="input-field"
                            >
                              <option value="auto">Auto</option>
                              <option value="high">High (1080p)</option>
                              <option value="medium">Medium (720p)</option>
                              <option value="low">Low (480p)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                        <div className="space-y-3">
                          <button className="w-full btn-secondary text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </button>
                          <button className="w-full btn-secondary text-gray-600 hover:bg-gray-50">
                            <Download className="w-4 h-4 mr-2" />
                            Download My Data
                          </button>
                        </div>
                      </div>
                    </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
