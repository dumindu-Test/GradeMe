# 🎓 GradeMe
Modern Exam Management System built with Next.js and Supabase

A comprehensive platform for creating, managing, and taking exams with role-based access control, automatic scoring, and real-time analytics.

## ✨ Features

- **🔐 Authentication** - Secure login with Supabase Auth (demo mode available)
- **👥 Role-Based Access** - Separate interfaces for admins and students
- **📝 Exam Creation** - Multiple question types (multiple choice, short answer, essay)
- **⚡ Auto-Scoring** - Automatic grading for objective questions
- **📊 Analytics** - Real-time exam statistics and performance tracking
- **🎨 Modern UI** - Beautiful, responsive design with Tailwind CSS
- **🔒 Security** - Row-Level Security (RLS) with comprehensive policies

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# View setup options and generate migration files
npm run db:setup

# Or just generate the combined SQL file
npm run db:generate
```

### 3. Configure Supabase (Optional)
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Start Development Server
```bash
npm run dev
```

## 🔧 Database Setup

This project uses a comprehensive migration system for database management:

- **📁 Migrations**: Located in `supabase/migrations/`
- **🛠️ Setup Tool**: `npm run db:setup` for guided setup
- **📖 Documentation**: See `supabase/README.md` for detailed instructions

### Setup Options:

1. **Supabase CLI** (Recommended)
2. **Cloud Dashboard** with combined SQL file
3. **Individual migration files**

## 🎮 Demo Mode

The application works without Supabase configuration using demo credentials:

- **Admin**: `admin@grademe.com` / `admin123`
- **Student**: `student@university.edu` / `student123`

## 📚 Documentation

- **Database Schema**: `supabase/README.md`
- **Migration Files**: `supabase/migrations/`
- **Setup Scripts**: `scripts/setup-database.js`

## 🛠️ Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:setup     # Database setup wizard
npm run db:info      # View migration info
npm run db:generate  # Generate combined SQL file
```

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## 📋 Project Structure

```
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── supabase/           # Database migrations & config
├── scripts/            # Setup and utility scripts
├── lib/                # Utility functions
└── contexts/           # React contexts
```
