// 24-7 Restoration & Roofing Training Platform Data
// This file contains all the integrated training content from the customer's documents

// Mock user data
export const users = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "user" as const },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "admin" as const },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user" as const },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "user" as const }
];

// Training modules with real content
export const trainingModules = [
  {
    id: 1,
    title: "Entry to Sales Fundamentals",
    description: "Complete guide for new sales representatives entering the field at 24-7 Restoration & Roofing.",
    videoUrl: "/videos/entry-to-sales.mp4",
    duration: "2 hours",
    level: "beginner",
    topics: [
      "About 24-7 Restoration & Roofing",
      "Buyer's Psychology & Sales Funnel",
      "Cost of Inaction",
      "5 Stages of the Sale",
      "Insurance Basics"
    ],
    content: `
# Entry to Sales - 24-7 Restoration & Roofing

## About Our Company
We are not just a roofing company; we are your expert partner in navigating the insurance and restoration process.

- **Established and Trustworthy**: Family-owned business, established in 2010
- **Expertise in Insurance Claims**: 15 years of restoration experience, 10 as insurance-preferred vendor
- **Quality Workmanship**: 10-year labor warranty standard (up to 20 years available)
- **Comprehensive Support**: Responsive local team, hold last check until satisfied

## The 5 Stages of the Sale

### Stage 1: Initial Contact & Drone Inspection
- **Goal**: Confirm if home has storm damage
- **Key Message**: "We're hoping you don't have damage"
- **Approach**: Casual, helpful, provide context about neighborhood activity

### Stage 2: Drone Review to Physical Inspection
- **Goal**: Explain need for physical inspection
- **Key**: Your urgency must match your message
- **Fractured Matting**: Explain this critical concept

### Stage 3: On-Roof Inspection & Sit-Down
- **Goal**: Justify value, build cooperation, get agreement on costs
- **Leverage Point**: Get all agreements before claim is filed
- **Differentiators**: 15 years experience, supplement team

### Stage 4: Post-Claim Filing
- **Goal**: Be the expert partner
- **Critical**: Must be present for adjuster inspection
- **Follow-up**: Clear communication via text

### Stage 5: Final Sit-Down & Contract
- **Goal**: Close the deal
- **Tools**: Contract, computer, pen, samples
- **Technique**: Start with scope review, use contract back for credits
    `,
    resources: [
      {
        type: "document",
        title: "Complete Entry to Sales Training",
        url: "/docs/Entry To Sales.txt"
      }
    ]
  },
  {
    id: 2,
    title: "Door-to-Door Sales Mastery",
    description: "Master training manual for outside door-to-door sales representatives - The journey to becoming an Apex Sales Pro.",
    videoUrl: "/videos/door-to-door.mp4",
    duration: "12 weeks program",
    level: "comprehensive",
    topics: [
      "The 80/20 Rule in Storm Restoration",
      "Canvassing Basics - The Door Opener",
      "Advanced Canvassing & Rapport Building",
      "Introduction to Sales Work",
      "Insurance Mastery",
      "Apex Sales Pro Concepts"
    ],
    content: `
# Door-to-Door Sales Master Training Manual

## Your Journey to Mastery
This guide encapsulates seven years of invaluable experience, meticulously "jammed into one book" to significantly lower your learning curve.

## The 80/20 Rule
- **Customer Response**: 10% say no, 10% say yes, 80% is up to you
- **Job Profitability**: Jobs with 20% lower profit cause 80% more headaches

## Phase 1: Canvassing Basics (Weeks 1-2)
### The 30-Second Hook
"Hi, I'm [Name] with 24-7 Restoration. We were flying our drone at your neighbor's house and noticed significant hail damage. Since we're already here helping the community, would you mind if we took a quick look at your roof too? It's completely free and no obligation."

### Key Body Language
- "Love Eyes": Warm, friendly eye contact
- Hand on Heart: Gesture of sincerity
- Subtle Lean-in: Shows active listening
- Transfer Positive Emotion: Enthusiasm is contagious

## Phase 2: Advanced Rapport Building (Weeks 3-5)
### Reading Homeowner Cues
- **Positive**: Open arms, leaning in, eye contact, questions
- **Negative**: Crossed arms, stepping back, avoiding eye contact

### Common Objections & Responses
- "Not interested" → "We're not selling, just offering a free check-up"
- "Have a roofer" → "Great! Did they provide photos of the damage?"
- "Too busy" → "This takes 5 minutes, or we can schedule later"

## Phase 3: Sales Introduction (Weeks 6-8)
### Damage Identification
- Fractured Matting: Internal shingle damage from hail
- Granule Loss: Protective coating displacement
- Wind Damage: Lifted, creased, torn shingles

## Phase 4: Insurance Mastery (Weeks 9-10)
### Key Principle: "If It's Not Excluded, It's Included"
- ACV vs RCV understanding
- Deductible offset strategies (legal methods)
- Supplement process mastery

## Phase 5: Apex Sales Pro (Weeks 11-12)
### Psychological Principles
- Reciprocity, Scarcity, Authority
- Consistency, Liking, Consensus
- Strategic communication and timing
    `,
    resources: [
      {
        type: "document",
        title: "Complete Door-to-Door Training Plan",
        url: "/docs/Training Plan for Outside Door-to-Door Sales Reps (brain).txt"
      }
    ]
  },
  {
    id: 3,
    title: "Building Trust with Homeowners",
    description: "Advanced techniques for establishing credibility and trust with potential customers, featuring the 'Deb' scenario.",
    videoUrl: "/videos/building-trust.mp4",
    duration: "1.5 hours",
    level: "advanced",
    topics: [
      "Building Rapport with Reluctant Homeowners",
      "Non-roof Related Conversation Starters",
      "Handling Trust Objections",
      "10-Step Trust Building Process"
    ],
    content: `
# Building Trust with a Homeowner Who Needs Guidance

## The "Deb" Scenario
Practice building rapport and trust with a reluctant homeowner who suspects a roof issue but feels no urgency.

## 10 Steps to Win Trust

1. **Start with Warm Approach**
   - Positive demeanor and genuine smile
   - Begin with non-roof topic (garden, pet, community)

2. **Build Personal Connection**
   - Engage in lighthearted conversation
   - Show genuine interest in hobbies/family

3. **Natural Transition to Roof**
   - "By the way, I noticed your roof might have some wear..."

4. **Acknowledge Lack of Urgency**
   - "I totally get it doesn't feel urgent right now"

5. **Present Benefits of Early Action**
   - Save money and stress down the road
   - Simple inspection for peace of mind

6. **Highlight Trustworthiness**
   - Share experience with similar situations
   - Offer examples of satisfied homeowners

7. **No-Pressure Inspection Offer**
   - Free inspection for clarity
   - Position as friendly gesture

8. **Provide Reassurance**
   - Explain how you'll handle entire process
   - Offer convenient follow-up times

9. **Close on Friendly Note**
   - Thank for time
   - Leave contact information

10. **Tactful Follow-up**
    - Check back in 1-2 weeks
    - Reference rapport built
    `,
    resources: [
      {
        type: "document",
        title: "Building Trust Guide (Deb Scenario)",
        url: "/docs/Deb_ Building Trust with a Homeowner Who Needs Guidance.pdf"
      }
    ]
  },
  {
    id: 4,
    title: "The Apex Sales Pro Mindset",
    description: "Video training on developing the mindset of a top performer in storm restoration sales.",
    videoUrl: "/videos/apex-mindset.mp4",
    duration: "30 minutes",
    level: "all",
    topics: [
      "Mastery as a Journey",
      "Redefining Hard Work",
      "Finding Your Why",
      "Coachability and Humility"
    ],
    content: `
# The Apex Sales Pro Mindset

## Core Concepts

### Mastery = Money
Mastery isn't a destination; it's a journey of habit-building. Like going to the gym or learning an instrument, you build discipline one rep at a time.

### Your Investment
- Not 4 years and tens of thousands for a degree
- But hard, focused effort for sustained period
- Six-figure income potential in fraction of the time

### Finding Your "Why"
What does financial freedom mean for YOU personally?
- What gets you out of bed?
- What could six figures do for your family?
- Your why is your fuel

### Coachability is a Superpower
- Never too proud to ask for help
- In a slump? Ask your mentor
- Shows humility and commitment to winning

## Remember
This is the foundation of everything we do. It's the mindset of an Apex Sales Pro.
    `,
    hasQuiz: true
  }
];

// Quiz questions extracted from Entry to Sales document
export const quizQuestions = {
  entryToSales: [
    {
      question: "What is the primary purpose of using underlayment, ice and water barriers, and flashings in our roofing system?",
      options: [
        "To make the roof look better",
        "To speed up the installation process",
        "To give the most waterproofed, under-roof system",
        "To lower the material cost"
      ],
      correctAnswer: 2,
      explanation: "24-7 Restoration uses these materials strategically to create the most waterproofed system possible."
    },
    {
      question: "What is our standard labor warranty?",
      options: ["5 years", "10 years", "15 years", "20 years"],
      correctAnswer: 1,
      explanation: "Our standard labor warranty is 10 years, with options for up to 20 years."
    },
    {
      question: "What is 'fractured matting'?",
      options: [
        "Shingle bruising from light hail",
        "Cracks in the felt underneath the shingle from a hard hail hit",
        "An old shingle deteriorating from sun exposure",
        "A type of insulation"
      ],
      correctAnswer: 1,
      explanation: "Fractured matting occurs when hail hits a shingle so hard it cracks the felt underneath, creating vulnerability."
    },
    {
      question: "When a customer says they already have a roofer, what is the first question you should ask?",
      options: [
        "Who is their company?",
        "What did they quote you?",
        "Are they a family member or a friend?",
        "Did they find any damage?"
      ],
      correctAnswer: 2,
      explanation: "This question helps determine the relationship and opens the door for further qualifying questions."
    },
    {
      question: "What is the average starting cost of a roof leak?",
      options: ["$100", "$200", "$300", "$500"],
      correctAnswer: 2,
      explanation: "The average cost of a leak starts at $300, which adds to the homeowner's out-of-pocket costs if they wait."
    }
  ],
  apexMindset: [
    {
      question: "According to the training, what analogy is used to explain mastery in sales?",
      options: [
        "Running a marathon",
        "Going to the gym or learning an instrument",
        "Climbing a mountain",
        "Building a house"
      ],
      correctAnswer: 1,
      explanation: "The training uses gym and instrument practice as analogies for building discipline and mastery over time."
    },
    {
      question: "What should you do when you're in a sales slump according to the Apex mindset?",
      options: [
        "Work harder on your own",
        "Take a break",
        "Walk up to your mentor and ask for help",
        "Switch territories"
      ],
      correctAnswer: 2,
      explanation: "Asking for help shows humility and commitment to winning - it's described as a 'superpower'."
    }
  ]
};

// SOP Documents with real content
export const sops = [
  {
    id: 1,
    title: "Entry to Sales - Complete Guide",
    category: "Sales Process",
    content: `
# Comprehensive Sales Training & Assessment Package

## About Our Company: 24-7 Restoration & Roofing

We are not just a roofing company; we are your expert partner in navigating the insurance and restoration process.

### Core Values
- **Established and Trustworthy**: Family-owned business since 2010
- **Expertise in Insurance Claims**: 15 years restoration experience, 10 as insurance-preferred vendor
- **Quality Workmanship**: 10-year labor warranty standard (up to 20 years)
- **Comprehensive Support**: Responsive local team

## Buyer's Psychology & The Sales Funnel

### Low-Risk Entry
The drone inspection is our low-risk entry point. Customers agree because it's non-invasive and low commitment.

### Creating the Need
Physical inspection confirms damage and creates need in customer's mind.

### Cost vs. Need
Once damage is confirmed, shift focus to how our process meets their need at lowest cost via insurance.

### Financial Risk Reduction
Offer best-case and worst-case estimates before claim filing to build trust.

## The Cost of Inaction: Why It's Urgent

### Insurance Risks
- Companies deny claims to lower payouts
- Policies can change to less favorable terms

### Financial Risks
- Rising material costs
- Deductible increases (inflation or 2% policy change)
- ACV policy conversions
- Minimum $300 leak cost

### Property Damage Risks
- Unaddressed damage leads to leaks and mold
- Affects neighborhood insurance rates
- New roof can earn discounts

## The 5 Stages of the Sale

[Full detailed stages content from the document...]
    `,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    title: "Door-to-Door Canvassing Procedures",
    category: "Lead Generation",
    content: `
# Door-to-Door Canvassing Standard Operating Procedures

## Phase 1: Canvassing Basics (Weeks 1-2)

### Daily Goals
- Minimum 100 doors knocked
- 20 conversations
- 2-4 qualified appointments

### The 30-Second Hook Script
"Hi, I'm [Your Name] with 24-7 Restoration & Roofing. We were just flying our drone down the street at your neighbor's house at [Address/House Color] and noticed some significant hail damage. Because we're already here and helping others in the community, would you mind if we just took a quick look at your roof with the drone too, to see if you have similar issues? It's completely free and no obligation."

### Body Language Checklist
- [ ] Clean appearance and vehicle
- [ ] Warm "Love Eyes" contact
- [ ] Open posture
- [ ] Slight forward lean when listening
- [ ] Hand on heart for sincerity
- [ ] Genuine smile

### CRM Entry Requirements
- Name, address, phone
- Outcome of interaction
- Best callback time
- Property observations
- Initial objections noted
    `,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    title: "Insurance Claim Process",
    category: "Insurance",
    content: `
# Insurance Claim Process SOP

## Key Principle: "If It's Not Excluded, It's Included"

### Understanding Insurance Terms
- **ACV**: Actual Cash Value (depreciated)
- **RCV**: Replacement Cost Value (full replacement)
- **Recoverable Depreciation**: Paid after work completion
- **Non-Recoverable**: Not paid regardless

### Deductible Management (Legal Methods)
**Critical**: Never waive deductibles - it's illegal in Texas

#### Ethical Offset Strategy
Identify all covered collateral damage:
- Gutters (dents, bent fascia)
- Fences (dings, broken slats)
- Window screens (tears, holes)
- A/C fins (dents)
- Sheds (roof/siding damage)
- Patio covers
- Mailboxes
- Garage doors
- Paint/Stain damage

If collateral repairs exceed deductible, homeowner has minimal out-of-pocket for roof.

### Common Exclusions to Check
- ACV Only policies
- Cosmetic damage endorsements
- Marred metal exclusions
- Building code endorsements

### Time Limits
- 1 year to file claim
- 2 years to sue if needed
    `,
    lastUpdated: new Date().toISOString()
  }
];

// Practice scenarios based on training content
export const practiceScenarios = [
  {
    id: 1,
    title: "The Deb Scenario - Building Trust",
    difficulty: "advanced",
    description: "Practice with a homeowner who suspects roof issues but feels no urgency and needs to trust you.",
    script: [
      {
        from: "AI",
        text: "Oh, another roofing person? I've had three companies knock this week. I'm really not interested in dealing with this right now."
      }
    ],
    evaluationCriteria: [
      "Warm, friendly approach",
      "Non-roof conversation starter",
      "Building personal connection",
      "Acknowledging lack of urgency",
      "No-pressure inspection offer"
    ],
    tips: [
      "Start with something other than the roof",
      "Find common ground (garden, pets, neighborhood)",
      "Be genuinely interested in them as a person",
      "Position yourself as helpful, not salesy"
    ]
  },
  {
    id: 2,
    title: "Initial Door Approach - Fresh Storm",
    difficulty: "beginner",
    description: "First contact with a homeowner after recent storm activity in the area.",
    script: [
      {
        from: "AI",
        text: "Yes? What can I help you with?"
      }
    ],
    evaluationCriteria: [
      "Professional introduction",
      "Mention of neighborhood activity",
      "Free inspection offer",
      "Non-threatening approach",
      "Clear value proposition"
    ],
    tips: [
      "Use the 30-second hook",
      "Reference specific neighbor addresses",
      "Emphasize 'no obligation'",
      "Match their energy level"
    ]
  },
  {
    id: 3,
    title: "Handling the 'I Have a Guy' Objection",
    difficulty: "intermediate",
    description: "Homeowner claims they already have a roofer they work with.",
    script: [
      {
        from: "AI",
        text: "Thanks, but we already have a roofer we've used for years. We're all set."
      }
    ],
    evaluationCriteria: [
      "Respectful acknowledgment",
      "Qualifying questions",
      "Differentiation without criticism",
      "Second opinion value",
      "Graceful exit if needed"
    ],
    tips: [
      "Ask if they're family/friend",
      "Ask about photos/documentation",
      "Offer value of storm damage expertise",
      "Don't badmouth competition"
    ]
  },
  {
    id: 4,
    title: "Insurance Concerns - Rate Increases",
    difficulty: "intermediate",
    description: "Homeowner worried about insurance rates going up if they file a claim.",
    script: [
      {
        from: "AI",
        text: "I don't want to file a claim. Won't my insurance rates go up? I can't afford higher premiums."
      }
    ],
    evaluationCriteria: [
      "Accurate insurance information",
      "Act of God explanation",
      "Area-wide vs individual rates",
      "Risk of waiting discussion",
      "Empathy and understanding"
    ],
    tips: [
      "Explain Act of God claims",
      "Discuss area-wide impacts",
      "Mention inspection is free and informational",
      "Focus on getting information first"
    ]
  },
  {
    id: 5,
    title: "The Skeptical Analytical Buyer",
    difficulty: "advanced",
    description: "Detail-oriented homeowner who wants data and distrusts sales tactics.",
    script: [
      {
        from: "AI",
        text: "I need to see detailed documentation and multiple bids. I don't make decisions without thorough research. And frankly, I don't trust contractors."
      }
    ],
    evaluationCriteria: [
      "Data-driven approach",
      "Transparency emphasis",
      "Documentation offers",
      "Authority building",
      "Patience and professionalism"
    ],
    tips: [
      "Lead with expertise and credentials",
      "Offer detailed inspection reports",
      "Provide references and testimonials",
      "Use technical knowledge appropriately"
    ]
  }
];

// Scorecard structure from the training
export const performanceScorecard = {
  title: "24-7 Restoration Sales Performance Scorecard",
  categories: [
    {
      name: "Initial Contact & Approach",
      weight: 0.20,
      criteria: [
        {
          item: "Professional appearance and vehicle",
          maxPoints: 10,
          description: "Clean, branded attire, well-maintained vehicle"
        },
        {
          item: "30-second hook delivery",
          maxPoints: 10,
          description: "Clear, confident delivery of initial pitch"
        },
        {
          item: "Body language and enthusiasm",
          maxPoints: 10,
          description: "Love eyes, open posture, genuine smile"
        }
      ]
    },
    {
      name: "Rapport Building",
      weight: 0.25,
      criteria: [
        {
          item: "Personal connection establishment",
          maxPoints: 10,
          description: "Non-roof conversation, finding common ground"
        },
        {
          item: "Active listening demonstration",
          maxPoints: 10,
          description: "Reflecting feelings, validating concerns"
        },
        {
          item: "Trust indicators",
          maxPoints: 10,
          description: "Hand on heart, empathy, genuine interest"
        }
      ]
    },
    {
      name: "Technical Knowledge",
      weight: 0.25,
      criteria: [
        {
          item: "Damage identification accuracy",
          maxPoints: 10,
          description: "Correctly identifies and explains damage types"
        },
        {
          item: "Insurance process understanding",
          maxPoints: 10,
          description: "ACV/RCV, deductibles, claims process"
        },
        {
          item: "Company differentiators",
          maxPoints: 10,
          description: "Articulates 24-7's unique value proposition"
        }
      ]
    },
    {
      name: "Objection Handling",
      weight: 0.20,
      criteria: [
        {
          item: "Feel, Felt, Found technique",
          maxPoints: 10,
          description: "Empathy, validation, solution approach"
        },
        {
          item: "Clarifying questions usage",
          maxPoints: 10,
          description: "Understanding root of objections"
        },
        {
          item: "Maintaining rapport during objections",
          maxPoints: 10,
          description: "Stays positive and professional"
        }
      ]
    },
    {
      name: "Closing & Next Steps",
      weight: 0.10,
      criteria: [
        {
          item: "Soft close techniques",
          maxPoints: 10,
          description: "Non-pressure guidance to decision"
        },
        {
          item: "Clear next steps communication",
          maxPoints: 10,
          description: "Inspection scheduling, follow-up plans"
        },
        {
          item: "CRM documentation",
          maxPoints: 10,
          description: "Complete notes and follow-up tasks"
        }
      ]
    }
  ],
  calculateScore: function(responses: number[][]) {
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

// Evaluation results tracking
export const evaluations = [
  {
    userId: 1,
    scenarioId: 1,
    scenario: "The Deb Scenario - Building Trust",
    score: 85,
    feedback: "Good rapport building and use of personal connection. Could improve on handling trust objections more smoothly.",
    date: new Date().toISOString()
  }
];

// Glossary of terms from the training
export const glossary = {
  "ACV": "Actual Cash Value - Depreciated value of property at time of loss",
  "RCV": "Replacement Cost Value - Cost to replace with new material of like kind and quality",
  "Fractured Matting": "Internal breakage of fiberglass mat within a shingle from hail impact",
  "Apex Sales Pro": "Highest level of sales mastery at 24-7 Restoration",
  "Jones Effect": "Social proof where people are influenced by neighbors' actions",
  "Supplement": "Additional funds requested from insurance for missed/undervalued items",
  "Collateral Damage": "Storm damage to items beyond the roof (gutters, fences, etc.)",
  "O&P": "Overhead & Profit - Additional allowance for complex projects",
  "TDI": "Texas Department of Insurance - Regulatory body",
  "Tie-Down Question": "Question designed to elicit agreement and reinforce commitment"
};

export default {
  users,
  trainingModules,
  quizQuestions,
  sops,
  practiceScenarios,
  performanceScorecard,
  evaluations,
  glossary
};