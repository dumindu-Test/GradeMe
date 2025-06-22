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