import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const video = await sql`
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
      WHERE id = ${videoId}
    `;

    if (video.length === 0) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(video[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;
    const body = await request.json();
    const { isActive, title, description, category, orderIndex } = body;

    // Build update query based on provided fields
    let updateQuery = 'UPDATE training_videos SET ';
    const updates: string[] = [];

    if (isActive !== undefined) {
      updates.push(`is_active = ${isActive}`);
    }
    if (title !== undefined) {
      updates.push(`title = '${title.replace(/'/g, "''")}'`);
    }
    if (description !== undefined) {
      updates.push(`description = '${description.replace(/'/g, "''")}'`);
    }
    if (category !== undefined) {
      updates.push(`category = '${category.replace(/'/g, "''")}'`);
    }
    if (orderIndex !== undefined) {
      updates.push(`order_index = ${orderIndex}`);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    updateQuery += updates.join(', ');
    updateQuery += ` WHERE id = '${videoId}'`;

    await sql.unsafe(updateQuery);

    return NextResponse.json({
      success: true,
      message: 'Video updated successfully'
    });
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}