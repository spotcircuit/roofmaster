// Mock user data
export const users = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "user" as const },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "admin" as const },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user" as const },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "user" as const }
];

// Training modules data - Updated with customer's training content
export const trainingModules = [
  {
    id: 1,
    title: "Entry to Sales Fundamentals",
    description: "Complete guide for new sales representatives entering the field.",
    videoUrl: "/videos/entry-to-sales.mp4",
    duration: "2 hours",
    level: "beginner",
    topics: [
      "Introduction to RoofMaster sales process",
      "First contact best practices",
      "Building initial rapport",
      "Qualifying prospects"
    ],
    transcript: "[TO BE ADDED: Paste transcript from Entry to Sales Google Doc]",
    resources: [
      { type: "document", title: "Entry to Sales Guide", url: "https://docs.google.com/document/d/1gBpF0h7P9RxdYzQyEmLipqXfKma5T4i5rHgg8pF13yk/edit" }
    ]
  },
  {
    id: 2,
    title: "Door-to-Door Sales Mastery",
    description: "Comprehensive training for outside door-to-door sales representatives.",
    videoUrl: "/videos/door-to-door.mp4",
    duration: "4 hours",
    level: "intermediate",
    topics: [
      "Approaching homes effectively",
      "Initial pitch techniques",
      "Handling rejection professionally",
      "Follow-up strategies",
      "Territory management"
    ],
    transcript: "[TO BE ADDED: Paste content from Training Plan for Outside Door-to-Door Sales Reps]",
    resources: [
      { type: "document", title: "Door-to-Door Training Plan", url: "https://docs.google.com/document/d/1Lai3AKf4Rt1NFLZ2xTrKVqTzZBFGLAdzlXOwG_Eh_ww/edit" }
    ]
  },
  {
    id: 3,
    title: "Building Trust with Homeowners",
    description: "Advanced techniques for establishing credibility and trust with potential customers.",
    videoUrl: "/videos/building-trust.mp4",
    duration: "3 hours",
    level: "advanced",
    topics: [
      "Understanding homeowner psychology",
      "Active listening techniques",
      "Demonstrating expertise",
      "Creating emotional connections",
      "Trust-building language patterns"
    ],
    transcript: "[TO BE ADDED: Paste content from Deb's Building Trust guide]",
    resources: []
  },
  {
    id: 4,
    title: "Sales Conversation Scripts & Practice",
    description: "Interactive training with real-world scripts and practice scenarios.",
    videoUrl: "/videos/scripts-practice.mp4",
    duration: "2.5 hours",
    level: "intermediate",
    transcript: "[TO BE ADDED: Paste video script content]",
    quiz: [
      {
        question: "[TO BE ADDED: Question 1 from video script doc]",
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 0,
        explanation: "[Explanation for correct answer]"
      }
    ],
    resources: [
      { type: "document", title: "Video Scripts with Questions", url: "https://docs.google.com/document/d/1FncgAFCeDzD0G0RsDK5XSg-IjWlcnS9QfNzPobwKVhs/edit" }
    ]
  },
  {
    id: 5,
    title: "Handling Objections",
    description: "How to effectively address and overcome common customer objections.",
    videoUrl: "/videos/objections.mp4",
    duration: "2 hours",
    level: "intermediate",
    transcript: "[TO BE ADDED: Paste transcript content if available]"
  },
  {
    id: 6,
    title: "Closing Techniques",
    description: "Master various methods to successfully close deals.",
    videoUrl: "/videos/closing.mp4",
    duration: "2 hours",
    level: "advanced",
    transcript: "[TO BE ADDED: Paste transcript content if available]"
  }
];

// SOP (Standard Operating Procedures) data - Updated with customer's content
export const sops = [
  {
    id: 100,
    title: "Entry to Sales - Complete Guide",
    category: "Sales Process",
    content: `[TO BE ADDED: Paste complete Entry to Sales content from Google Doc]

    # Entry to Sales Guide

    ## Introduction
    [Content from Google Doc]

    ## First Contact Best Practices
    [Content from Google Doc]

    ## Building Initial Rapport
    [Content from Google Doc]

    ## Qualifying Prospects
    [Content from Google Doc]`,
    lastUpdated: new Date().toISOString(),
    documentUrl: "https://docs.google.com/document/d/1gBpF0h7P9RxdYzQyEmLipqXfKma5T4i5rHgg8pF13yk/edit"
  },
  { 
    id: 101, 
    title: "Deal Closing SOP", 
    content: `# Closing the Deal

1. **Confirm Client Needs**
   - Review all requirements discussed
   - Ensure product/service matches their needs
   - Address any remaining concerns

2. **Present Final Offer**
   - Clearly outline pricing and terms
   - Highlight value proposition
   - Explain implementation timeline

3. **Handle Final Objections**
   - Listen actively to concerns
   - Provide clear, concise responses
   - Offer appropriate concessions if necessary

4. **Ask for the Business**
   - Use direct closing question
   - Maintain positive, confident demeanor
   - Be comfortable with silence after asking

5. **Confirm Next Steps**
   - Review action items
   - Set clear timeline
   - Schedule follow-up meeting`
  },
  { 
    id: 102, 
    title: "Lead Qualification SOP", 
    content: `## Qualifying Leads

### Initial Assessment

* Define the target customer profile
* Evaluate budget compatibility
* Assess decision-making authority
* Determine timeline for purchase

### BANT Framework

1. **Budget**
   - Does the prospect have budget allocated?
   - What is their typical spending for similar solutions?
   - Who controls the budget for this purchase?

2. **Authority**
   - Who makes the final purchasing decision?
   - Are we speaking with the decision-maker?
   - Who else influences the decision?

3. **Need**
   - What problem are they trying to solve?
   - How urgent is this problem?
   - What happens if they don't solve it?

4. **Timeline**
   - When do they need a solution implemented?
   - Are there any external deadlines driving this timeline?
   - What is their purchasing process timeline?`
  },
  { 
    id: 103, 
    title: "Customer Onboarding SOP", 
    content: `# Customer Onboarding Process

## Initial Welcome (Day 1)

* Send welcome email with login credentials
* Schedule kickoff call
* Provide access to knowledge base

## Kickoff Meeting (Week 1)

1. Introduction to account team
2. Review of purchased products/services
3. Establish goals and success metrics
4. Create implementation timeline

## Training Phase (Weeks 2-3)

* Conduct product training sessions
* Set up user accounts and permissions
* Configure custom settings
* Provide documentation and resources

## Follow-up (Week 4)

* Review implementation progress
* Address any issues or questions
* Collect initial feedback
* Schedule regular check-in calls`
  }
];

// Mock AI training scenarios
export const scenarios = [
  { 
    id: 301, 
    title: "Price Objection Scenario", 
    script: [
      { from: "AI", text: "Hello, I'm interested in your product, but it seems expensive compared to other options I've seen." }
    ] 
  },
  { 
    id: 302, 
    title: "Competitor Comparison Scenario", 
    script: [
      { from: "AI", text: "Your competitor is offering similar features at a lower price point. Why should I choose your solution?" }
    ] 
  },
  { 
    id: 303, 
    title: "Need More Time Scenario", 
    script: [
      { from: "AI", text: "This looks interesting, but I need to think about it more. Can we revisit this next quarter?" }
    ] 
  }
];

// Mock evaluation results
export const evaluations = [
  { 
    userId: 1, 
    scenarioId: 301, 
    scenario: "Price Objection Scenario", 
    score: 85, 
    feedback: "Good handling of greeting and listening, but needs improvement in addressing price concerns and articulating value proposition." 
  },
  { 
    userId: 1, 
    scenarioId: 302, 
    scenario: "Competitor Comparison Scenario", 
    score: 92, 
    feedback: "Excellent job highlighting unique selling points and differentiating from competitors. Clear and confident delivery." 
  },
  { 
    userId: 3, 
    scenarioId: 301, 
    scenario: "Price Objection Scenario", 
    score: 78, 
    feedback: "Needs to improve confidence when discussing pricing. Good product knowledge but could better articulate ROI."
  }
];

// 24-7 Restoration Scorecard Structure
export const scorecard = {
  title: "24-7 Restoration Sales Performance Scorecard",
  documentUrl: "https://drive.google.com/file/d/1RXaJfPhHOIPvJFCI2FIey3WQOA_xgs-k/view",
  categories: [
    {
      name: "Initial Contact",
      weight: 0.25,
      criteria: [
        {
          item: "Professional greeting and introduction",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        },
        {
          item: "Establishes rapport and trust",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        }
      ]
    },
    {
      name: "Needs Assessment",
      weight: 0.25,
      criteria: [
        {
          item: "Asks relevant qualifying questions",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        },
        {
          item: "Actively listens to customer concerns",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        }
      ]
    },
    {
      name: "Solution Presentation",
      weight: 0.25,
      criteria: [
        {
          item: "Clearly explains services and benefits",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        },
        {
          item: "Addresses specific customer needs",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        }
      ]
    },
    {
      name: "Closing",
      weight: 0.25,
      criteria: [
        {
          item: "Handles objections effectively",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        },
        {
          item: "Asks for the business confidently",
          maxPoints: 10,
          description: "[TO BE ADDED: From scorecard PDF]"
        }
      ]
    }
  ],
  calculateScore: function(responses) {
    // Function to calculate total score based on category weights
    let totalScore = 0;
    this.categories.forEach((category, index) => {
      const categoryScore = responses[index].reduce((sum, score) => sum + score, 0);
      const categoryMax = category.criteria.length * 10;
      const categoryPercentage = (categoryScore / categoryMax) * category.weight;
      totalScore += categoryPercentage;
    });
    return Math.round(totalScore * 100);
  }
};

// Training Video Transcripts Reference
export const transcripts = {
  documentUrl: "https://docs.google.com/document/d/[TRANSCRIPT_DOC_ID]/edit",
  videos: [
    {
      moduleId: 1,
      title: "Entry to Sales Fundamentals",
      transcript: "[TO BE ADDED: Paste transcript content from Transcripts document]"
    },
    {
      moduleId: 2,
      title: "Door-to-Door Sales Mastery",
      transcript: "[TO BE ADDED: Paste transcript content from Transcripts document]"
    },
    {
      moduleId: 3,
      title: "Building Trust with Homeowners",
      transcript: "[TO BE ADDED: Paste transcript content from Transcripts document]"
    }
  ]
};