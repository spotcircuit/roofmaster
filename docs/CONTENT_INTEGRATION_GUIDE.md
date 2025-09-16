# Content Integration Guide for RoofMaster 24-7 Training Platform

## Overview
This guide shows where to integrate the content from your Google Docs into the training platform.

## Document Mapping

### 1. Entry To Sales Document
**Google Doc URL:** https://docs.google.com/document/d/1gBpF0h7P9RxdYzQyEmLipqXfKma5T4i5rHgg8pF13yk/edit

**Integration Location:** `/lib/data.ts` - SOPs section
```typescript
// Add to the sops array in data.ts
{
  id: 'entry-to-sales',
  title: 'Entry to Sales Guide',
  category: 'Sales Process',
  content: `
    [PASTE CONTENT FROM GOOGLE DOC HERE]
    - Introduction to sales process
    - First contact best practices
    - Building initial rapport
    - Qualifying prospects
    - etc.
  `,
  lastUpdated: new Date().toISOString()
}
```

### 2. Training Plan for Outside Door-to-Door Sales Reps
**Google Doc URL:** https://docs.google.com/document/d/1Lai3AKf4Rt1NFLZ2xTrKVqTzZBFGLAdzlXOwG_Eh_ww/edit

**Integration Location:** `/lib/data.ts` - Training modules section
```typescript
// Add to the modules array in data.ts
{
  id: 'door-to-door-training',
  title: 'Door-to-Door Sales Training',
  description: 'Comprehensive training for outside sales representatives',
  duration: '4 hours',
  level: 'intermediate',
  topics: [
    'Approaching homes',
    'Initial pitch techniques',
    'Handling rejection',
    'Follow-up strategies'
  ],
  content: `
    [PASTE TRAINING PLAN CONTENT HERE]
  `,
  resources: []
}
```

### 3. Video Script with Questions
**Google Doc URL:** https://docs.google.com/document/d/1FncgAFCeDzD0G0RsDK5XSg-IjWlcnS9QfNzPobwKVhs/edit

**Integration Location:** `/lib/data.ts` - Video modules with quiz functionality
```typescript
// Update the modules array to include quiz questions
{
  id: 'video-training-1',
  title: '[Video Title from Doc]',
  videoUrl: '/videos/[video-file].mp4',
  transcript: `
    [PASTE VIDEO SCRIPT HERE]
  `,
  quiz: [
    {
      question: '[Question 1 from doc]',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 0
    },
    // Add more questions from the document
  ]
}
```

### 4. Building Trust with a Homeowner (Deb's Guide)
**Google Doc URL:** From PDF link

**Integration Location:** `/lib/data.ts` - Add as new training module
```typescript
{
  id: 'building-trust',
  title: 'Building Trust with Homeowners',
  description: 'Techniques for establishing credibility and trust',
  content: `
    [PASTE TRUST-BUILDING CONTENT HERE]
  `,
  level: 'advanced'
}
```

### 5. Scorecard 24-7 Restoration
**Google Drive URL:** https://drive.google.com/file/d/1RXaJfPhHOIPvJFCI2FIey3WQOA_xgs-k/view

**Integration Location:** Create new scorecard data structure
```typescript
// Add to data.ts
export const scorecard = {
  categories: [
    {
      name: 'Initial Contact',
      weight: 0.2,
      criteria: [
        // Add scoring criteria from the scorecard
      ]
    },
    // Add more categories
  ]
}
```

### 6. Transcripts
**Integration Location:** Attach to video modules in `/lib/data.ts`

## Implementation Steps

1. **Download/Copy Content**: Access each Google Doc and copy the content
2. **Format Content**: Convert to appropriate format (markdown/HTML)
3. **Update data.ts**: Paste content into the designated sections
4. **Add Quiz Logic**: For video questions, implement quiz functionality
5. **Create Scorecard Component**: Build UI for the evaluation scorecard
6. **Test Display**: Ensure all content renders properly

## File Structure Updates Needed

```
lib/
├── data.ts (UPDATE - Add all content here)
├── types.ts (UPDATE - Add interfaces for new content types)

components/
├── Quiz.tsx (CREATE - For video quiz questions)
├── Scorecard.tsx (CREATE - For evaluation scorecard)

pages/training/
├── videos.tsx (UPDATE - Add transcript display)
├── sops.tsx (UPDATE - Display new SOP content)
├── results.tsx (UPDATE - Integrate scorecard)
```

## Content Placeholders

Since the Google Docs are private, you'll need to:
1. Open each document
2. Copy the content
3. Paste it into the designated sections in `/lib/data.ts`
4. Format as needed for the platform

## Next Steps
1. Access your Google Docs
2. Copy content into this codebase following this guide
3. Test the integration
4. Adjust styling/formatting as needed