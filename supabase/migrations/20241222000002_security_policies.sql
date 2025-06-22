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