'use client';

interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video;
}

export default function VideoPreviewModal({ isOpen, onClose, video }: VideoPreviewModalProps) {
  if (!isOpen) return null;

  // Extract YouTube video ID for embed
  const getYouTubeEmbedUrl = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
      }
    }

    // If not YouTube, try to use direct URL
    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(video.videoUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl border border-white/10 w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white">{video.title}</h2>
              <p className="text-sm text-gray-400 mt-1">Category: {video.category}</p>
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

          {/* Video Content */}
          <div className="p-6">
            {/* Video Player */}
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              {embedUrl.includes('youtube.com/embed/') ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={embedUrl}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {video.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    video.isActive
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {video.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white ml-2">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-slate-700/50 rounded-lg hover:bg-slate-700/70 transition-colors"
            >
              Close
            </button>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all"
            >
              Open Original
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}