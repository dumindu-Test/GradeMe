# GradeMe Supabase Database Setup

This directory contains all the database migrations and configuration for the GradeMe exam management system.

## 🗂️ Migration Files

The migrations are organized in chronological order:

1. **`20241222000001_initial_schema.sql`** - Creates all core tables and indexes
2. **`20241222000002_security_policies.sql`** - Sets up Row Level Security (RLS) and access policies
3. **`20241222000003_functions_and_triggers.sql`** - Database functions, triggers, and automation
4. **`20241222000004_sample_data.sql`** - Sample data and helper functions (optional)

## 🚀 Quick Setup Options

### Option 1: Supabase CLI (Recommended)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase in your project**
   ```bash
   supabase init
   ```

3. **Start local development**
   ```bash
   supabase start
   ```

4. **Apply migrations**
   ```bash
   supabase db reset
   ```

5. **Create your first admin user** through the app at `http://localhost:3000`

### Option 2: Supabase Cloud Dashboard

1. **Create a new project** at [supabase.com](https://supabase.com)

2. **Run migrations in order** through the SQL Editor:
   - Copy and paste each migration file content
   - Execute them in numerical order

3. **Update your environment variables**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 📊 Database Schema Overview

### Core Tables

- **`user_profiles`** - Extended user information and roles
- **`exams`** - Exam definitions and metadata
- **`exam_questions`** - Questions belonging to exams
- **`exam_submissions`** - Student answers and scores

### Key Features

- **Automatic User Profiles** - Created via trigger when users sign up
- **Role-Based Security** - RLS policies for admin/student access
- **Auto-Scoring** - Automatic scoring for multiple choice and short answer questions
- **Exam Statistics** - Built-in functions for analytics

## 🔐 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Admin Policies** - Admins can manage exams and view all data
- **Student Policies** - Students can only access their own data and active exams
- **Automatic Profile Creation** - User profiles created on signup

## 🧪 Sample Data

The sample data migration (`20241222000004_sample_data.sql`) includes:

- Example admin and student profiles
- Sample mathematics and computer science exams
- Various question types (multiple choice, short answer, essay)
- Helper functions for creating sample content

**Note:** Sample data uses placeholder UUIDs. Replace with actual user IDs after creating accounts.

## 🔧 Useful Database Functions

### Auto-Created Functions

- `calculate_exam_score(submission_id)` - Calculate score for a submission
- `get_exam_stats(exam_id)` - Get statistics for an exam
- `can_student_take_exam(exam_id, student_id)` - Check if student can take exam
- `create_sample_exam()` - Helper for creating sample exams
- `add_multiple_choice_question()` - Helper for adding questions

### Views

- `exam_results_summary` - Summary view of exam results and statistics

## 🔄 Making Changes

### Adding New Migrations

1. Create a new migration file with timestamp:
   ```
   supabase/migrations/YYYYMMDDHHMMSS_description.sql
   ```

2. Apply the migration:
   ```bash
   supabase db reset  # Local development
   ```

### Modifying Existing Tables

- Always use migrations for schema changes
- Never modify the initial migration files
- Create new migration files for changes

## 🐛 Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check if all migrations are applied in order
   - Verify no syntax errors in SQL files

2. **Permission Issues**
   - Ensure RLS policies are correctly configured
   - Check user roles in `user_profiles` table

3. **Function Errors**
   - Verify function signatures match usage
   - Check for missing dependencies

### Useful Queries

```sql
-- Check user profiles
SELECT * FROM user_profiles;

-- Check exam status
SELECT id, title, status, created_at FROM exams;

-- View submission scores
SELECT 
  e.title,
  up.full_name,
  es.score,
  es.submitted_at
FROM exam_submissions es
JOIN exams e ON es.exam_id = e.id
JOIN user_profiles up ON es.student_id = up.id;
```

## 📝 Environment Variables

Make sure to set these in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

The application will work in demo mode without these, but full functionality requires Supabase configuration.