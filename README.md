# 🎙️ Podforge

**Podforge** is a modern podcast platform that allows users to discover, upload, share, and interact with audio content. Built with Next.js 15, TypeScript, and a robust backend architecture.

## ✨ Features

### 🎧 Core Functionality
- **Discover Podcasts**: Browse recent and popular podcasts
- **Audio Streaming**: Built-in audio player for seamless listening
- **Search & Filter**: Find podcasts by title, description, or tags
- **User Authentication**: Secure registration and login system

### 👥 Social Features
- **Like System**: Like/unlike podcasts
- **Comments**: Engage with podcast content through comments
- **User Profiles**: Manage your profile and view uploaded content
- **My Podcasts**: Dashboard for managing your uploaded podcasts

### 📱 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme Support**: Comfortable viewing in any environment
- **Modern UI**: Clean and intuitive interface with smooth animations
- **Real-time Updates**: Dynamic content loading and interactions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Icons & Lucide React** - Beautiful icon libraries
- **Zustand** - Lightweight state management

### Backend & Database
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Supabase** - Backend-as-a-Service for authentication and storage
- **Cloudinary** - Media management and optimization

### Additional Tools
- **JWT** - Secure authentication tokens
- **bcryptjs** - Password hashing
- **Axios** - HTTP client for API requests
- **date-fns** - Date manipulation utilities
- **Swiper** - Touch-enabled carousels
- **Sonner** - Toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Supabase account
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TanmmayRJoseph/podforge
   cd podforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/podforge"
   DIRECT_URL="postgresql://username:password@localhost:5432/podforge"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # JWT
   JWT_SECRET="your-jwt-secret"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
podforge/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── podcasts/       # Podcast-related endpoints
│   │   │   └── users/          # User management endpoints
│   │   ├── pages/              # Application pages
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── login/          # Login page
│   │   │   ├── podcasts/       # Podcast detail pages
│   │   │   ├── postPodcast/    # Upload podcast page
│   │   │   └── ...
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable React components
│   │   ├── AudioPlayer.tsx     # Audio playback component
│   │   ├── CommentSection.tsx  # Comment functionality
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── PodcastCard.tsx     # Podcast display card
│   │   └── ...
│   ├── store/                  # Zustand state management
│   │   └── auth.ts             # Authentication state
│   └── utils/                  # Utility functions
│       ├── cloudinary.ts       # Cloudinary configuration
│       ├── prisma.ts           # Prisma client setup
│       └── supabaseClient.ts   # Supabase configuration
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
└── ...configuration files
```

## 📊 Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: User accounts with authentication
- **Podcasts**: Audio content with metadata
- **Likes**: User interactions with podcasts
- **Comments**: User engagement and discussions

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev   # Create and apply migrations
npx prisma generate      # Generate Prisma client

# Code Quality
npm run lint         # Run ESLint
```

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with email/password
2. **Login**: JWT-based authentication
3. **Protected Routes**: Middleware-based route protection
4. **Session Management**: Zustand-based client-side state

## 📱 Key Components

- **AudioPlayer**: Custom audio player with playback controls
- **PodcastCard**: Reusable podcast display component
- **CommentSection**: Interactive commenting system
- **Navbar**: Responsive navigation with authentication state

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean**

Ensure all environment variables are properly configured in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**Built with ❤️ for the podcast community**
