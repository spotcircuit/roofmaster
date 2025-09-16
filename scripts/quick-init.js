const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function quickInit() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🚀 Quick initialization of RoofMaster database...\n');

  try {
    // Create essential tables
    console.log('📊 Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('📊 Creating training_videos table...');
    await sql`
      CREATE TABLE IF NOT EXISTS training_videos (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        title TEXT NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        category TEXT NOT NULL,
        duration INTEGER DEFAULT 0,
        order_index INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        uploaded_by TEXT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('📊 Creating video_quizzes table...');
    await sql`
      CREATE TABLE IF NOT EXISTS video_quizzes (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        video_id TEXT NOT NULL REFERENCES training_videos(id) ON DELETE CASCADE,
        questions JSONB NOT NULL,
        passing_score INTEGER DEFAULT 80,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('📊 Creating user_video_progress table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_video_progress (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        video_id TEXT NOT NULL REFERENCES training_videos(id) ON DELETE CASCADE,
        watch_time INTEGER DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        quiz_score INTEGER,
        quiz_attempts INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, video_id)
      )
    `;

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS videos_category_idx ON training_videos(category)`;
    await sql`CREATE INDEX IF NOT EXISTS videos_active_idx ON training_videos(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS quiz_video_id_idx ON video_quizzes(video_id)`;
    await sql`CREATE INDEX IF NOT EXISTS user_video_idx ON user_video_progress(user_id, video_id)`;

    // Verify tables
    console.log('\n📋 Verifying tables...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`\n✅ Successfully created ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    // Add a test admin user
    console.log('\n👤 Creating test admin user...');
    await sql`
      INSERT INTO users (email, name, role)
      VALUES ('admin@roofmaster247.com', 'Admin User', 'admin')
      ON CONFLICT (email) DO NOTHING
    `;

    console.log('\n🎉 Database initialized successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

quickInit()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });