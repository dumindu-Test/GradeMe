'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Save, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users,
  Trash2,
  Edit,
  FileText
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

interface ExamData {
  title: string;
  description: string;
  subject: string;
  duration: number;
  totalPoints: number;
  instructions: string;
  questions: Question[];
}

export default function CreateExam() {
  const [examData, setExamData] = useState<ExamData>({
    title: '',
    description: '',
    subject: '',
    duration: 60,
    totalPoints: 0,
    instructions: '',
    questions: []
  });

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  console.log('CreateExam rendered');

  const handleInputChange = (field: keyof ExamData, value: any) => {
    console.log('Exam data changed:', field, value);
    setExamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (field: keyof Question, value: any) => {
    console.log('Question data changed:', field, value);
    setNewQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddQuestion = () => {
    console.log('Adding new question:', newQuestion);
    
    if (!newQuestion.question || !newQuestion.points) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for the question.",
        variant: "destructive",
      });
      return;
    }

    const questionToAdd: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as Question['type'],
      question: newQuestion.question,
      options: newQuestion.options,
      correctAnswer: newQuestion.correctAnswer,
      points: newQuestion.points || 1
    };

    if (editingQuestionId) {
      // Update existing question
      setExamData(prev => ({
        ...prev,
        questions: prev.questions.map(q => 
          q.id === editingQuestionId ? questionToAdd : q
        ),
        totalPoints: prev.questions.reduce((sum, q) => sum + (q.id === editingQuestionId ? questionToAdd.points : q.points), 0)
      }));
      setEditingQuestionId(null);
    } else {
      // Add new question
      setExamData(prev => ({
        ...prev,
        questions: [...prev.questions, questionToAdd],
        totalPoints: prev.totalPoints + questionToAdd.points
      }));
    }

    // Reset form
    setNewQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
    setIsQuestionDialogOpen(false);

    toast({
      title: "Success",
      description: editingQuestionId ? "Question updated successfully!" : "Question added successfully!",
    });
  };

  const handleEditQuestion = (question: Question) => {
    console.log('Editing question:', question.id);
    setNewQuestion(question);
    setEditingQuestionId(question.id);
    setIsQuestionDialogOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    console.log('Deleting question:', questionId);
    const questionToDelete = examData.questions.find(q => q.id === questionId);
    if (questionToDelete) {
      setExamData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId),
        totalPoints: prev.totalPoints - questionToDelete.points
      }));
      
      toast({
        title: "Success",
        description: "Question deleted successfully!",
      });
    }
  };

  const handleSaveExam = () => {
    console.log('Saving exam:', examData);
    
    if (!examData.title || !examData.subject || examData.questions.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one question.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Exam created successfully!",
      });
      router.push('/admin/dashboard');
    }, 1000);
  };

  const renderQuestionForm = () => {
    switch (newQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <div>
              <Label>Options</Label>
              {newQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(newQuestion.options || [])];
                      newOptions[index] = e.target.value;
                      handleQuestionChange('options', newOptions);
                    }}
                  />
                  <Checkbox
                    checked={newQuestion.correctAnswer === option}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleQuestionChange('correctAnswer', option);
                      }
                    }}
                  />
                  <Label className="text-sm">Correct</Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'true-false':
        return (
          <div>
            <Label>Correct Answer</Label>
            <RadioGroup
              value={newQuestion.correctAnswer as string}
              onValueChange={(value) => handleQuestionChange('correctAnswer', value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </RadioGroup>
          </div>
        );
      
      default:
        return (
          <div>
            <Label>Sample Answer (Optional)</Label>
            <Textarea
              placeholder="Provide a sample answer or grading criteria..."
              value={newQuestion.correctAnswer as string || ''}
              onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
              className="mt-2"
            />
          </div>
        );
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Multiple Choice';
      case 'true-false': return 'True/False';
      case 'short-answer': return 'Short Answer';
      case 'essay': return 'Essay';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-grademe-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/admin/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-grademe-dark-slate">Create New Exam</h1>
            </div>
            <Button onClick={handleSaveExam}>
              <Save className="h-4 w-4 mr-2" />
              Save Exam
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exam Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-grademe-blue" />
                  Exam Details
                </CardTitle>
                <CardDescription>Basic information about the exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Mathematics Final Exam"
                      value={examData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select onValueChange={(value) => handleInputChange('subject', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the exam..."
                    value={examData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={examData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Total Points</Label>
                    <Input
                      value={examData.totalPoints}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Special instructions for students..."
                    value={examData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-grademe-blue" />
                      Questions ({examData.questions.length})
                    </CardTitle>
                    <CardDescription>Manage exam questions</CardDescription>
                  </div>
                  <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Question
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingQuestionId ? 'Edit Question' : 'Add New Question'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Question Type</Label>
                          <Select 
                            value={newQuestion.type} 
                            onValueChange={(value) => handleQuestionChange('type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="true-false">True/False</SelectItem>
                              <SelectItem value="short-answer">Short Answer</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Question *</Label>
                          <Textarea
                            placeholder="Enter your question..."
                            value={newQuestion.question}
                            onChange={(e) => handleQuestionChange('question', e.target.value)}
                          />
                        </div>

                        {renderQuestionForm()}

                        <div>
                          <Label>Points *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={newQuestion.points}
                            onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsQuestionDialogOpen(false);
                              setEditingQuestionId(null);
                              setNewQuestion({
                                type: 'multiple-choice',
                                question: '',
                                options: ['', '', '', ''],
                                correctAnswer: '',
                                points: 1
                              });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleAddQuestion}>
                            {editingQuestionId ? 'Update Question' : 'Add Question'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {examData.questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions added yet</p>
                    <p className="text-sm">Click "Add Question" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {examData.questions.map((question, index) => (
                      <div key={question.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">
                                Question {index + 1}
                              </Badge>
                              <Badge className="bg-grademe-blue text-white">
                                {getQuestionTypeLabel(question.type)}
                              </Badge>
                              <Badge className="bg-grademe-green text-white">
                                {question.points} {question.points === 1 ? 'point' : 'points'}
                              </Badge>
                            </div>
                            <p className="text-grademe-dark-slate font-medium">{question.question}</p>
                            
                            {question.type === 'multiple-choice' && question.options && (
                              <div className="mt-2 space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex} 
                                    className={`text-sm px-2 py-1 rounded ${
                                      option === question.correctAnswer 
                                        ? 'bg-grademe-green/10 text-grademe-green font-medium' 
                                        : 'text-gray-600'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}. {option}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {question.type === 'true-false' && (
                              <div className="mt-2">
                                <span className="text-sm text-grademe-green font-medium">
                                  Correct Answer: {question.correctAnswer}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exam Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Questions</span>
                  </div>
                  <Badge>{examData.questions.length}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <Badge>{examData.duration} min</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">Total Points</span>
                  </div>
                  <Badge className="bg-grademe-green text-white">{examData.totalPoints}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(
                    examData.questions.reduce((acc, q) => {
                      acc[q.type] = (acc[q.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm">{getQuestionTypeLabel(type)}</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                  {examData.questions.length === 0 && (
                    <p className="text-sm text-gray-500">No questions added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}