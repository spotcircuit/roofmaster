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
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passingScore: number;
  timeLimit?: number;
  videoId?: string;
  questions: Question[];
}

// Incoming quiz can have optional questions
interface QuizInput {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passingScore: number;
  timeLimit?: number;
  videoId?: string;
  questions?: Question[];
}

interface QuizEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz?: QuizInput | null;
  onSave?: (quiz: Quiz) => void;
}

export default function QuizEditModal({ isOpen, onClose, quiz, onSave }: QuizEditModalProps) {
  const [formData, setFormData] = useState<Quiz>({
    title: '',
    description: '',
    category: 'basics',
    difficulty: 'medium',
    passingScore: 70,
    timeLimit: 30,
    videoId: '',
    questions: [],
  });

  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [videos, setVideos] = useState<{ id: string; title: string }[]>([]);

  // Fetch videos from database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/admin/videos');
        if (response.ok) {
          const data = await response.json();
          const videoList = [
            { id: '', title: 'None (Standalone Quiz)' },
            ...(data.videos || []).map((v: any) => ({
              id: v.id,
              title: v.title
            }))
          ];
          setVideos(videoList);
        } else {
          // If no videos, just show standalone option
          setVideos([{ id: '', title: 'None (Standalone Quiz)' }]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([{ id: '', title: 'None (Standalone Quiz)' }]);
      }
    };

    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen]);

  useEffect(() => {
    if (quiz) {
      setFormData({
        ...quiz,
        questions: quiz.questions || [] // Ensure questions is always an array
      });
    } else {
      // Reset for new quiz
      setFormData({
        title: '',
        description: '',
        category: 'basics',
        difficulty: 'medium',
        passingScore: 70,
        timeLimit: 30,
        videoId: '',
        questions: [],
      });
    }
  }, [quiz, isOpen]);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
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
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    const options = [...(newQuestions[questionIndex].options || [])];
    options[optionIndex] = value;
    newQuestions[questionIndex].options = options;
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
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

      const newQuestions: Question[] = [];
      let skippedCount = 0;

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

        if (values.length < 3) continue;

        const questionText = values[0]?.replace(/^"|"$/g, '').trim();
        if (!questionText) {
          skippedCount++;
          continue; // Skip rows with empty questions
        }

        const typeValue = values[1]?.toLowerCase().replace(/^"|"$/g, '').trim();
        const type = (['multiple_choice', 'true_false', 'open_ended'].includes(typeValue)
          ? typeValue
          : 'multiple_choice') as 'multiple_choice' | 'true_false' | 'open_ended';

        const points = Math.max(1, parseInt(values[7]) || 1); // Ensure points is at least 1

        let question: Question = {
          question: questionText,
          type: type,
          points: points,
        };

        if (type === 'multiple_choice') {
          const options = [
            values[2]?.replace(/^"|"$/g, '').trim() || '',
            values[3]?.replace(/^"|"$/g, '').trim() || '',
            values[4]?.replace(/^"|"$/g, '').trim() || '',
            values[5]?.replace(/^"|"$/g, '').trim() || ''
          ].filter(o => o);

          // Ensure at least 2 options for multiple choice
          if (options.length < 2) {
            skippedCount++;
            continue; // Skip this question if insufficient options
          }

          question.options = options;
          const correctAnswer = values[6]?.replace(/^"|"$/g, '').trim().toUpperCase();
          // Validate that correct answer corresponds to available options
          const answerIndex = correctAnswer.charCodeAt(0) - 65; // A=0, B=1, etc.
          question.correctAnswer = (answerIndex >= 0 && answerIndex < options.length)
            ? correctAnswer
            : 'A'; // Default to A if invalid

        } else if (type === 'true_false') {
          const answer = values[6]?.toLowerCase().replace(/^"|"$/g, '').trim();
          question.correctAnswer = (answer === 'true' || answer === 'false') ? answer : 'true';

        } else if (type === 'open_ended') {
          const keywords = [
            values[2]?.replace(/^"|"$/g, '').trim(),
            values[3]?.replace(/^"|"$/g, '').trim(),
            values[4]?.replace(/^"|"$/g, '').trim(),
            values[5]?.replace(/^"|"$/g, '').trim()
          ].filter(k => k);

          // Ensure at least one keyword for open-ended questions
          if (keywords.length === 0) {
            skippedCount++;
            continue; // Skip this question if no keywords
          }

          question.expectedKeywords = keywords;
        }

        newQuestions.push(question);
      }

      setFormData({
        ...formData,
        questions: [...formData.questions, ...newQuestions]
      });

      setShowCsvUpload(false);
      const message = `Successfully imported ${newQuestions.length} questions` +
        (skippedCount > 0 ? `. ${skippedCount} questions were skipped due to validation issues.` : '');
      alert(message);
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const downloadCsvTemplate = () => {
    const template = `question,type,optionA,optionB,optionC,optionD,correctAnswer,points
"What is the first step when approaching a homeowner's door?",multiple_choice,"Knock loudly","Ring the doorbell","Check for 'No Soliciting' signs first","Walk around the property","C",1
"You should always maintain eye contact during conversations",true_false,,,,,true,1
"Describe the key elements of building trust with a homeowner",open_ended,"listen","empathy","honesty","transparency",,2
"How many seconds do you have to make a first impression?",multiple_choice,"3 seconds","7 seconds","15 seconds","30 seconds","B",1
"It's acceptable to argue with a homeowner who disagrees",true_false,,,,,false,1
"What should you do when facing the 'I'm not interested' objection?",open_ended,"acknowledge","understand","redirect","value",,3
"Which greeting approach is most effective for door-to-door sales?",multiple_choice,"Hi, I'm selling roofing services","Good morning, I noticed your neighbor had roof work done","Hello, do you need a new roof?","Hey there, got a minute?","B",2
"You should immediately start talking about your services when the door opens",true_false,,,,,false,1
"Explain how to handle a homeowner who says 'We can't afford it right now'",open_ended,"budget","payment","options","financing",,2`;

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

  const handleSave = () => {
    if (!formData.title || formData.questions.length === 0) {
      alert('Please add a title and at least one question');
      return;
    }

    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      if (onSave) {
        onSave(formData);
      }
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">
              {quiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h2>
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
            <div className="space-y-6">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    placeholder="e.g., Sales Fundamentals Quiz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="basics">Basics</option>
                    <option value="door-knocking">Door Knocking</option>
                    <option value="rapport">Building Rapport</option>
                    <option value="objections">Handling Objections</option>
                    <option value="closing">Closing Techniques</option>
                    <option value="advanced">Advanced Skills</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit || 0}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Link to Video (Optional)
                  </label>
                  <select
                    value={formData.videoId || ''}
                    onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
                  >
                    {videos.map((video) => (
                      <option key={video.id} value={video.id}>
                        {video.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                  placeholder="Brief description of what this quiz covers..."
                />
              </div>

              {/* Questions */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Questions ({formData.questions?.length || 0})</h3>
                  <button
                    onClick={() => setShowCsvUpload(!showCsvUpload)}
                    className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors"
                  >
                    📁 Bulk Upload
                  </button>
                </div>

                {/* CSV Upload Section */}
                {showCsvUpload && (
                  <div className="mb-4 p-4 bg-slate-900/50 rounded-lg border border-white/10">
                    <h4 className="text-sm font-medium text-white mb-3">Bulk Upload Questions via CSV</h4>
                    <div className="space-y-3">
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
                    </div>
                  </div>
                )}

                {!formData.questions || formData.questions.length === 0 ? (
                  <div className="text-center py-8 bg-slate-900/30 rounded-lg">
                    <p className="text-gray-400">No questions added yet. Click "Add Question" or upload a CSV file.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.questions.map((question, qIndex) => (
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
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-6 border-t border-white/10">
            <button
              onClick={addQuestion}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Question
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.title || formData.questions.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? 'Saving...' : quiz ? 'Update Quiz' : 'Create Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}