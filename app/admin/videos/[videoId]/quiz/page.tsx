'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Question {
  id?: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: string[];
  correctAnswer?: string;
  expectedKeywords?: string[];
  explanation?: string;
  points: number;
}

interface Quiz {
  id?: string;
  title: string;
  description: string;
  passingScore: number;
  attempts: number;
  timeLimit?: number;
  questions: Question[];
}

export default function QuizManagementPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params?.videoId as string;

  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    description: '',
    passingScore: 70,
    attempts: 3,
    timeLimit: 0,
    questions: [],
  });

  const [videoTitle, setVideoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchVideoAndQuiz();
  }, [videoId]);

  const checkAuth = () => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      router.push('/');
      return;
    }
    const userData = JSON.parse(user);
    if (userData.role !== 'admin') {
      router.push('/journey');
    }
  };

  const fetchVideoAndQuiz = async () => {
    setIsLoading(true);
    try {
      // Fetch video details
      const videoResponse = await fetch(`/api/admin/videos/${videoId}`);
      if (videoResponse.ok) {
        const videoData = await videoResponse.json();
        setVideoTitle(videoData.title);
      }

      // Fetch quiz if exists
      const quizResponse = await fetch(`/api/admin/videos/${videoId}/quiz`);
      if (quizResponse.ok) {
        const quizData = await quizResponse.json();
        if (quizData.quiz) {
          setQuiz(quizData.quiz);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: '',
          type: 'multiple_choice',
          options: ['', '', '', ''],
          correctAnswer: '',
          explanation: '',
          points: 1,
        },
      ],
    });
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...quiz.questions];
    const options = [...(newQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    newQuestions[questionIndex].options = options;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const saveQuiz = async () => {
    if (!quiz.title || quiz.questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/videos/${videoId}/quiz`, {
        method: quiz.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz),
      });

      if (response.ok) {
        alert('Quiz saved successfully!');
        router.push('/admin/videos');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <button
              onClick={() => router.push('/admin/videos')}
              className="text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Videos
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
            <p className="text-gray-600 mt-1">Video: {videoTitle}</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Door Knocking Basics Quiz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={quiz.passingScore}
                  onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Attempts
                </label>
                <input
                  type="number"
                  value={quiz.attempts}
                  onChange={(e) => setQuiz({ ...quiz, attempts: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes, 0 = unlimited)
                </label>
                <input
                  type="number"
                  value={quiz.timeLimit || 0}
                  onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of what this quiz covers..."
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Questions</h2>
                <button
                  onClick={addQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Question
                </button>
              </div>

              {quiz.questions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No questions added yet. Click "Add Question" to start.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={qIndex} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium">Question {qIndex + 1}</h3>
                        <button
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="multiple_choice">Multiple Choice</option>
                            <option value="true_false">True/False</option>
                            <option value="open_ended">Open-Ended (AI Evaluated)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Text *
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your question..."
                          />
                        </div>

                        {question.type === 'multiple_choice' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Options
                              </label>
                              {question.options?.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center mb-2">
                                  <span className="mr-2 text-sm font-medium w-6">{String.fromCharCode(65 + oIndex)}.</span>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  />
                                </div>
                              ))}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correct Answer
                              </label>
                              <select
                                value={question.correctAnswer}
                                onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select correct answer</option>
                                {question.options?.map((_, oIndex) => (
                                  <option key={oIndex} value={String.fromCharCode(65 + oIndex)}>
                                    Option {String.fromCharCode(65 + oIndex)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </>
                        )}

                        {question.type === 'true_false' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Correct Answer
                            </label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select answer</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        )}

                        {question.type === 'open_ended' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expected Keywords (comma-separated, for AI evaluation)
                            </label>
                            <input
                              type="text"
                              value={question.expectedKeywords?.join(', ') || ''}
                              onChange={(e) => updateQuestion(qIndex, 'expectedKeywords', e.target.value.split(',').map(k => k.trim()))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="rapport, trust, listen, understand"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explanation (shown after answering)
                          </label>
                          <textarea
                            value={question.explanation}
                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Explain why this is the correct answer..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points
                          </label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                            min="1"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                onClick={() => router.push('/admin/videos')}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveQuiz}
                disabled={isSaving || !quiz.title || quiz.questions.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}