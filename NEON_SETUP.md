# Neon Database Setup Instructions

## Step 1: Create a New Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Click "Create a project"
3. Name it: `roofmaster247`
4. Select region closest to you (e.g., US East)
5. Click "Create project"

## Step 2: Get Your Connection String

1. In the Neon console, go to your project dashboard
2. Click on "Connection Details"
3. Copy the connection string (it should look like):
   ```
   postgresql://[user]:[password]@[endpoint]/roofmaster247?sslmode=require
   ```

## Step 3: Update Your Environment Variables

1. Edit `/mnt/c/Users/Big Daddy Pyatt/CascadeProjects/roofmaster247/.env.local`
2. Replace the DATABASE_URL with your new connection string:
   ```
   DATABASE_URL=postgresql://[your-connection-string]
   ```

## Step 4: Run the Database Setup

### Option A: Using Neon SQL Editor (Recommended)
1. In Neon Console, click "SQL Editor"
2. Copy the entire contents of `/lib/db/init.sql`
3. Paste and run in the SQL Editor
4. You should see "Query executed successfully"

### Option B: Using Drizzle Migration
1. First, ensure your DATABASE_URL is correct in `.env.local`
2. Run these commands:
   ```bash
   # Generate migrations
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

## Step 5: Verify Setup

Run this query in Neon SQL Editor to verify tables were created:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these tables:
- accounts
- badges
- challenges
- daily_activities
- leaderboard
- modules
- phases
- practice_attempts
- practice_scenarios
- sessions
- user_badges
- user_challenges
- user_module_progress
- user_profiles
- user_stats
- users

## Step 6: Add NextAuth Environment Variables

Add these to your `.env.local`:
```
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generate-a-secret-using: openssl rand -base64 32]

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Step 7: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to:
   - http://localhost:3000/journey - See the journey dashboard
   - http://localhost:3000/practice/deb-scenario - Try the practice scenario

## Troubleshooting

### If you get connection errors:
1. Check that your DATABASE_URL is correct
2. Ensure the database name is `roofmaster247`
3. Verify SSL mode is set to `require`

### If tables aren't created:
1. Run the SQL script manually in Neon SQL Editor
2. Check for any error messages
3. Ensure you're connected to the right database

## Database Schema Overview

The database includes:
- **Authentication**: Users, sessions, accounts (NextAuth)
- **Gamification**: XP, levels, badges, achievements
- **Training**: 5-phase journey system with modules
- **Practice**: Scenarios, attempts, scoring
- **Analytics**: Daily activities, leaderboards, stats

## Next Steps

1. Configure authentication providers (Google, etc.)
2. Create admin user for content management
3. Start adding training content through the admin panel
4. Customize the training modules for your team