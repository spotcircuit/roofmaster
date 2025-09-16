const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function initDatabase() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('🚀 Connecting to Neon database...');

  try {
    // Read the SQL file
    const initSQL = fs.readFileSync(path.join(__dirname, '../lib/db/init.sql'), 'utf8');

    // Split by semicolons but keep them, and filter out empty statements
    const statements = initSQL
      .split(/;\s*$/gm)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
      .map(s => s + ';');

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip empty statements or comments
      if (!statement.trim() || statement.trim().startsWith('--')) {
        continue;
      }

      // Show progress
      if (statement.includes('CREATE TABLE')) {
        const tableMatch = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/i);
        if (tableMatch) {
          console.log(`📊 Creating table: ${tableMatch[1]}`);
        }
      } else if (statement.includes('INSERT INTO')) {
        const tableMatch = statement.match(/INSERT INTO (\w+)/i);
        if (tableMatch) {
          console.log(`➕ Inserting data into: ${tableMatch[1]}`);
        }
      } else if (statement.includes('CREATE INDEX')) {
        const indexMatch = statement.match(/CREATE INDEX IF NOT EXISTS (\w+)/i);
        if (indexMatch) {
          console.log(`🔍 Creating index: ${indexMatch[1]}`);
        }
      } else if (statement.includes('CREATE TRIGGER')) {
        const triggerMatch = statement.match(/CREATE TRIGGER (\w+)/i);
        if (triggerMatch) {
          console.log(`⚡ Creating trigger: ${triggerMatch[1]}`);
        }
      }

      try {
        await sql.unsafe(statement);
      } catch (error) {
        // Ignore errors for "already exists" cases
        if (error.message.includes('already exists') ||
            error.message.includes('duplicate key')) {
          console.log(`⚠️  Skipping (already exists): ${error.message.split('\n')[0]}`);
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message.split('\n')[0]);
          // Continue with other statements
        }
      }
    }

    console.log('\n✅ Database initialization complete!');

    // Verify tables were created
    console.log('\n📋 Verifying tables...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`\n✨ Successfully created ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    // Check if we have initial data
    const phases = await sql`SELECT COUNT(*) as count FROM phases`;
    const badges = await sql`SELECT COUNT(*) as count FROM badges`;

    console.log(`\n📊 Initial data:`);
    console.log(`   - Phases: ${phases[0].count}`);
    console.log(`   - Badges: ${badges[0].count}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase()
  .then(() => {
    console.log('\n🎉 Database ready for use!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });