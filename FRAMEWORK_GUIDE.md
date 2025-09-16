# RoofMaster 24-7 Training Platform Framework

## Overview
This is a streamlined training platform with video upload, quiz management, and AI comprehension tracking for roofing sales training.

## Core Features

### 1. Authentication System
- **Admin Account**: Full access to upload videos, create quizzes, and monitor all users
- **User Account**: Access to watch videos, take quizzes, and view their progress
- Uses Neon Postgres database with NextAuth for authentication

### 2. Video Management (Admin)
**Location**: `/admin/videos`

- Upload training videos by providing:
  - Title and description
  - Video URL (YouTube or direct link)
  - Category (basics, door-knocking, rapport, objections, closing, advanced)
  - Duration
- Activate/deactivate videos
- Videos are stored in the database and served to users

### 3. Quiz System (Admin)
**Location**: `/admin/videos/[videoId]/quiz`

- Create quizzes for each video with:
  - Multiple choice questions
  - True/false questions
  - Open-ended questions (AI evaluated)
  - Passing score threshold
  - Maximum attempts allowed
  - Time limits (optional)
- Questions include explanations shown after answering
- Point values for each question

### 4. AI Comprehension Monitoring (Admin)
**Location**: `/admin/comprehension`

- View all users' comprehension scores
- Track progress across videos and quizzes
- Identify strong areas and areas needing improvement
- Run AI analysis on individual users
- Get recommendations for content improvements
- Dashboard shows:
  - Overall comprehension scores
  - Quiz performance metrics
  - Recent activity tracking
  - User categorization (Top Performers, Need Support, At Risk)

### 5. User Training Experience
**Location**: `/training`

- Browse videos by category
- Watch training videos
- Take comprehension quizzes after each video
- Get instant feedback with AI analysis
- Track completion status
- View quiz scores and retake if needed

## Database Schema

The platform uses these main tables:
- `users` - User accounts with roles (admin/trainee)
- `training_videos` - Video content metadata
- `quizzes` - Quiz configurations
- `quiz_questions` - Individual questions for each quiz
- `user_quiz_attempts` - Track user quiz submissions
- `user_video_progress` - Track video watching progress
- `ai_comprehension_scores` - AI evaluation data
- `user_comprehension_summary` - Overall user performance

## How to Use

### For Admins

1. **Login as Admin**
   - Go to homepage and click "Admin Access"
   - You'll be redirected to the admin dashboard

2. **Upload Videos**
   - Navigate to "Video Management"
   - Click "Upload New Video"
   - Fill in video details and URL
   - Submit to add to the platform

3. **Create Quizzes**
   - From Video Management, click "Manage Quiz" next to any video
   - Add questions (multiple choice, true/false, or open-ended)
   - Set passing score and attempts allowed
   - Save the quiz

4. **Monitor Comprehension**
   - Go to "Comprehension Monitoring"
   - View all users' scores and progress
   - Click on a user for detailed analysis
   - Run AI analysis for personalized insights

### For Users

1. **Login as User**
   - Click "Start Training" on homepage
   - You'll see your journey dashboard

2. **Watch Videos**
   - Go to "Training Videos"
   - Select a category or browse all
   - Click on a video to watch
   - Complete the video

3. **Take Quizzes**
   - After watching, click "Take Comprehension Quiz"
   - Answer all questions
   - Submit for instant scoring
   - Review AI feedback on your comprehension
   - Retake if you don't pass (within attempt limits)

## API Endpoints

### Admin APIs
- `GET/POST /api/admin/videos` - Manage videos
- `GET/POST/PUT /api/admin/videos/[videoId]/quiz` - Manage quizzes
- `GET /api/admin/comprehension` - Get user comprehension data
- `POST /api/admin/comprehension/analyze` - Run AI analysis

### User APIs
- `GET /api/training/videos` - Get available videos
- `GET /api/training/videos/[videoId]/quiz` - Get quiz for a video
- `POST /api/training/videos/[videoId]/quiz/submit` - Submit quiz answers

### Auth APIs
- `POST /api/auth/demo` - Create demo user session
- `POST /api/auth/demo-admin` - Create admin session

## Key Files

### Admin Pages
- `/app/admin/page.tsx` - Admin dashboard
- `/app/admin/videos/page.tsx` - Video management
- `/app/admin/videos/[videoId]/quiz/page.tsx` - Quiz builder
- `/app/admin/comprehension/page.tsx` - AI monitoring

### User Pages
- `/app/journey/page.tsx` - User dashboard
- `/app/training/page.tsx` - Video training interface

### Database
- `/lib/db/schema.ts` - Complete database schema
- `/lib/auth.ts` - Authentication configuration

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=your_neon_database_url
NEON_API_KEY=your_neon_api_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## Next Steps for Implementation

1. **Connect Real Database**: The API routes currently use mock data. Connect them to the Neon database using the schema.

2. **Implement File Upload**: Add actual video file upload capability (consider using services like Cloudinary or AWS S3).

3. **AI Integration**: Connect to an AI service (OpenAI, Claude API) for:
   - Evaluating open-ended quiz answers
   - Generating comprehension analysis
   - Providing personalized recommendations

4. **Add More Features**:
   - Email notifications for quiz results
   - Progress certificates
   - Leaderboards
   - Video transcripts
   - Discussion forums

5. **Production Deployment**:
   - Set up proper authentication with JWT tokens
   - Add rate limiting
   - Implement proper error handling
   - Set up monitoring and analytics

## Testing the Framework

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Admin Access" to explore admin features
4. Click "Start Training" to see the user experience

The framework is ready for you to upload videos and create quizzes. All the UI and basic functionality is in place - you just need to add your content!