# RoofMaster 24-7 Content Implementation Guide

## Overview
This guide explains how to integrate your Google Docs content into the functional training platform. The platform now has interactive components ready to use your actual training content.

## What's Been Built

### 1. Quiz Component (`/components/Quiz.tsx`)
- Interactive quiz system for testing knowledge
- Tracks scores and provides immediate feedback
- Ready to integrate questions from your "video script with questions" document

### 2. Scorecard Component (`/components/Scorecard.tsx`)
- Performance evaluation tool based on your 24-7 Restoration scorecard
- Weighted scoring across categories
- Visual performance indicators

### 3. Updated Data Structure (`/lib/data.ts`)
- Structured placeholders for all your content
- Support for transcripts, quizzes, and resources
- Ready for your actual training materials

## How to Add Your Content

### Step 1: Entry to Sales Content
**Source:** https://docs.google.com/document/d/1gBpF0h7P9RxdYzQyEmLipqXfKma5T4i5rHgg8pF13yk/edit

1. Open the Google Doc
2. Copy each section of content
3. In `/lib/data.ts`, find the "Entry to Sales - Complete Guide" in the `sops` array
4. Replace `[TO BE ADDED: Paste complete Entry to Sales content from Google Doc]` with your actual content
5. Format using markdown:
   ```markdown
   # Main Heading
   ## Section Heading
   - Bullet points
   **Bold text** for emphasis
   ```

### Step 2: Door-to-Door Training Plan
**Source:** https://docs.google.com/document/d/1Lai3AKf4Rt1NFLZ2xTrKVqTzZBFGLAdzlXOwG_Eh_ww/edit

1. Open the training plan document
2. Extract the training steps and techniques
3. In `/lib/data.ts`, update:
   - The "Door-to-Door Sales Mastery" module with the training content
   - Create practice scenarios in the `scenarios` array based on common situations

Example scenario format:
```javascript
{
  id: 304,
  title: "Cold Door Approach",
  description: "Practice your initial approach at a homeowner's door",
  script: [
    { from: "AI", text: "Who is it? We weren't expecting anyone." },
    // Add more dialogue turns
  ],
  evaluationCriteria: [
    "Professional introduction",
    "Clear value proposition",
    "Respectful of homeowner's time"
  ]
}
```

### Step 3: Video Scripts with Questions
**Source:** https://docs.google.com/document/d/1FncgAFCeDzD0G0RsDK5XSg-IjWlcnS9QfNzPobwKVhs/edit

1. Extract each question from the document
2. In `/lib/data.ts`, find the "Sales Conversation Scripts & Practice" module
3. Replace the placeholder quiz questions with actual ones:

```javascript
quiz: [
  {
    question: "What is the first thing you should do when approaching a home?",
    options: [
      "Immediately start your sales pitch",
      "Introduce yourself and your company professionally",
      "Ask if they need roofing work",
      "Hand them a business card"
    ],
    correctAnswer: 1,
    explanation: "A professional introduction builds trust and sets the right tone for the conversation."
  },
  // Add more questions
]
```

### Step 4: Building Trust Guide (Deb's Content)
**Source:** PDF document about building trust

1. Extract key trust-building techniques
2. In `/lib/data.ts`, update the "Building Trust with Homeowners" module
3. Add specific trust-building scenarios to practice

### Step 5: Scorecard Implementation
**Source:** https://drive.google.com/file/d/1RXaJfPhHOIPvJFCI2FIey3WQOA_xgs-k/view

1. Download and review the scorecard PDF
2. In `/lib/data.ts`, update the `scorecard` object with actual criteria:

```javascript
criteria: [
  {
    item: "Uses homeowner's name during conversation",
    maxPoints: 10,
    description: "Demonstrates personal connection and respect"
  },
  // Add all actual scorecard items
]
```

### Step 6: Transcripts
1. For each training video transcript
2. Add to the `transcripts` object in `/lib/data.ts`
3. This enables searchable content and closed captions

## Integrating Components into Pages

### Update Training Videos Page (`/pages/training/videos.tsx`)
Add the Quiz component to show questions after video completion:

```tsx
import Quiz from '../../components/Quiz';

// In your component, after video player:
{showQuiz && module.quiz && (
  <Quiz
    questions={module.quiz}
    moduleTitle={module.title}
    onComplete={(score) => {
      // Save score to user progress
      console.log(`User scored ${score}%`);
    }}
  />
)}
```

### Update Results Page (`/pages/training/results.tsx`)
Integrate the Scorecard component for evaluations:

```tsx
import Scorecard from '../../components/Scorecard';
import { scorecard } from '../../lib/data';

// In your component:
<Scorecard
  categories={scorecard.categories}
  userName={user.name}
  scenarioName="Cold Call Practice"
  onSubmit={(scores, totalScore) => {
    // Save evaluation results
    console.log(`Total score: ${totalScore}%`);
  }}
/>
```

## Next Steps

1. **Access your Google Docs** and copy the actual content
2. **Paste content** into the designated sections in `/lib/data.ts`
3. **Format content** using markdown for better display
4. **Test each module** to ensure content displays correctly
5. **Create video files** or use placeholder videos for now
6. **Add real quiz questions** from your training materials
7. **Configure the scorecard** with actual evaluation criteria

## Testing Your Implementation

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Test each section:
   - Login as a user (alice@example.com)
   - Navigate to Training > Videos to see modules
   - Check SOPs section for your guides
   - Try the AI Training scenarios
   - Review the Results page with scorecard

## Important Notes

- The platform is now structured to accept your real content
- Components are built and ready to use
- You just need to paste in the actual training materials
- The system will handle scoring, progress tracking, and evaluations automatically

## Support

If you need help with:
- Formatting content for the platform
- Creating additional quiz questions
- Setting up practice scenarios
- Customizing the scorecard weights

Just provide the actual content from your Google Docs, and I can help format it properly for the platform.