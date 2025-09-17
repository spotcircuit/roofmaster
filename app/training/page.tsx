'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuizTakeModal from '@/components/QuizTakeModal';
import { useData } from '@/lib/context/DataContext';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  duration: number;
  hasQuiz: boolean;
  completed?: boolean;
}

export default function TrainingPage() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<{ id: string; title: string } | null>(null);
  const [category, setCategory] = useState('all');
  const router = useRouter();

  // Use cached data from context
  const { videos: allVideos, isLoadingVideos, refreshVideos, getVideoQuiz } = useData();

  // Filter videos by category
  const videos = category === 'all'
    ? allVideos
    : allVideos.filter(v => v.category === category);

  const watchVideo = async (video: Video) => {
    setSelectedVideo(video);

    // Track video watch (optional - not storing for now)
    try {
      await fetch('/api/training/track-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId: video.id }),
      });
    } catch (error) {
      // Silent fail - tracking not essential
    }
  };

  const startQuiz = async () => {
    if (!selectedVideo || !selectedVideo.hasQuiz) return;

    // Use cached quiz from context
    try {
      const quiz = await getVideoQuiz(selectedVideo.id);
      if (quiz) {
        setSelectedQuiz({
          id: quiz.id,
          title: quiz.title || 'Comprehension Quiz'
        });
        setShowQuizModal(true);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
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
                <h2 className="font-semibold text-white">Available Videos {videos.length > 0 && `(${videos.length})`}</h2>
              </div>
              <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
                {isLoadingVideos ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">Loading videos...</div>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400">No videos available in this category</div>
                  </div>
                ) : (
                  videos.map((video) => (
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
                          {video.hasQuiz && !video.completed && (
                            <span className="text-xs bg-gray-600/20 text-gray-300 px-2 py-1 rounded-full border border-gray-600/30">
                              Quiz available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
                )}
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="aspect-video bg-black rounded-t-lg">
                  {(() => {
                    const url = selectedVideo.videoUrl;

                    // YouTube detection
                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                      const embedUrl = url.includes('watch?v=')
                        ? url.replace('watch?v=', 'embed/')
                        : url.includes('youtu.be/')
                        ? url.replace('youtu.be/', 'youtube.com/embed/')
                        : url;
                      return (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      );
                    }

                    // HeyGen detection
                    if (url.includes('heygen.com')) {
                      const videoId = url.split('/videos/')[1]?.split('?')[0];
                      return (
                        <iframe
                          src={`https://app.heygen.com/embeds/${videoId}`}
                          className="w-full h-full"
                          allowFullScreen
                          allow="clipboard-write"
                        />
                      );
                    }

                    // Vimeo detection
                    if (url.includes('vimeo.com')) {
                      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
                      return (
                        <iframe
                          src={`https://player.vimeo.com/video/${vimeoId}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      );
                    }

                    // Loom detection
                    if (url.includes('loom.com')) {
                      const loomId = url.split('/share/')[1]?.split('?')[0];
                      return (
                        <iframe
                          src={`https://www.loom.com/embed/${loomId}`}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      );
                    }

                    // Default to HTML5 video for direct video files
                    return (
                      <video
                        src={url}
                        controls
                        className="w-full h-full"
                      />
                    );
                  })()}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                  <p className="text-gray-400 mb-4">{selectedVideo.description}</p>

                  {selectedVideo.hasQuiz && (
                    <button
                      onClick={startQuiz}
                      className="bg-blue-600/20 text-blue-400 px-6 py-2 rounded-lg hover:bg-blue-600/30 border border-blue-600/30 transition-all duration-200"
                    >
                      Take Quiz
                    </button>
                  )}
                </div>
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

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizTakeModal
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedQuiz(null);
          }}
          quizId={selectedQuiz.id} // Using quiz ID directly
          quizTitle={selectedQuiz.title}
        />
      )}
    </div>
  );
}