-- Migration to make video_id nullable in video_quizzes table
-- This allows creating standalone quizzes without linking to a video

ALTER TABLE video_quizzes
ALTER COLUMN video_id DROP NOT NULL;

-- Update the foreign key constraint to allow NULL values
-- (The ON DELETE CASCADE should still work for non-null values)