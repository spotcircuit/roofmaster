'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStackApp, useUser } from '@stackframe/stack';
import VideoUploadModal from '@/components/VideoUploadModal';
import QuizModal from '@/components/QuizModal';
import VideoPreviewModal from '@/components/VideoPreviewModal';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const router = useRouter();
  const app = useStackApp();
  const user = useUser();

  useEffect(() => {
    // Admin layout already handles auth, but double-check
    if (user === null) {
      app.redirectToSignIn();
    }
  }, [user, app]);

  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleVideoSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchVideos();
        setNotification({
          type: 'success',
          message: data.message || 'Video uploaded successfully!'
        });
        setTimeout(() => setNotification(null), 5000);
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to upload video'
        });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Network error. Please try again.'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const toggleVideoStatus = async (videoId: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/videos/${videoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      await fetchVideos();
    } catch (error) {
      console.error('Error updating video status:', error);
    }
  };

  const openQuizModal = (video: Video) => {
    setSelectedVideo(video);
    setShowQuizModal(true);
  };

  const openPreviewModal = (video: Video) => {
    setSelectedVideo(video);
    setShowPreviewModal(true);
  };

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Video Management
              </h1>
              <p className="text-sm text-gray-400 mt-1">Upload and manage training videos</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Centered and Responsive */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            + Add New Video
          </button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="text-6xl">📹</span>
                </div>
                <p className="text-xl text-gray-300 mb-2">No videos uploaded yet</p>
                <p className="text-sm text-gray-500">Click "Add New Video" to get started</p>
              </div>
            </div>
          ) : (
            videos.map((video) => (
              <div
                key={video.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5 hover:border-white/20 transition-all duration-200"
              >
                {/* Video Card Header */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-white text-lg line-clamp-1">{video.title}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {video.description || 'No description provided'}
                </p>

                {/* Category & Status */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-slate-700/50 text-gray-300 rounded">
                    {video.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.isActive
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {video.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openPreviewModal(video)}
                      className="flex-1 px-3 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm font-medium"
                    >
                      👁️ Preview
                    </button>
                    <button
                      onClick={() => openQuizModal(video)}
                      className="flex-1 px-3 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium"
                    >
                      📝 Quiz
                    </button>
                  </div>
                  <button
                    onClick={() => toggleVideoStatus(video.id, video.isActive)}
                    className="w-full px-3 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium"
                  >
                    {video.isActive ? '🚫 Deactivate' : '✅ Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Modals */}
      <VideoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSubmit={handleVideoSubmit}
      />

      {selectedVideo && (
        <QuizModal
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setSelectedVideo(null);
          }}
          videoId={selectedVideo.id}
          videoTitle={selectedVideo.title}
        />
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <VideoPreviewModal
          isOpen={showPreviewModal}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
        />
      )}
    </div>
  );
}