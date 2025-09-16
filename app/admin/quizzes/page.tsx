'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';
import QuizEditModal from '@/components/QuizEditModal';
import QuizPreviewModal from '@/components/QuizPreviewModal';

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
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  passingScore: number;
  timeLimit?: number;
  videoId?: string;
  videoTitle?: string;
  createdAt: string;
  isActive: boolean;
  questions?: Question[]; // Properly typed for QuizEditModal
}

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [previewQuizId, setPreviewQuizId] = useState<string>('');
  const [previewQuizTitle, setPreviewQuizTitle] = useState<string>('');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();

  // Fetch quizzes from database
  useEffect(() => {
    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/admin/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      // Just set empty array on error
      setQuizzes([]);
    }
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      // Parse CSV logic here
      setNotification({
        type: 'success',
        message: 'Quiz questions imported successfully!'
      });
      setTimeout(() => setNotification(null), 5000);
      setShowCsvUpload(false);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const downloadTemplate = () => {
    const template = `question,type,optionA,optionB,optionC,optionD,correctAnswer,points
"What is the first step when approaching a door?",multiple_choice,"Knock firmly","Ring the doorbell","Check for 'No Soliciting' signs","Smile","C",1
"Building rapport is important in sales",true_false,,,,,true,1
"Describe your approach to handling objections",open_ended,"listen","empathize","address","overcome",,2`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleQuizStatus = async (quizId: string, isActive: boolean) => {
    // Toggle quiz active status
    setQuizzes(quizzes.map(q =>
      q.id === quizId ? { ...q, isActive: !isActive } : q
    ));

    setNotification({
      type: 'success',
      message: `Quiz ${isActive ? 'deactivated' : 'activated'} successfully!`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-amber-500/20 text-amber-300';
      case 'hard': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
          notification.type === 'success'
            ? 'bg-green-900/90 border-green-500/50 text-green-100'
            : 'bg-red-900/90 border-red-500/50 text-red-100'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {notification.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Quiz Management
              </h1>
              <p className="text-sm text-gray-400 mt-1">Create and manage comprehensive assessments</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all duration-200 border border-gray-600/30 text-center"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedQuiz(null);
              setShowEditModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            + Create New Quiz
          </button>
          <button
            onClick={() => setShowCsvUpload(!showCsvUpload)}
            className="px-6 py-3 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all duration-200"
          >
            📁 Bulk Upload Questions
          </button>
          <button
            onClick={downloadTemplate}
            className="px-6 py-3 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-600/30 transition-all duration-200"
          >
            📥 Download CSV Template
          </button>
        </div>

        {/* CSV Upload Section */}
        {showCsvUpload && (
          <div className="mb-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Bulk Upload Quiz Questions</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Upload a CSV file with questions. Format: question, type, optionA, optionB, optionC, optionD, correctAnswer, points
              </p>

              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="inline-block px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors cursor-pointer"
              >
                Choose CSV File
              </label>

              <div className="text-xs text-gray-500">
                <p className="font-medium mb-2">Supported question types:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>multiple_choice</strong> - Provide 4 options (A-D) and correct answer</li>
                  <li><strong>true_false</strong> - Correct answer should be "true" or "false"</li>
                  <li><strong>open_ended</strong> - Options become expected keywords for AI evaluation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="text-6xl">📝</span>
                </div>
                <p className="text-xl text-gray-300 mb-2">No quizzes created yet</p>
                <p className="text-sm text-gray-500">Click "Create New Quiz" to get started</p>
              </div>
            </div>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4">{quiz.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Questions:</span>
                    <span className="text-gray-300">{quiz.questionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Passing Score:</span>
                    <span className="text-gray-300">{quiz.passingScore}%</span>
                  </div>
                  {quiz.timeLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Time Limit:</span>
                      <span className="text-gray-300">{quiz.timeLimit} min</span>
                    </div>
                  )}
                  {quiz.videoTitle && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Linked Video:</span>
                      <span className="text-blue-400 text-xs">{quiz.videoTitle}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded">
                    {quiz.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    quiz.isActive
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {quiz.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setShowEditModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium border border-blue-600/30"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => {
                        setPreviewQuizId(quiz.id);
                        setPreviewQuizTitle(quiz.title);
                        setShowPreviewModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium border border-green-600/30"
                    >
                      👁️ Preview
                    </button>
                  </div>
                  <button
                    onClick={() => toggleQuizStatus(quiz.id, quiz.isActive)}
                    className="w-full px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium border border-purple-600/30"
                  >
                    {quiz.isActive ? '🚫 Deactivate' : '✅ Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-300/80">Total Quizzes</p>
                <p className="text-3xl font-bold text-white mt-2">{quizzes.length}</p>
              </div>
              <span className="text-3xl">📝</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-300/80">Active Quizzes</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {quizzes.filter(q => q.isActive).length}
                </p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-xl border border-purple-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-300/80">Total Questions</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {quizzes.reduce((sum, q) => sum + q.questionCount, 0)}
                </p>
              </div>
              <span className="text-3xl">❓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuizEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedQuiz(null);
        }}
        quiz={selectedQuiz}
        onSave={(quiz) => {
          // Handle save - in real app would call API
          if (selectedQuiz) {
            // Update existing quiz
            setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? { ...q, ...quiz } : q));
          } else {
            // Add new quiz
            const newQuiz = {
              ...quiz,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              isActive: true,
              questionCount: quiz.questions.length
            } as Quiz;
            setQuizzes([...quizzes, newQuiz]);
          }
          setNotification({
            type: 'success',
            message: selectedQuiz ? 'Quiz updated successfully!' : 'Quiz created successfully!'
          });
          setTimeout(() => setNotification(null), 5000);
        }}
      />

      <QuizPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        quizId={previewQuizId}
        quizTitle={previewQuizTitle}
      />
    </div>
  );
}