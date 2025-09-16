# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

RoofMaster 24-7 is a comprehensive training platform for roofing sales professionals built with Next.js, TypeScript, and a gamified learning system. The platform features role-based dashboards, interactive training modules, AI practice scenarios, and performance tracking.

## Common Commands

### Development
```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Build CSS (PostCSS)
npm run build:css
```

### Database Operations
```powershell
# Generate Drizzle migrations
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# View database schema
npx drizzle-kit studio
```

### Testing and Debugging
```powershell
# Test database connection
node -e "require('dotenv').config({path:'.env.local'}); console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing')"

# Check Next.js build
npm run build -- --debug
```

## Architecture Overview

### Core Technology Stack
- **Frontend**: Next.js with Pages Router (not App Router)
- **Language**: TypeScript with relaxed strict mode (`"strict": false`)
- **Authentication**: NextAuth v5 with Drizzle adapter
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Styling**: Tailwind CSS with custom color palette
- **State**: React Context API for authentication

### Database Schema (Drizzle ORM)
The application uses a comprehensive gamification system with the following key entities:

**Authentication Tables** (NextAuth compatible):
- `users` - Base user authentication
- `accounts` - OAuth provider accounts  
- `sessions` - User sessions

**Gamification System**:
- `userProfiles` - User progress, XP, levels, current phase/week
- `userStats` - Performance metrics (doors knocked, deals closed, etc.)
- `badges` & `userBadges` - Achievement system
- `challenges` & `userChallenges` - Daily/weekly challenges
- `leaderboard` - Ranking system

**Training System**:
- `phases` - 5-phase training journey (door-opener, rapport-builder, etc.)
- `modules` - Individual training modules within phases
- `userModuleProgress` - User completion tracking
- `practiceScenarios` - AI conversation practice scenarios
- `practiceAttempts` - User practice session results
- `dailyActivities` - Daily performance logging

### Application Structure

**Pages** (Next.js Pages Router):
- `/` - Login page
- `/dashboard` - Main user dashboard
- `/admin/` - Admin dashboard (role-protected)
- `/training/` - Training module interface
- `/ai-interactive/` - AI practice scenarios
- `/practice-lab/` - Practice environment

**Key Components**:
- `Layout.tsx` - Main layout with background and navigation
- `Nav.tsx` - Sidebar navigation
- `Quiz.tsx` - Interactive quiz system
- `Scorecard.tsx` - Performance evaluation tool
- `AIVoiceClient.tsx` - AI conversation interface
- `PracticeScenario.tsx` - Practice scenario handler

### Authentication & Authorization
Uses NextAuth v5 with role-based access:
- **Roles**: `trainee`, `apex`, `manager`, `admin`
- **Demo accounts**: 
  - User: alice@example.com (any password)
  - Admin: bob@example.com (any password)
- **Providers**: Google OAuth + Credentials (for development)

### Data Architecture Patterns

**Gamification**: The app uses XP, levels, badges, and leaderboards to motivate users through a 5-phase journey system.

**Progress Tracking**: Comprehensive tracking across modules, daily activities, and practice scenarios with scoring and feedback systems.

**Role-Based Content**: Different dashboards and available features based on user role (`trainee`, `apex`, `manager`, `admin`).

## Environment Setup

### Required Environment Variables (.env.local)
```
# Database
DATABASE_URL=postgresql://[user]:[password]@[endpoint]/roofmaster247?sslmode=require

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Database Setup
1. Create Neon PostgreSQL database named `roofmaster247`
2. Run `npx drizzle-kit push` to create schema
3. Verify tables are created (14 tables total)

## Development Notes

### TypeScript Configuration
- Uses relaxed TypeScript settings (`"strict": false`)
- Path aliases configured: `@/*` maps to project root
- Includes Next.js plugin for enhanced TypeScript support

### Styling System
- Custom Tailwind color palette with `primary`, `secondary`, and `accent` colors
- Uses background images and glass-morphism effects
- Responsive design with mobile-first approach

### Current Development Status
- **Implemented**: Core authentication, database schema, basic UI components
- **In Progress**: Content integration from Google Docs (see docs/IMPLEMENTATION_GUIDE.md)
- **Known Issues**: Some TypeScript errors in training pages, placeholder video content

### Data Integration
The platform is designed to integrate training content from Google Docs:
- Training scripts and scenarios
- Quiz questions
- Performance scorecards
- SOP documents

Refer to `docs/IMPLEMENTATION_GUIDE.md` for content integration instructions.

### Testing
- Uses demo accounts for development
- Mock data structure in place for training modules
- Database setup can be verified through Neon SQL Editor

## File Structure Patterns

### Pages Organization
- Role-specific pages in subdirectories (`/admin/`, `/training/`)
- Consistent layout and navigation across pages
- TypeScript interfaces for props

### Component Architecture
- Reusable UI components in `/components/`
- Props interfaces defined in each component file
- Context providers for global state (authentication)

### Database Layer
- Schema definitions in `/lib/db/schema.ts`
- Database client in `/lib/db/index.ts`
- Authentication configuration in `/lib/auth.ts`

## Development Workflow

When working on this codebase:

1. **Database First**: Schema changes require Drizzle migration generation
2. **Component Driven**: Build reusable components for training features
3. **Role-Aware**: Consider user roles when implementing features
4. **Progress Tracking**: Integrate with the gamification system for user engagement
5. **Mock Data**: Use existing data structure patterns in `/lib/data.ts` (if present)

The platform is designed for extensibility with additional training modules, practice scenarios, and gamification features.