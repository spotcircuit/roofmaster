-- Seed data for training_videos table
-- Run this in Neon SQL editor to add sample videos

INSERT INTO training_videos (
  id,
  title,
  description,
  video_url,
  category,
  duration,
  is_active,
  order_index
) VALUES
  ('1', 'Introduction to Door Knocking', 'Learn the basics of approaching homeowners', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'basics', 600, true, 1),
  ('2', 'Building Instant Rapport', 'Create meaningful connections quickly', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'rapport', 450, true, 2),
  ('3', 'Handling Common Objections', 'Turn objections into opportunities', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'objections', 500, true, 3),
  ('4', 'Closing with Confidence', 'Master the art of closing deals', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'closing', 550, true, 4)
ON CONFLICT (id) DO NOTHING;

-- Seed data for video_quizzes table
INSERT INTO video_quizzes (
  video_id,
  questions,
  passing_score
) VALUES
  ('1', '[
    {"title": "Door Knocking Basics Quiz", "description": "Test your knowledge of door knocking fundamentals", "category": "basics", "difficulty": "easy", "_metadata": true},
    {"question": "What should you check before knocking on a door?", "type": "multiple_choice", "options": ["The weather", "Your appearance", "No Soliciting signs", "The time"], "correctAnswer": "C", "points": 1},
    {"question": "The best time for door-to-door sales is typically between 5-7 PM", "type": "true_false", "correctAnswer": "true", "points": 1},
    {"question": "How many times should you knock on a door?", "type": "multiple_choice", "options": ["Once", "Twice", "Three times", "Until someone answers"], "correctAnswer": "C", "points": 1}
  ]'::jsonb, 70),
  ('2', '[
    {"title": "Building Rapport Quiz", "description": "Test your rapport building skills", "category": "rapport", "difficulty": "medium", "_metadata": true},
    {"question": "Which technique best builds rapport?", "type": "multiple_choice", "options": ["Talk about yourself", "Ask about their needs", "Jump straight to business", "Show product samples"], "correctAnswer": "B", "points": 1},
    {"question": "Mirroring body language can help build rapport", "type": "true_false", "correctAnswer": "true", "points": 1}
  ]'::jsonb, 75)
ON CONFLICT (video_id) DO NOTHING;