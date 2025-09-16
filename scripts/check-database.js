const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function checkDatabase() {
  console.log('🔍 Checking database connection...\n');

  // Show the connection string (masked)
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ No DATABASE_URL found in .env.local');
    return;
  }

  // Parse and display connection info
  const urlParts = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/);
  if (urlParts) {
    console.log('📊 Database Connection Info:');
    console.log(`   User: ${urlParts[1]}`);
    console.log(`   Host: ${urlParts[3]}`);
    console.log(`   Database: ${urlParts[4]}`);
    console.log(`   Region: ${urlParts[3].includes('us-east-1') ? 'US East 1' : 'Unknown'}`);
    console.log('');
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Get current database name
    const dbInfo = await sql`SELECT current_database() as database, current_user as user`;
    console.log('✅ Connected to Neon successfully!');
    console.log(`   Database: ${dbInfo[0].database}`);
    console.log(`   User: ${dbInfo[0].user}\n`);

    // Count tables
    const tables = await sql`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;
    console.log(`📊 Total tables in database: ${tables[0].count}\n`);

    // List all tables
    const tableList = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
      LIMIT 10
    `;

    console.log('📋 First 10 tables:');
    tableList.forEach(t => console.log(`   - ${t.table_name}`));

    // Check for our specific tables
    const ourTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'training_videos', 'video_quizzes')
    `;

    console.log('\n🎯 RoofMaster tables found:');
    if (ourTables.length > 0) {
      ourTables.forEach(t => console.log(`   ✅ ${t.table_name}`));
    } else {
      console.log('   ❌ No RoofMaster tables found!');
    }

    // Check if there's data
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const videoCount = await sql`SELECT COUNT(*) as count FROM training_videos`;

    console.log('\n📈 Data counts:');
    console.log(`   Users: ${userCount[0].count}`);
    console.log(`   Videos: ${videoCount[0].count}`);

  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your DATABASE_URL in .env.local is correct');
    console.log('2. Make sure the database exists in Neon console');
    console.log('3. Verify the connection string matches your Neon project');
  }
}

checkDatabase();