const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🚀 Setting up Neon database for RoofMaster 24-7 Training Platform...\n');

  try {
    // Connect to database
    const sql = neon(process.env.DATABASE_URL);

    console.log('📊 Creating tables...');

    // Check if tables already exist
    const tableCheck = await sql`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    `;

    if (tableCheck[0].count > 0) {
      console.log('⚠️  Tables already exist. Skipping creation...');
      return;
    }

    // Create all tables
    await sql`
      -- Auth tables for NextAuth
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        email_verified TIMESTAMP,
        name TEXT,
        image TEXT,
        role TEXT DEFAULT 'trainee',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
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
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS account_user_id_idx ON accounts(user_id)`;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        session_token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMP NOT NULL
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS session_user_id_idx ON sessions(user_id)`;

    // Gamification tables
    await sql`
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
      )
    `;

    await sql`
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS badges (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        xp_reward INTEGER DEFAULT 0,
        rarity TEXT,
        category TEXT,
        requirement JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_badges (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        badge_id TEXT NOT NULL REFERENCES badges(id),
        unlocked_at TIMESTAMP DEFAULT NOW(),
        progress INTEGER DEFAULT 0,
        target INTEGER
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS phases (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        number INTEGER UNIQUE NOT NULL,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        weeks TEXT,
        icon TEXT,
        color TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        phase_id TEXT NOT NULL REFERENCES phases(id),
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        content JSONB,
        duration TEXT,
        xp_reward INTEGER DEFAULT 0,
        order_index INTEGER,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_module_progress (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        module_id TEXT NOT NULL REFERENCES modules(id),
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        attempts INTEGER DEFAULT 0,
        time_spent INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS practice_scenarios (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        difficulty TEXT,
        phases JSONB,
        scoring_criteria JSONB,
        tips JSONB,
        category TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS practice_attempts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        scenario_id TEXT NOT NULL REFERENCES practice_scenarios(id),
        responses JSONB,
        score INTEGER,
        feedback JSONB,
        time_spent INTEGER,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS leaderboard (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        period TEXT NOT NULL,
        xp INTEGER DEFAULT 0,
        deals INTEGER DEFAULT 0,
        rank INTEGER,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT,
        xp_reward INTEGER DEFAULT 0,
        requirement JSONB,
        active_from TIMESTAMP,
        active_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_challenges (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        challenge_id TEXT NOT NULL REFERENCES challenges(id),
        progress INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('✅ Tables created successfully!\n');

    // Insert initial data
    console.log('📝 Inserting initial data...');

    // Insert phases
    await sql`
      INSERT INTO phases (number, name, title, description, weeks, icon, color) VALUES
      (1, 'door-opener', 'The Door Opener', 'Master the fundamentals of door-to-door engagement', 'Weeks 1-2', '🚪', 'from-blue-400 to-blue-600'),
      (2, 'rapport-builder', 'The Rapport Builder', 'Advanced techniques for building instant trust', 'Weeks 3-5', '🤝', 'from-purple-400 to-purple-600'),
      (3, 'inspection-expert', 'The Inspection Expert', 'Master damage identification and technical expertise', 'Weeks 6-8', '🔍', 'from-green-400 to-green-600'),
      (4, 'insurance-master', 'The Insurance Master', 'Navigate insurance claims and legal compliance', 'Weeks 9-10', '📋', 'from-orange-400 to-orange-600'),
      (5, 'apex-pro', 'The Apex Sales Pro', 'Master psychological principles and become a top performer', 'Weeks 11-12', '🏆', 'from-red-500 to-pink-600')
      ON CONFLICT (number) DO NOTHING
    `;

    // Insert badges
    await sql`
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
      ON CONFLICT (code) DO NOTHING
    `;

    // Insert Deb scenario
    await sql`
      INSERT INTO practice_scenarios (code, title, description, difficulty, phases, scoring_criteria, tips, category) VALUES
      ('deb-scenario', 'The Deb Scenario', 'Build trust with a reluctant homeowner who needs guidance', 'advanced',
      '[{"ai": "Oh, another roofing person? I''ve had three companies knock this week. I''m really not interested in dealing with this right now.", "hints": ["Start with non-roof topic", "Find common ground", "Be genuinely interested"], "perfectResponse": "I totally understand the frustration! Seems like everyone''s been busy in the neighborhood. I actually noticed your beautiful garden - those roses are stunning! How long have you been working on it?"}]'::jsonb,
      '["Started with non-roof conversation", "Built genuine rapport", "Gentle transition to business", "No pressure approach", "Demonstrated trustworthiness"]'::jsonb,
      '["Start with something other than the roof", "Find common ground (garden, pets, neighborhood)", "Be genuinely interested in them as a person", "Position yourself as helpful, not salesy"]'::jsonb,
      'trust-building')
      ON CONFLICT (code) DO NOTHING
    `;

    console.log('✅ Initial data inserted!\n');

    // Create demo user
    console.log('👤 Creating demo user...');

    await sql`
      INSERT INTO users (email, name, role) VALUES
      ('demo@roofmaster247.com', 'Demo User', 'trainee')
      ON CONFLICT (email) DO NOTHING
    `;

    const demoUser = await sql`
      SELECT id FROM users WHERE email = 'demo@roofmaster247.com'
    `;

    if (demoUser.length > 0) {
      await sql`
        INSERT INTO user_profiles (user_id, personal_why, xp, level) VALUES
        (${demoUser[0].id}, 'To achieve financial freedom and master the art of sales', 2750, 8)
        ON CONFLICT (user_id) DO NOTHING
      `;

      await sql`
        INSERT INTO user_stats (user_id, doors_knocked, conversations_had, appointments_set) VALUES
        (${demoUser[0].id}, 245, 52, 3)
        ON CONFLICT (user_id) DO NOTHING
      `;
    }

    console.log('✅ Demo user created!\n');
    console.log('🎉 Database setup complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Visit: http://localhost:3000/journey');
    console.log('3. Login with: demo@roofmaster247.com');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.error('\nMake sure your DATABASE_URL in .env.local is correct');
    process.exit(1);
  }
}

setupDatabase();