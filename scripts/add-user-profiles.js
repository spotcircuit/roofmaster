const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function addUserProfiles() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🚀 Adding user_profiles and related tables...\n');

  try {
    // Create user_profiles table
    console.log('📊 Creating user_profiles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        current_phase INTEGER DEFAULT 1,
        current_week INTEGER DEFAULT 1,
        xp_points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        streak_days INTEGER DEFAULT 0,
        last_activity_date TIMESTAMP DEFAULT NOW(),
        mentor_id TEXT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      )
    `;

    // Create user_stats table
    console.log('📊 Creating user_stats table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_stats (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        doors_knocked INTEGER DEFAULT 0,
        conversations_started INTEGER DEFAULT 0,
        appointments_set INTEGER DEFAULT 0,
        deals_closed INTEGER DEFAULT 0,
        revenue_generated DECIMAL DEFAULT 0,
        practice_time_minutes INTEGER DEFAULT 0,
        quiz_score_avg DECIMAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id)
      )
    `;

    // Create phases table
    console.log('📊 Creating phases table...');
    await sql`
      CREATE TABLE IF NOT EXISTS phases (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        phase_number INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        xp_required INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(phase_number)
      )
    `;

    // Create modules table
    console.log('📊 Creating modules table...');
    await sql`
      CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        phase_id TEXT REFERENCES phases(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        xp_reward INTEGER DEFAULT 100,
        estimated_time INTEGER DEFAULT 30,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create user_module_progress table
    console.log('📊 Creating user_module_progress table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_module_progress (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        score INTEGER,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, module_id)
      )
    `;

    // Create indexes
    console.log('\n🔍 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS profile_user_id_idx ON user_profiles(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS stats_user_id_idx ON user_stats(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS module_phase_id_idx ON modules(phase_id)`;
    await sql`CREATE INDEX IF NOT EXISTS user_module_idx ON user_module_progress(user_id, module_id)`;

    // Insert initial phases
    console.log('\n📝 Adding initial phases...');
    await sql`
      INSERT INTO phases (phase_number, name, description, xp_required)
      VALUES
        (1, 'Door Opener', 'Master the art of approaching prospects', 1000),
        (2, 'Rapport Builder', 'Build genuine connections with customers', 2500),
        (3, 'Inspector', 'Learn professional inspection techniques', 5000),
        (4, 'Presenter', 'Perfect your sales presentation skills', 7500),
        (5, 'Apex Closer', 'Become a master at closing deals', 10000)
      ON CONFLICT (phase_number) DO NOTHING
    `;

    // Create profile for existing admin user
    console.log('\n👤 Creating profile for admin user...');
    await sql`
      INSERT INTO user_profiles (user_id, current_phase, level, xp_points)
      SELECT id, 1, 1, 0 FROM users WHERE email = 'admin@roofmaster247.com'
      ON CONFLICT (user_id) DO NOTHING
    `;

    await sql`
      INSERT INTO user_stats (user_id)
      SELECT id FROM users WHERE email = 'admin@roofmaster247.com'
      ON CONFLICT (user_id) DO NOTHING
    `;

    // Verify tables
    console.log('\n📋 Verifying tables...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`\n✅ Successfully created/updated tables. Total: ${tables.length}`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    console.log('\n🎉 Database setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addUserProfiles()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Failed:', error);
    process.exit(1);
  });