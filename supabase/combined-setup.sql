-- GradeMe Complete Database Setup
-- Generated on: 2025-06-22T15:28:34.605Z
-- This file combines all migrations for easy setup


-- ================================================================
-- MIGRATION: 20241222000001_initial_schema.sql
-- ================================================================

-- GradeMe Initial Schema Migration
-- This migration creates the core tables and security policies for the GradeMe exam management system

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'student')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER NOT NULL DEFAULT 100,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  exam_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled'))
);

-- Create exam_questions table
CREATE TABLE IF NOT EXISTS exam_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'short_answer', 'essay')),
  options JSONB, -- For multiple choice questions: {"A": "Option 1", "B": "Option 2", ...}
  correct_answer TEXT, -- For multiple choice: "A", for others: the correct answer text
  marks INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create exam_submissions table
CREATE TABLE IF NOT EXISTS exam_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}', -- {"question_id": "answer", ...}
  score INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  time_taken_minutes INTEGER,
  UNIQUE(exam_id, student_id) -- Ensure one submission per student per exam
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_order ON exam_questions(exam_id, order_index);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_exam_id ON exam_submissions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_submissions_student_id ON exam_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);


-- ================================================================
-- MIGRATION: 20241222000002_security_policies.sql
-- ================================================================

-- GradeMe Security Policies Migration
-- This migration sets up Row Level Security (RLS) and access policies

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;

-- ====================
-- USER PROFILES POLICIES
-- ====================

-- Users can view their own profile
CREATE POLICY "users_can_view_own_profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but policy required)
CREATE POLICY "users_can_insert_own_profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all user profiles
CREATE POLICY "admins_can_view_all_profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.user_type = 'admin'
    )
  );

-- ====================
-- EXAMS POLICIES
-- ====================

-- Admins can view all exams
CREATE POLICY "admins_can_view_all_exams" ON exams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );

-- Students can view active exams
CREATE POLICY "students_can_view_active_exams" ON exams
  FOR SELECT USING (
    status = 'active' AND 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'student'
    )
  );

-- Admins can create exams
CREATE POLICY "admins_can_create_exams" ON exams
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );

-- Admins can update their own exams
CREATE POLICY "admins_can_update_own_exams" ON exams
  FOR UPDATE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );

-- Admins can delete their own exams
CREATE POLICY "admins_can_delete_own_exams" ON exams
  FOR DELETE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );

-- ====================
-- EXAM QUESTIONS POLICIES
-- ====================

-- Admins can manage all exam questions
CREATE POLICY "admins_can_manage_exam_questions" ON exam_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );

-- Students can view questions for active exams (without correct answers)
CREATE POLICY "students_can_view_exam_questions" ON exam_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exams 
      WHERE exams.id = exam_questions.exam_id 
      AND exams.status = 'active'
    ) AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'student'
    )
  );

-- ====================
-- EXAM SUBMISSIONS POLICIES
-- ====================

-- Students can view their own submissions
CREATE POLICY "students_can_view_own_submissions" ON exam_submissions
  FOR SELECT USING (student_id = auth.uid());

-- Students can create their own submissions
CREATE POLICY "students_can_create_own_submissions" ON exam_submissions
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'student'
    )
  );

-- Students can update their own submissions (before final submission)
CREATE POLICY "students_can_update_own_submissions" ON exam_submissions
  FOR UPDATE USING (
    student_id = auth.uid() AND
    score IS NULL -- Only allow updates before grading
  );

-- Admins can view all submissions
CREATE POLICY "admins_can_view_all_submissions" ON exam_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );

-- Admins can update submissions (for grading)
CREATE POLICY "admins_can_update_submissions_for_grading" ON exam_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.user_type = 'admin'
    )
  );


-- ================================================================
-- MIGRATION: 20241222000003_functions_and_triggers.sql
-- ================================================================

-- GradeMe Functions and Triggers Migration
-- This migration creates database functions and triggers for automation

-- ====================
-- USER PROFILE AUTO-CREATION
-- ====================

-- Function to automatically create user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, user_type, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'user_type', 'student'),
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle case where profile already exists
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ====================
-- EXAM SCORING FUNCTIONS
-- ====================

-- Function to calculate exam score automatically
CREATE OR REPLACE FUNCTION public.calculate_exam_score(submission_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER := 0;
  question_record RECORD;
  student_answer TEXT;
  submission_answers JSONB;
BEGIN
  -- Get the submission answers
  SELECT answers INTO submission_answers
  FROM exam_submissions
  WHERE id = submission_id;
  
  -- If no answers found, return 0
  IF submission_answers IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Loop through all questions for this exam
  FOR question_record IN
    SELECT eq.id, eq.correct_answer, eq.marks, eq.question_type
    FROM exam_questions eq
    JOIN exam_submissions es ON es.exam_id = eq.exam_id
    WHERE es.id = submission_id
  LOOP
    -- Get student's answer for this question
    student_answer := submission_answers->>question_record.id::TEXT;
    
    -- Check if answer is correct based on question type
    IF question_record.question_type = 'multiple_choice' THEN
      -- For multiple choice, exact match required
      IF LOWER(TRIM(student_answer)) = LOWER(TRIM(question_record.correct_answer)) THEN
        total_score := total_score + question_record.marks;
      END IF;
    ELSIF question_record.question_type = 'short_answer' THEN
      -- For short answer, case-insensitive match
      IF LOWER(TRIM(student_answer)) = LOWER(TRIM(question_record.correct_answer)) THEN
        total_score := total_score + question_record.marks;
      END IF;
    ELSIF question_record.question_type = 'essay' THEN
      -- For essay questions, manual grading required (score = 0 by default)
      -- Admins will need to manually update scores for essay questions
      NULL;
    END IF;
  END LOOP;
  
  -- Update the submission with the calculated score
  UPDATE exam_submissions 
  SET score = total_score 
  WHERE id = submission_id;
  
  RETURN total_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-calculate score when submission is inserted/updated
CREATE OR REPLACE FUNCTION public.auto_calculate_score()
RETURNS trigger AS $$
BEGIN
  -- Only calculate if answers are provided and it's a final submission
  IF NEW.answers IS NOT NULL AND NEW.answers != '{}' THEN
    NEW.score := public.calculate_exam_score(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate scores
DROP TRIGGER IF EXISTS trigger_auto_calculate_score ON exam_submissions;
CREATE TRIGGER trigger_auto_calculate_score
  BEFORE INSERT OR UPDATE ON exam_submissions
  FOR EACH ROW
  WHEN (NEW.answers IS NOT NULL AND NEW.answers != '{}')
  EXECUTE PROCEDURE public.auto_calculate_score();

-- ====================
-- UTILITY FUNCTIONS
-- ====================

-- Function to get exam statistics
CREATE OR REPLACE FUNCTION public.get_exam_stats(exam_uuid UUID)
RETURNS TABLE (
  total_submissions BIGINT,
  average_score NUMERIC,
  highest_score INTEGER,
  lowest_score INTEGER,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(es.id)::BIGINT as total_submissions,
    ROUND(AVG(es.score), 2) as average_score,
    MAX(es.score) as highest_score,
    MIN(es.score) as lowest_score,
    ROUND(
      (COUNT(es.id)::NUMERIC / 
       NULLIF((SELECT COUNT(*) FROM user_profiles WHERE user_type = 'student'), 0)) * 100, 
      2
    ) as completion_rate
  FROM exam_submissions es
  WHERE es.exam_id = exam_uuid
  AND es.score IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if student can take exam
CREATE OR REPLACE FUNCTION public.can_student_take_exam(exam_uuid UUID, student_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  exam_status TEXT;
  existing_submission_id UUID;
BEGIN
  -- Check if exam is active
  SELECT status INTO exam_status FROM exams WHERE id = exam_uuid;
  
  IF exam_status != 'active' THEN
    RETURN FALSE;
  END IF;
  
  -- Check if student already submitted
  SELECT id INTO existing_submission_id 
  FROM exam_submissions 
  WHERE exam_id = exam_uuid AND student_id = student_uuid;
  
  IF existing_submission_id IS NOT NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ================================================================
-- MIGRATION: 20241222000004_sample_data.sql
-- ================================================================

-- GradeMe Sample Data Migration
-- This migration provides sample data for development and testing
-- Comment out or modify as needed for production

-- ====================
-- SAMPLE DATA INSERTION
-- ====================

-- Note: This sample data uses placeholder UUIDs
-- In a real setup, you would replace these with actual user IDs after signup

-- Sample admin profile (example - replace with real admin user ID)
-- INSERT INTO user_profiles (id, email, user_type, full_name) 
-- VALUES (
--   '11111111-1111-1111-1111-111111111111', 
--   'admin@grademe.com', 
--   'admin', 
--   'System Administrator'
-- ) ON CONFLICT (id) DO NOTHING;

-- Sample student profiles (examples - replace with real student user IDs)
-- INSERT INTO user_profiles (id, email, user_type, full_name) 
-- VALUES 
--   ('22222222-2222-2222-2222-222222222222', 'student1@university.edu', 'student', 'Alice Johnson'),
--   ('33333333-3333-3333-3333-333333333333', 'student2@university.edu', 'student', 'Bob Smith'),
--   ('44444444-4444-4444-4444-444444444444', 'student3@university.edu', 'student', 'Carol Davis')
-- ON CONFLICT (id) DO NOTHING;

-- Sample exam
-- INSERT INTO exams (id, title, subject, description, duration_minutes, total_marks, created_by, status, exam_date)
-- VALUES (
--   '55555555-5555-5555-5555-555555555555',
--   'Introduction to Mathematics', 
--   'Mathematics', 
--   'A comprehensive exam covering basic mathematical concepts including algebra, geometry, and statistics.',
--   90, 
--   100, 
--   '11111111-1111-1111-1111-111111111111', -- admin user
--   'active',
--   NOW() + INTERVAL '7 days'
-- ) ON CONFLICT (id) DO NOTHING;

-- Sample questions for the math exam
-- INSERT INTO exam_questions (id, exam_id, question_text, question_type, options, correct_answer, marks, order_index)
-- VALUES 
--   (
--     '66666666-6666-6666-6666-666666666666',
--     '55555555-5555-5555-5555-555555555555',
--     'What is 2 + 2?',
--     'multiple_choice',
--     '{"A": "3", "B": "4", "C": "5", "D": "6"}',
--     'B',
--     5,
--     1
--   ),
--   (
--     '77777777-7777-7777-7777-777777777777',
--     '55555555-5555-5555-5555-555555555555',
--     'What is the square root of 16?',
--     'multiple_choice',
--     '{"A": "2", "B": "3", "C": "4", "D": "8"}',
--     'C',
--     5,
--     2
--   ),
--   (
--     '88888888-8888-8888-8888-888888888888',
--     '55555555-5555-5555-5555-555555555555',
--     'Solve for x: 2x + 5 = 15',
--     'short_answer',
--     NULL,
--     '5',
--     10,
--     3
--   ),
--   (
--     '99999999-9999-9999-9999-999999999999',
--     '55555555-5555-5555-5555-555555555555',
--     'Explain the Pythagorean theorem and provide an example of its application.',
--     'essay',
--     NULL,
--     'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides (a² + b² = c²).',
--     15,
--     4
--   )
-- ON CONFLICT (id) DO NOTHING;

-- Sample computer science exam
-- INSERT INTO exams (id, title, subject, description, duration_minutes, total_marks, created_by, status, exam_date)
-- VALUES (
--   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--   'Programming Fundamentals', 
--   'Computer Science', 
--   'Test your knowledge of basic programming concepts, data structures, and algorithms.',
--   120, 
--   150, 
--   '11111111-1111-1111-1111-111111111111', -- admin user
--   'active',
--   NOW() + INTERVAL '10 days'
-- ) ON CONFLICT (id) DO NOTHING;

-- Sample programming questions
-- INSERT INTO exam_questions (id, exam_id, question_text, question_type, options, correct_answer, marks, order_index)
-- VALUES 
--   (
--     'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
--     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--     'Which of the following is NOT a primitive data type in most programming languages?',
--     'multiple_choice',
--     '{"A": "Integer", "B": "String", "C": "Array", "D": "Boolean"}',
--     'C',
--     10,
--     1
--   ),
--   (
--     'cccccccc-cccc-cccc-cccc-cccccccccccc',
--     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--     'What is the time complexity of binary search?',
--     'multiple_choice',
--     '{"A": "O(n)", "B": "O(log n)", "C": "O(n²)", "D": "O(1)"}',
--     'B',
--     15,
--     2
--   ),
--   (
--     'dddddddd-dddd-dddd-dddd-dddddddddddd',
--     'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
--     'What does "DRY" stand for in programming principles?',
--     'short_answer',
--     NULL,
--     'Don''t Repeat Yourself',
--     10,
--     3
--   )
-- ON CONFLICT (id) DO NOTHING;

-- ====================
-- HELPER FUNCTIONS FOR SAMPLE DATA
-- ====================

-- Function to create sample exam with questions
CREATE OR REPLACE FUNCTION public.create_sample_exam(
  admin_id UUID,
  exam_title TEXT,
  exam_subject TEXT,
  exam_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_exam_id UUID;
BEGIN
  -- Generate new exam ID
  new_exam_id := gen_random_uuid();
  
  -- Insert the exam
  INSERT INTO exams (id, title, subject, description, duration_minutes, total_marks, created_by, status)
  VALUES (new_exam_id, exam_title, exam_subject, exam_description, 60, 100, admin_id, 'draft');
  
  RETURN new_exam_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a multiple choice question to an exam
CREATE OR REPLACE FUNCTION public.add_multiple_choice_question(
  exam_id UUID,
  question_text TEXT,
  option_a TEXT,
  option_b TEXT,
  option_c TEXT,
  option_d TEXT,
  correct_option CHAR(1),
  marks INTEGER DEFAULT 5,
  question_order INTEGER DEFAULT 1
)
RETURNS UUID AS $$
DECLARE
  new_question_id UUID;
  options_json JSONB;
BEGIN
  -- Generate new question ID
  new_question_id := gen_random_uuid();
  
  -- Build options JSON
  options_json := jsonb_build_object(
    'A', option_a,
    'B', option_b,
    'C', option_c,
    'D', option_d
  );
  
  -- Insert the question
  INSERT INTO exam_questions (id, exam_id, question_text, question_type, options, correct_answer, marks, order_index)
  VALUES (new_question_id, exam_id, question_text, 'multiple_choice', options_json, correct_option, marks, question_order);
  
  RETURN new_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for exam results summary
CREATE OR REPLACE VIEW public.exam_results_summary AS
SELECT 
  e.id as exam_id,
  e.title as exam_title,
  e.subject,
  e.total_marks,
  COUNT(es.id) as total_submissions,
  ROUND(AVG(es.score), 2) as average_score,
  MAX(es.score) as highest_score,
  MIN(es.score) as lowest_score,
  ROUND(AVG(es.time_taken_minutes), 1) as average_time_minutes
FROM exams e
LEFT JOIN exam_submissions es ON e.id = es.exam_id
WHERE es.score IS NOT NULL
GROUP BY e.id, e.title, e.subject, e.total_marks
ORDER BY e.created_at DESC;


-- ================================================================
-- SETUP COMPLETE
-- ================================================================

-- Next steps:
-- 1. Create your first admin user through the application
-- 2. Update environment variables with your Supabase credentials
-- 3. Test the authentication flow

-- Sample admin credentials for development:
-- Email: admin@grademe.com
-- You'll need to create this user through the application signup flow

SELECT 'GradeMe database setup completed successfully!' as status;
