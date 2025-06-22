'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Flag,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Timer
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface ExamQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  points: number;
}

interface ExamData {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number; // in minutes
  instructions: string;
  questions: ExamQuestion[];
  totalPoints: number;
}

interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  flagged: boolean;
}

export default function TakeExam() {
  const [exam, setExam] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const examId = params.id as string;

  console.log('TakeExam rendered for exam:', examId);

  // Load exam data
  useEffect(() => {
    console.log('Loading exam data');
    
    // Simulate API call to fetch exam data
    setTimeout(() => {
      const mockExam: ExamData = {
        id: examId,
        title: 'Mathematics Final Exam',
        subject: 'Mathematics',
        description: 'Final examination covering all topics from the semester',
        duration: 120, // 120 minutes
        instructions: 'Read all questions carefully. Show your work for full credit. You may use a calculator for computational questions.',
        totalPoints: 100,
        questions: [
          {
            id: '1',
            type: 'multiple-choice',
            question: 'What is the derivative of f(x) = x² + 3x + 2?',
            options: ['2x + 3', 'x² + 3', '2x + 2', 'x + 3'],
            points: 5
          },
          {
            id: '2',
            type: 'true-false',
            question: 'The integral of sin(x) is -cos(x) + C.',
            points: 3
          },
          {
            id: '3',
            type: 'short-answer',
            question: 'Solve for x: 2x + 5 = 15',
            points: 7
          },
          {
            id: '4',
            type: 'essay',
            question: 'Explain the concept of limits in calculus and provide an example of how limits are used to define derivatives.',
            points: 15
          },
          {
            id: '5',
            type: 'multiple-choice',
            question: 'Which of the following is equivalent to log₂(8)?',
            options: ['2', '3', '4', '8'],
            points: 5
          }
        ]
      };
      
      setExam(mockExam);
      setAnswers(mockExam.questions.map(q => ({
        questionId: q.id,
        answer: '',
        flagged: false
      })));
    }, 1000);
  }, [examId]);

  // Timer functionality
  useEffect(() => {
    if (!examStarted || !exam) return;

    setTimeRemaining(exam.duration * 60); // Convert minutes to seconds
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, exam]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    console.log('Starting exam');
    setExamStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    console.log('Answer changed:', questionId, answer);
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, answer } 
          : a
      )
    );
  };

  const handleFlagQuestion = (questionId: string) => {
    console.log('Flagging question:', questionId);
    setAnswers(prev => 
      prev.map(a => 
        a.questionId === questionId 
          ? { ...a, flagged: !a.flagged } 
          : a
      )
    );
  };

  const handleSubmitExam = useCallback(() => {
    console.log('Submitting exam with answers:', answers);
    setIsSubmitting(true);
    
    // Simulate API call to submit exam
    setTimeout(() => {
      toast({
        title: "Exam Submitted",
        description: "Your exam has been submitted successfully!",
      });
      router.push('/student/dashboard');
    }, 2000);
  }, [answers, router, toast]);

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getAnsweredCount = () => {
    return answers.filter(a => a.answer && a.answer.length > 0).length;
  };

  const getFlaggedCount = () => {
    return answers.filter(a => a.flagged).length;
  };

  if (!exam) {
    return (
      <div className="min-h-screen bg-grademe-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grademe-blue mx-auto mb-4"></div>
          <p>Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-grademe-gray flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{exam.title}</CardTitle>
            <CardDescription>{exam.subject}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-grademe-dark-slate mb-4">{exam.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-grademe-blue/10 rounded-lg">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-grademe-blue" />
                  <div className="font-semibold">{exam.duration} minutes</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-grademe-green/10 rounded-lg">
                  <BookOpen className="h-6 w-6 mx-auto mb-2 text-grademe-green" />
                  <div className="font-semibold">{exam.questions.length} questions</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center p-4 bg-orange-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="font-semibold">{exam.totalPoints} points</div>
                  <div className="text-sm text-gray-600">Total Points</div>
                </div>
              </div>
            </div>

            {exam.instructions && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <p className="text-sm text-gray-700">{exam.instructions}</p>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-semibold text-yellow-800">Important Notes:</h3>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• You cannot pause the exam once started</li>
                <li>• Make sure you have a stable internet connection</li>
                <li>• The exam will auto-submit when time runs out</li>
                <li>• You can flag questions for review</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/student/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={startExam} className="bg-grademe-blue hover:bg-grademe-dark-blue">
                <Timer className="h-4 w-4 mr-2" />
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-grademe-gray">
      {/* Header with Timer */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-grademe-dark-slate">{exam.title}</h1>
              <p className="text-sm text-gray-600">{exam.subject}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-grademe-blue/10 text-grademe-blue'
              }`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Submit Exam</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Exam</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to submit your exam? You have answered {getAnsweredCount()} out of {exam.questions.length} questions.
                      {getFlaggedCount() > 0 && ` You have ${getFlaggedCount()} flagged questions.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmitExam} disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
                <CardDescription>
                  {getAnsweredCount()}/{exam.questions.length} answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 lg:grid-cols-4 gap-2 mb-4">
                  {exam.questions.map((question, index) => {
                    const answer = answers.find(a => a.questionId === question.id);
                    const isAnswered = answer && answer.answer && answer.answer.length > 0;
                    const isFlagged = answer?.flagged;
                    const isCurrent = index === currentQuestionIndex;
                    
                    return (
                      <Button
                        key={question.id}
                        variant={isCurrent ? "default" : "outline"}
                        size="sm"
                        className={`relative h-10 w-10 p-0 ${
                          isCurrent ? 'bg-grademe-blue' : 
                          isAnswered ? 'bg-grademe-green/10 text-grademe-green border-grademe-green' :
                          'hover:bg-gray-50'
                        }`}
                        onClick={() => goToQuestion(index)}
                      >
                        {index + 1}
                        {isFlagged && (
                          <Flag className="h-3 w-3 absolute -top-1 -right-1 text-orange-500 fill-current" />
                        )}
                      </Button>
                    );
                  })}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-grademe-blue rounded mr-2"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-grademe-green/20 border border-grademe-green rounded mr-2"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center">
                    <Flag className="h-3 w-3 text-orange-500 fill-current mr-2" />
                    <span>Flagged</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </CardTitle>
                    <CardDescription>
                      {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFlagQuestion(currentQuestion.id)}
                    className={currentAnswer?.flagged ? 'bg-orange-50 text-orange-700 border-orange-300' : ''}
                  >
                    <Flag className={`h-4 w-4 mr-2 ${currentAnswer?.flagged ? 'fill-current' : ''}`} />
                    {currentAnswer?.flagged ? 'Unflag' : 'Flag'}
                  </Button>
                </div>
                <Progress value={progress} className="mt-4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose max-w-none">
                  <p className="text-lg text-grademe-dark-slate">{currentQuestion.question}</p>
                </div>

                {/* Question Type Specific Inputs */}
                {currentQuestion.type === 'multiple-choice' && (
                  <RadioGroup
                    value={currentAnswer?.answer as string || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {String.fromCharCode(65 + index)}. {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.type === 'true-false' && (
                  <RadioGroup
                    value={currentAnswer?.answer as string || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="cursor-pointer">True</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="cursor-pointer">False</Label>
                    </div>
                  </RadioGroup>
                )}

                {currentQuestion.type === 'short-answer' && (
                  <div>
                    <Label htmlFor="short-answer">Your Answer</Label>
                    <Input
                      id="short-answer"
                      placeholder="Enter your answer..."
                      value={currentAnswer?.answer as string || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="mt-2"
                    />
                  </div>
                )}

                {currentQuestion.type === 'essay' && (
                  <div>
                    <Label htmlFor="essay">Your Essay</Label>
                    <Textarea
                      id="essay"
                      placeholder="Write your essay here..."
                      value={currentAnswer?.answer as string || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="mt-2 min-h-[200px]"
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {exam.questions.length}
                  </span>
                  
                  <Button
                    onClick={nextQuestion}
                    disabled={currentQuestionIndex === exam.questions.length - 1}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}