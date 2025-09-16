const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function addMissingTables() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🚀 Adding missing tables to Neon database...');

  try {
    // Check if training_videos table exists
    const existingTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('training_videos', 'video_quizzes', 'user_video_progress')
    `;

    console.log('Existing tables:', existingTables.map(t => t.table_name));

    // Create training_videos table if it doesn't exist
    if (!existingTables.find(t => t.table_name === 'training_videos')) {
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

      await sql`CREATE INDEX IF NOT EXISTS videos_category_idx ON training_videos(category)`;
      await sql`CREATE INDEX IF NOT EXISTS videos_active_idx ON training_videos(is_active)`;
      await sql`CREATE INDEX IF NOT EXISTS videos_uploaded_by_idx ON training_videos(uploaded_by)`;

      console.log('✅ training_videos table created');
    }

    // Create video_quizzes table if it doesn't exist
    if (!existingTables.find(t => t.table_name === 'video_quizzes')) {
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

      await sql`CREATE INDEX IF NOT EXISTS quiz_video_id_idx ON video_quizzes(video_id)`;

      console.log('✅ video_quizzes table created');
    }

    // Create user_video_progress table if it doesn't exist
    if (!existingTables.find(t => t.table_name === 'user_video_progress')) {
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

      await sql`CREATE INDEX IF NOT EXISTS user_video_idx ON user_video_progress(user_id, video_id)`;

      console.log('✅ user_video_progress table created');
    }

    // Add update triggers
    console.log('⚡ Creating update triggers...');

    // Create or replace the trigger function
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    // Add triggers for the new tables
    await sql`
      DROP TRIGGER IF EXISTS update_training_videos_updated_at ON training_videos
    `;
    await sql`
      CREATE TRIGGER update_training_videos_updated_at
      BEFORE UPDATE ON training_videos
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_video_quizzes_updated_at ON video_quizzes
    `;
    await sql`
      CREATE TRIGGER update_video_quizzes_updated_at
      BEFORE UPDATE ON video_quizzes
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_user_video_progress_updated_at ON user_video_progress
    `;
    await sql`
      CREATE TRIGGER update_user_video_progress_updated_at
      BEFORE UPDATE ON user_video_progress
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    console.log('✅ Triggers created');

    // Verify all tables
    console.log('\n📋 Verifying all required tables...');
    const allTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`\n✨ Total tables in database: ${allTables.length}`);

    const requiredTables = ['users', 'training_videos', 'video_quizzes', 'user_video_progress'];
    const missingTables = requiredTables.filter(t => !allTables.find(at => at.table_name === t));

    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables);
    } else {
      console.log('✅ All required tables exist!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
addMissingTables()
  .then(() => {
    console.log('\n🎉 Database tables ready!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });