'use client';

import { useState, useEffect } from 'react';

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

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
}

export default function QuizModal({ isOpen, onClose, videoId, videoTitle }: QuizModalProps) {
  const [quiz, setQuiz] = useState<Quiz>({
    title: '',
    description: '',
    passingScore: 70,
    attempts: 3,
    timeLimit: 0,
    questions: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);

  useEffect(() => {
    if (isOpen && videoId) {
      fetchQuiz();
    }
  }, [isOpen, videoId]);

  const fetchQuiz = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/videos/${videoId}/quiz`);
      if (response.ok) {
        const data = await response.json();
        if (data.quiz) {
          setQuiz(data.quiz);
        }
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
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

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        alert('CSV file appears to be empty');
        return;
      }

      // Parse CSV - expecting format:
      // question,type,optionA,optionB,optionC,optionD,correctAnswer,points
      const newQuestions: Question[] = [];

      // Simple CSV parser that handles quoted values
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        if (values.length < 3) continue; // Skip invalid rows

        const questionText = values[0].replace(/^"|"$/g, ''); // Remove surrounding quotes
        const type = values[1]?.toLowerCase().replace(/^"|"$/g, '') as 'multiple_choice' | 'true_false' | 'open_ended';

        let question: Question = {
          question: questionText,
          type: type || 'multiple_choice',
          points: parseInt(values[7]) || 1,
        };

        if (type === 'multiple_choice') {
          question.options = [
            values[2]?.replace(/^"|"$/g, '') || '',
            values[3]?.replace(/^"|"$/g, '') || '',
            values[4]?.replace(/^"|"$/g, '') || '',
            values[5]?.replace(/^"|"$/g, '') || ''
          ].filter(o => o);
          question.correctAnswer = values[6]?.replace(/^"|"$/g, '') || 'A';
        } else if (type === 'true_false') {
          question.correctAnswer = values[6]?.toLowerCase().replace(/^"|"$/g, '') || 'true';
        } else if (type === 'open_ended') {
          // For open-ended, values[2-5] could be expected keywords
          question.expectedKeywords = [
            values[2]?.replace(/^"|"$/g, ''),
            values[3]?.replace(/^"|"$/g, ''),
            values[4]?.replace(/^"|"$/g, ''),
            values[5]?.replace(/^"|"$/g, '')
          ].filter(k => k);
        }

        newQuestions.push(question);
      }

      // Add imported questions to existing questions
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, ...newQuestions]
      });

      setShowCsvUpload(false);
      alert(`Successfully imported ${newQuestions.length} questions`);
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const downloadCsvTemplate = () => {
    const template = `question,type,optionA,optionB,optionC,optionD,correctAnswer,points
"What is the first step when approaching a door?",multiple_choice,"Knock firmly","Ring the doorbell","Check for 'No Soliciting' signs","Smile","C",1
"Building rapport is important in sales",true_false,,,,,true,1
"Describe your approach to handling objections",open_ended,"listen","empathize","address","overcome",,2
"Which closing technique is most effective?",multiple_choice,"Assumptive close","Hard close","Soft close","Trial close","A",2`;

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
        onClose();
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Error saving quiz');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white">Quiz Management</h2>
              <p className="text-sm text-gray-400 mt-1">Video: {videoTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-gray-400">Loading quiz...</div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Quiz Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      value={quiz.title}
                      onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      placeholder="e.g., Door Knocking Basics Quiz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      value={quiz.passingScore}
                      onChange={(e) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) })}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={quiz.description}
                    onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    placeholder="Brief description of what this quiz covers..."
                  />
                </div>

                {/* Questions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Questions</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCsvUpload(!showCsvUpload)}
                        className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                      >
                        📁 Bulk Upload
                      </button>
                      <button
                        onClick={addQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        + Add Question
                      </button>
                    </div>
                  </div>

                  {/* CSV Upload Section */}
                  {showCsvUpload && (
                    <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-white/10">
                      <h4 className="text-sm font-medium text-white mb-3">Bulk Upload Questions via CSV</h4>
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                          Upload a CSV file with questions. Format: question, type, optionA, optionB, optionC, optionD, correctAnswer, points
                        </p>

                        <div className="flex gap-3">
                          <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvUpload}
                            className="hidden"
                            id="csv-upload"
                          />
                          <label
                            htmlFor="csv-upload"
                            className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors cursor-pointer inline-block"
                          >
                            Choose CSV File
                          </label>

                          <button
                            onClick={downloadCsvTemplate}
                            className="px-4 py-2 bg-gray-600/20 text-gray-400 border border-gray-600/30 rounded-lg hover:bg-gray-600/30 transition-colors"
                          >
                            📥 Download Template
                          </button>
                        </div>

                        <div className="text-xs text-gray-500">
                          <p className="font-medium mb-1">Supported question types:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            <li><strong>multiple_choice</strong> - Provide 4 options (A-D) and correct answer</li>
                            <li><strong>true_false</strong> - Correct answer should be "true" or "false"</li>
                            <li><strong>open_ended</strong> - Options become expected keywords for AI evaluation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {quiz.questions.length === 0 ? (
                    <div className="text-center py-8 bg-slate-900/30 rounded-lg">
                      <p className="text-gray-400">No questions added yet. Click "Add Question" to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quiz.questions.map((question, qIndex) => (
                        <div key={qIndex} className="bg-slate-900/30 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-white">Question {qIndex + 1}</h4>
                            <button
                              onClick={() => removeQuestion(qIndex)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Question Type
                                </label>
                                <select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                  className="w-full px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
                                >
                                  <option value="multiple_choice">Multiple Choice</option>
                                  <option value="true_false">True/False</option>
                                  <option value="open_ended">Open-Ended (AI)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Points
                                </label>
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                                  min="1"
                                  className="w-full px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-1">
                                Question Text *
                              </label>
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
                                placeholder="Enter your question..."
                              />
                            </div>

                            {question.type === 'multiple_choice' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Options
                                  </label>
                                  <div className="space-y-1">
                                    {question.options?.map((option, oIndex) => (
                                      <div key={oIndex} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-4">{String.fromCharCode(65 + oIndex)}.</span>
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                          className="flex-1 px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
                                          placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-400 mb-1">
                                    Correct Answer
                                  </label>
                                  <select
                                    value={question.correctAnswer}
                                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    className="w-full px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
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
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Correct Answer
                                </label>
                                <select
                                  value={question.correctAnswer}
                                  onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                  className="w-full px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
                                >
                                  <option value="">Select answer</option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                              </div>
                            )}

                            {question.type === 'open_ended' && (
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Expected Keywords (for AI evaluation)
                                </label>
                                <input
                                  type="text"
                                  value={question.expectedKeywords?.join(', ') || ''}
                                  onChange={(e) => updateQuestion(qIndex, 'expectedKeywords', e.target.value.split(',').map(k => k.trim()))}
                                  className="w-full px-2 py-1 bg-slate-800/50 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-blue-500/50"
                                  placeholder="rapport, trust, listen, understand"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveQuiz}
              disabled={isSaving || !quiz.title || quiz.questions.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}