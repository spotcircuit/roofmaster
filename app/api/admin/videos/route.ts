import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Extract YouTube video ID and fetch metadata
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchYouTubeMetadata(videoId: string) {
  try {
    // In production, use YouTube Data API v3 with API key
    // For now, return extracted basic info
    return {
      title: null, // Will use user-provided title
      duration: null, // Could fetch from API
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return { title: null, duration: null, thumbnail: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    const videos = await sql`
      SELECT
        id,
        title,
        description,
        video_url as "videoUrl",
        category,
        duration,
        order_index as "orderIndex",
        is_active as "isActive",
        uploaded_by as "uploadedBy",
        created_at as "createdAt"
      FROM training_videos
      ORDER BY order_index ASC, created_at DESC
    `;

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, videoUrl, category } = body;

    // Extract metadata from YouTube URL if applicable
    const youtubeId = extractYouTubeId(videoUrl);
    let metadata: { duration: number | null; title?: string | null; thumbnail?: string | null } = { duration: 0 };

    if (youtubeId) {
      const youtubeData = await fetchYouTubeMetadata(youtubeId);
      metadata = {
        ...youtubeData,
        duration: youtubeData.duration || 0
      };
    }

    // Get current user from request (in production, from JWT token)
    const userCookie = request.cookies.get('currentUser');
    let uploadedBy = null;

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie.value);
        uploadedBy = userData.id;
      } catch (e) {
        // Fallback to localStorage data if needed
      }
    }

    const newVideo = await sql`
      INSERT INTO training_videos (
        title,
        description,
        video_url,
        category,
        duration,
        uploaded_by
      ) VALUES (
        ${title},
        ${description || ''},
        ${videoUrl},
        ${category},
        ${metadata.duration || 0},
        ${uploadedBy}
      )
      RETURNING
        id,
        title,
        description,
        video_url as "videoUrl",
        category,
        duration,
        order_index as "orderIndex",
        is_active as "isActive",
        uploaded_by as "uploadedBy",
        created_at as "createdAt"
    `;

    return NextResponse.json({
      video: newVideo[0],
      success: true,
      message: 'Video uploaded successfully!'
    });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}