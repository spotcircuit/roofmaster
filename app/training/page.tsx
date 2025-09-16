'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: number;
  hasQuiz: boolean;
  completed: boolean;
  quizScore?: number;
}

export default function TrainingPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState('all');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchVideos();
  }, [category]);

  const checkAuth = () => {
    // Remove old auth check - now handled by Stack Auth
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/training/videos?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const watchVideo = async (video: Video) => {
    setSelectedVideo(video);
    setShowQuiz(false);
    setQuizResult(null);

    // Track video watch
    try {
      await fetch('/api/training/track-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id }),
      });
    } catch (error) {
      console.error('Error tracking video:', error);
    }
  };

  const loadQuiz = async () => {
    if (!selectedVideo) return;

    try {
      const response = await fetch(`/api/training/videos/${selectedVideo.id}/quiz`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
        setShowQuiz(true);
        setAnswers({});
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    }
  };

  const submitQuiz = async () => {
    if (!quiz || !selectedVideo) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/training/videos/${selectedVideo.id}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const result = await response.json();
        setQuizResult(result);

        // Update video completion status
        const updatedVideos = videos.map(v =>
          v.id === selectedVideo.id
            ? { ...v, completed: true, quizScore: result.score }
            : v
        );
        setVideos(updatedVideos);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Videos' },
    { value: 'basics', label: 'Basics' },
    { value: 'door-knocking', label: 'Door Knocking' },
    { value: 'rapport', label: 'Building Rapport' },
    { value: 'objections', label: 'Handling Objections' },
    { value: 'closing', label: 'Closing Techniques' },
    { value: 'advanced', label: 'Advanced Skills' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="text-center sm:text-left w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Training Videos
              </h1>
              <p className="text-sm text-gray-400 mt-1">Master your sales skills with comprehensive video training</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all duration-200 border border-gray-600/30 text-center"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video List */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-slate-800">{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-4 border-b border-white/10">
                <h2 className="font-semibold text-white">Available Videos</h2>
              </div>
              <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => watchVideo(video)}
                    className={`w-full text-left p-4 hover:bg-white/5 transition-colors ${
                      selectedVideo?.id === video.id ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{video.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{video.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {video.completed && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
                              ✓ Completed
                            </span>
                          )}
                          {video.quizScore !== undefined && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30">
                              Quiz: {video.quizScore}%
                            </span>
                          )}
                          {video.hasQuiz && !video.completed && (
                            <span className="text-xs bg-gray-600/20 text-gray-300 px-2 py-1 rounded-full border border-gray-600/30">
                              Quiz available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player & Quiz */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10">
                {!showQuiz ? (
                  <>
                    <div className="aspect-video bg-black rounded-t-lg">
                      {selectedVideo.videoUrl.includes('youtube') ? (
                        <iframe
                          src={selectedVideo.videoUrl.replace('watch?v=', 'embed/')}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={selectedVideo.videoUrl}
                          controls
                          className="w-full h-full"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                      <p className="text-gray-400 mb-4">{selectedVideo.description}</p>

                      {selectedVideo.hasQuiz && (
                        <button
                          onClick={loadQuiz}
                          className="bg-blue-600/20 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-600/30 border border-blue-600/30 transition-all duration-200"
                        >
                          Take Comprehension Quiz
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-6">
                    {!quizResult ? (
                      <>
                        <h2 className="text-2xl font-bold text-white mb-4">{quiz?.title}</h2>
                        <p className="text-gray-400 mb-6">{quiz?.description}</p>

                        <div className="space-y-6">
                          {quiz?.questions?.map((question: any, index: number) => (
                            <div key={question.id || index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                              <p className="font-medium text-white mb-3">
                                {index + 1}. {question.question}
                              </p>

                              {question.type === 'multiple_choice' && (
                                <div className="space-y-2">
                                  {question.options?.map((option: string, oIndex: number) => (
                                    <label key={oIndex} className="flex items-center p-2 hover:bg-white/5 rounded cursor-pointer text-gray-300">
                                      <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={String.fromCharCode(65 + oIndex)}
                                        checked={answers[question.id || index] === String.fromCharCode(65 + oIndex)}
                                        onChange={(e) => setAnswers({
                                          ...answers,
                                          [question.id || index]: e.target.value
                                        })}
                                        className="mr-3"
                                      />
                                      <span className="text-white">{String.fromCharCode(65 + oIndex)}. {option}</span>
                                    </label>
                                  ))}
                                </div>
                              )}

                              {question.type === 'true_false' && (
                                <div className="space-y-2">
                                  <label className="flex items-center p-2 hover:bg-white/5 rounded cursor-pointer text-gray-300">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      value="true"
                                      checked={answers[question.id || index] === 'true'}
                                      onChange={(e) => setAnswers({
                                        ...answers,
                                        [question.id || index]: e.target.value
                                      })}
                                      className="mr-3"
                                    />
                                    <span className="text-white">True</span>
                                  </label>
                                  <label className="flex items-center p-2 hover:bg-white/5 rounded cursor-pointer text-gray-300">
                                    <input
                                      type="radio"
                                      name={`question-${index}`}
                                      value="false"
                                      checked={answers[question.id || index] === 'false'}
                                      onChange={(e) => setAnswers({
                                        ...answers,
                                        [question.id || index]: e.target.value
                                      })}
                                      className="mr-3"
                                    />
                                    <span className="text-white">False</span>
                                  </label>
                                </div>
                              )}

                              {question.type === 'open_ended' && (
                                <textarea
                                  value={answers[question.id || index] || ''}
                                  onChange={(e) => setAnswers({
                                    ...answers,
                                    [question.id || index]: e.target.value
                                  })}
                                  rows={4}
                                  className="w-full px-3 py-2 bg-slate-700/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Type your answer here..."
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between mt-8">
                          <button
                            onClick={() => setShowQuiz(false)}
                            className="px-6 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all duration-200 border border-gray-600/30"
                          >
                            Back to Video
                          </button>
                          <button
                            onClick={submitQuiz}
                            disabled={isSubmitting || Object.keys(answers).length < quiz?.questions?.length}
                            className="px-6 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 border border-blue-600/30 disabled:opacity-50"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                          quizResult.passed ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          <span className="text-3xl">{quizResult.passed ? '✓' : '✗'}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {quizResult.passed ? 'Congratulations!' : 'Keep Learning!'}
                        </h2>
                        <p className="text-lg text-gray-400 mb-4">
                          Your Score: <span className="font-bold">{quizResult.score}%</span>
                        </p>
                        <p className="text-gray-400 mb-6">
                          {quizResult.passed
                            ? `You passed with a score of ${quizResult.score}%. Great job understanding the material!`
                            : `You scored ${quizResult.score}%. Review the material and try again to improve your comprehension.`}
                        </p>

                        {quizResult.aiAnalysis && (
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left mb-6">
                            <h3 className="font-semibold text-white mb-2">AI Analysis</h3>
                            <p className="text-sm text-gray-400">{quizResult.aiAnalysis}</p>
                          </div>
                        )}

                        <div className="flex justify-center gap-4">
                          <button
                            onClick={() => {
                              setShowQuiz(false);
                              setQuizResult(null);
                            }}
                            className="px-6 py-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-all duration-200 border border-gray-600/30"
                          >
                            Back to Video
                          </button>
                          {!quizResult.passed && (
                            <button
                              onClick={() => {
                                setQuizResult(null);
                                setAnswers({});
                              }}
                              className="px-6 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 border border-blue-600/30"
                            >
                              Retake Quiz
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="text-6xl">📹</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Select a Video to Start</h2>
                <p className="text-gray-400">Choose a training video from the list to begin learning</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}