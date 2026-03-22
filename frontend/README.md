# AI Learning Platform Frontend

A modern, responsive frontend for the AI-powered Learning Management System built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3001` (or the port shown in terminal)

## 🎨 Design System

### Color Palette
- **Primary**: Blue 600 (#3B82F6)
- **Secondary**: Gray 100-900 spectrum
- **Accent**: Indigo shades
- **Background**: White with subtle gray variations

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Responsive**: Fluid scaling

### Components
- **Glass Cards**: Backdrop blur with white/80 opacity
- **Buttons**: Primary/secondary variants with hover states
- **Forms**: Consistent input styling with focus states
- **Animations**: Smooth transitions using Framer Motion

## 📱 Features

### ✅ Implemented Pages
- **Landing Page** (`/`) - Hero, features, courses, testimonials
- **Authentication** (`/login`, `/register`) - Modern forms with validation
- **Courses** (`/courses`) - Grid layout with search and filters
- **Course Detail** (`/courses/[id]`) - Individual course information
- **Learning Interface** (`/learn/[id]`) - Video player with sidebar
- **AI Tutor** - Chat interface integrated in learning page
- **User Profile** (`/profile`) - Progress tracking and settings

### 🎯 Key Features
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: CSS variables for easy implementation
- **Smooth Animations**: Page transitions and micro-interactions
- **Search & Filter**: Real-time course filtering
- **Progress Tracking**: Visual progress indicators
- **AI Integration**: Chat interface for learning assistance
- **Video Player**: YouTube integration with custom controls
- **Lesson Navigation**: Sequential learning with locked lessons

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.3+
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Video Player**: React YouTube
- **Forms**: Controlled components with validation

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/          # Authentication pages group
│   │   ├── courses/          # Course-related pages
│   │   ├── learn/             # Learning interface
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   ├── ui/               # Reusable UI components
│   │   └── forms/            # Form components
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🎨 Design Principles

### Visual Hierarchy
- **Primary Actions**: Blue buttons, prominent placement
- **Secondary Actions**: Gray buttons, subtle appearance
- **Interactive Elements**: Hover states, smooth transitions
- **Information**: Clear typography hierarchy

### Spacing System
- **Generous Padding**: 16px, 24px, 32px increments
- **Consistent Margins**: 8px base unit
- **Responsive Scaling**: Mobile-first approach

### Animation Guidelines
- **Duration**: Fast (200-300ms) for micro-interactions
- **Easing**: Ease-out for most transitions
- **Delays**: Staggered animations for lists
- **Performance**: GPU-accelerated transforms

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌐 Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 📱 Browser Support

- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Test on multiple screen sizes
4. Maintain consistent component structure
5. Add proper error handling and loading states

## 📄 License

MIT License - feel free to use this project for your own purposes!
