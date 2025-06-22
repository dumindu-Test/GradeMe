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