-- 24-7 Restoration Training Platform Database Schema
-- Run this in your Neon database console to create all tables

-- Create database if not exists
-- Note: In Neon, create a new database called 'roofmaster247' first

-- Auth tables for NextAuth
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMP,
  name TEXT,
  image TEXT,
  role TEXT DEFAULT 'trainee', -- trainee, apex, manager, admin
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  PRIMARY KEY (provider, provider_account_id)
);

CREATE INDEX IF NOT EXISTS account_user_id_idx ON accounts(user_id);

CREATE TABLE IF NOT EXISTS sessions (
  session_token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS session_user_id_idx ON sessions(user_id);

-- Gamification tables
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_phase INTEGER DEFAULT 1,
  current_week INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_activity_date TIMESTAMP,
  personal_why TEXT,
  mentor_id TEXT,
  start_date TIMESTAMP DEFAULT NOW(),
  graduation_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profile_user_id_idx ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS profile_mentor_id_idx ON user_profiles(mentor_id);

CREATE TABLE IF NOT EXISTS user_stats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  doors_knocked INTEGER DEFAULT 0,
  conversations_had INTEGER DEFAULT 0,
  appointments_set INTEGER DEFAULT 0,
  inspections_completed INTEGER DEFAULT 0,
  deals_closed INTEGER DEFAULT 0,
  total_commission DECIMAL(10, 2) DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  weekly_goals_hit INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stats_user_id_idx ON user_stats(user_id);

CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL, -- door-warrior, trust-builder, etc
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  rarity TEXT, -- common, rare, epic, legendary
  category TEXT, -- milestone, performance, special
  requirement JSONB, -- JSON object with criteria
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  target INTEGER
);

CREATE INDEX IF NOT EXISTS user_badge_idx ON user_badges(user_id, badge_id);

CREATE TABLE IF NOT EXISTS phases (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  number INTEGER UNIQUE NOT NULL, -- 1-5
  name TEXT NOT NULL, -- door-opener, rapport-builder, etc
  title TEXT NOT NULL,
  description TEXT,
  weeks TEXT, -- "Weeks 1-2"
  icon TEXT,
  color TEXT, -- gradient colors
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modules (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  phase_id TEXT NOT NULL REFERENCES phases(id),
  code TEXT UNIQUE NOT NULL, -- do-1, rb-1, etc
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- lesson, practice, simulation, quiz, field
  description TEXT,
  content JSONB, -- Rich content in JSON
  duration TEXT,
  xp_reward INTEGER DEFAULT 0,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS module_phase_id_idx ON modules(phase_id);

CREATE TABLE IF NOT EXISTS user_module_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL REFERENCES modules(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  attempts INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_module_idx ON user_module_progress(user_id, module_id);

CREATE TABLE IF NOT EXISTS practice_scenarios (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL, -- deb-scenario, etc
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT, -- beginner, intermediate, advanced
  phases JSONB, -- Array of conversation phases
  scoring_criteria JSONB,
  tips JSONB,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS practice_attempts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL REFERENCES practice_scenarios(id),
  responses JSONB, -- User's responses
  score INTEGER,
  feedback JSONB,
  time_spent INTEGER, -- in seconds
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_scenario_idx ON practice_attempts(user_id, scenario_id);

CREATE TABLE IF NOT EXISTS daily_activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  doors_knocked INTEGER DEFAULT 0,
  conversations_had INTEGER DEFAULT 0,
  appointments_set INTEGER DEFAULT 0,
  practices_completed INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_date_idx ON daily_activities(user_id, date);

CREATE TABLE IF NOT EXISTS leaderboard (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- daily, weekly, monthly, all-time
  xp INTEGER DEFAULT 0,
  deals INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS period_rank_idx ON leaderboard(period, rank);

CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT, -- daily, weekly, special
  xp_reward INTEGER DEFAULT 0,
  requirement JSONB,
  active_from TIMESTAMP,
  active_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_challenges (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES challenges(id),
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_challenge_idx ON user_challenges(user_id, challenge_id);

-- Insert initial data for phases
INSERT INTO phases (number, name, title, description, weeks, icon, color) VALUES
(1, 'door-opener', 'The Door Opener', 'Master the fundamentals of door-to-door engagement', 'Weeks 1-2', '🚪', 'from-blue-400 to-blue-600'),
(2, 'rapport-builder', 'The Rapport Builder', 'Advanced techniques for building instant trust', 'Weeks 3-5', '🤝', 'from-purple-400 to-purple-600'),
(3, 'inspection-expert', 'The Inspection Expert', 'Master damage identification and technical expertise', 'Weeks 6-8', '🔍', 'from-green-400 to-green-600'),
(4, 'insurance-master', 'The Insurance Master', 'Navigate insurance claims and legal compliance', 'Weeks 9-10', '📋', 'from-orange-400 to-orange-600'),
(5, 'apex-pro', 'The Apex Sales Pro', 'Master psychological principles and become a top performer', 'Weeks 11-12', '🏆', 'from-red-500 to-pink-600')
ON CONFLICT (number) DO NOTHING;

-- Insert initial badges
INSERT INTO badges (code, name, description, icon, xp_reward, rarity, category) VALUES
('door-warrior', 'Door Warrior', 'Knocked your first 100 doors', '🚪', 500, 'common', 'milestone'),
('trust-builder', 'Trust Builder', 'Mastered rapport building techniques', '🤝', 750, 'rare', 'milestone'),
('damage-detective', 'Damage Detective', 'Correctly identified 50+ damage types', '🔍', 1000, 'rare', 'milestone'),
('insurance-wizard', 'Insurance Wizard', 'Mastered insurance claim navigation', '🧙‍♂️', 1250, 'epic', 'milestone'),
('apex-pro', 'Apex Sales Pro', 'Completed the 12-week journey', '🏆', 5000, 'legendary', 'milestone'),
('first-sale', 'First Blood', 'Closed your first deal', '💰', 1000, 'rare', 'performance'),
('perfect-week', 'Perfect Week', 'Hit all weekly goals', '⭐', 750, 'rare', 'performance'),
('streak-master', 'Streak Master', '30-day activity streak', '🔥', 1500, 'epic', 'performance'),
('six-figure', 'Six Figure Club', 'Reached $100k in total commissions', '💎', 10000, 'legendary', 'performance')
ON CONFLICT (code) DO NOTHING;

-- Insert sample practice scenario (Deb)
INSERT INTO practice_scenarios (code, title, description, difficulty, phases, scoring_criteria, tips, category) VALUES
('deb-scenario', 'The Deb Scenario', 'Build trust with a reluctant homeowner who needs guidance', 'advanced',
'[{"ai": "Oh, another roofing person? I''ve had three companies knock this week. I''m really not interested in dealing with this right now.", "hints": ["Start with non-roof topic", "Find common ground", "Be genuinely interested"], "perfectResponse": "I totally understand the frustration! Seems like everyone''s been busy in the neighborhood. I actually noticed your beautiful garden - those roses are stunning! How long have you been working on it?"}]'::jsonb,
'["Started with non-roof conversation", "Built genuine rapport", "Gentle transition to business", "No pressure approach", "Demonstrated trustworthiness"]'::jsonb,
'["Start with something other than the roof", "Find common ground (garden, pets, neighborhood)", "Be genuinely interested in them as a person", "Position yourself as helpful, not salesy"]'::jsonb,
'trust-building')
ON CONFLICT (code) DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_module_progress_updated_at BEFORE UPDATE ON user_module_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practice_scenarios_updated_at BEFORE UPDATE ON practice_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON leaderboard FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Training videos table
CREATE TABLE IF NOT EXISTS training_videos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  category TEXT NOT NULL,
  duration INTEGER DEFAULT 0, -- in seconds
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS videos_category_idx ON training_videos(category);
CREATE INDEX IF NOT EXISTS videos_active_idx ON training_videos(is_active);
CREATE INDEX IF NOT EXISTS videos_uploaded_by_idx ON training_videos(uploaded_by);

-- Video quizzes table
CREATE TABLE IF NOT EXISTS video_quizzes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  video_id TEXT NOT NULL REFERENCES training_videos(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- Array of quiz questions
  passing_score INTEGER DEFAULT 80,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quiz_video_id_idx ON video_quizzes(video_id);

-- User video progress table
CREATE TABLE IF NOT EXISTS user_video_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id TEXT NOT NULL REFERENCES training_videos(id) ON DELETE CASCADE,
  watch_time INTEGER DEFAULT 0, -- in seconds
  completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  quiz_attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

CREATE INDEX IF NOT EXISTS user_video_idx ON user_video_progress(user_id, video_id);

-- Add triggers for new tables
CREATE TRIGGER update_training_videos_updated_at BEFORE UPDATE ON training_videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_quizzes_updated_at BEFORE UPDATE ON video_quizzes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_video_progress_updated_at BEFORE UPDATE ON user_video_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();