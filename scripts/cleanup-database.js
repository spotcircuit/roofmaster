const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function cleanupDatabase() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🧹 Cleaning up RoofMaster tables from LeadFinder database...\n');

  try {
    // List of RoofMaster-specific tables to remove
    const roofmasterTables = [
      'user_video_progress',
      'video_quizzes',
      'training_videos',
      'user_challenges',
      'challenges',
      'leaderboard',
      'daily_activities',
      'practice_attempts',
      'practice_scenarios',
      'user_module_progress',
      'modules',
      'phases',
      'user_badges',
      'badges',
      'user_stats',
      'user_profiles',
      'sessions',
      'accounts',
      'users'  // Remove this last due to foreign keys
    ];

    console.log('📋 Tables to remove:');
    roofmasterTables.forEach(t => console.log(`   - ${t}`));
    console.log('');

    // Check which tables actually exist
    const existingTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = ANY(${roofmasterTables})
    `;

    console.log(`Found ${existingTables.length} RoofMaster tables to remove\n`);

    // Drop tables in order (to handle foreign key constraints)
    for (const table of roofmasterTables) {
      const exists = existingTables.find(t => t.table_name === table);
      if (exists) {
        try {
          console.log(`🗑️  Dropping table: ${table}`);
          await sql.unsafe(`DROP TABLE IF EXISTS ${table} CASCADE`);
          console.log(`   ✅ Dropped ${table}`);
        } catch (error) {
          console.log(`   ⚠️  Error dropping ${table}: ${error.message}`);
        }
      }
    }

    // Also drop the update trigger function if no other tables use it
    console.log('\n🗑️  Dropping trigger function...');
    try {
      await sql`DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE`;
      console.log('   ✅ Dropped trigger function');
    } catch (error) {
      console.log(`   ⚠️  Error dropping trigger function: ${error.message}`);
    }

    // Verify what's left
    console.log('\n📊 Verifying remaining tables...');
    const remainingTables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`\n✅ Cleanup complete! ${remainingTables.length} tables remaining:`);

    // Show LeadFinder tables that should remain
    const leadfinderTables = remainingTables.filter(t =>
      ['competitor_searches', 'competitor_summaries', 'contact_to_lead',
       'grid_cells', 'grid_competitors', 'grid_point_results',
       'grid_searches', 'lead_collections', 'leads', 'leads_captured',
       'outreach_campaigns', 'outreach_email_history', 'outreach_prospects',
       'prospects', 'search_prospects'].includes(t.table_name)
    );

    console.log('\n📂 LeadFinder tables (preserved):');
    leadfinderTables.forEach(t => console.log(`   ✅ ${t.table_name}`));

    // Check for any unexpected remaining tables
    const unexpectedTables = remainingTables.filter(t =>
      !leadfinderTables.find(lf => lf.table_name === t.table_name)
    );

    if (unexpectedTables.length > 0) {
      console.log('\n⚠️  Other tables found:');
      unexpectedTables.forEach(t => console.log(`   - ${t.table_name}`));
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanupDatabase()
  .then(() => {
    console.log('\n🎉 Database cleanup complete!');
    console.log('Your LeadFinder database is now clean.');
    console.log('\n📝 Next steps:');
    console.log('1. Create a new database in Neon called "roofmaster247"');
    console.log('2. Update .env.local with the new database URL');
    console.log('3. Run the init script again');
    process.exit(0);
  })
  .catch(error => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });