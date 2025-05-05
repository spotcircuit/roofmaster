// Mock user data
export const users = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "user" as const },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "admin" as const },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user" as const },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "user" as const }
];

// Mock training modules data
export const trainingModules = [
  { 
    id: 1, 
    title: "Introduction to Sales", 
    description: "Learn the basics of the sales process and customer engagement.", 
    videoUrl: "/videos/intro.mp4" 
  },
  { 
    id: 2, 
    title: "Handling Objections", 
    description: "How to effectively address and overcome common customer objections.", 
    videoUrl: "/videos/objections.mp4" 
  },
  { 
    id: 3, 
    title: "Closing Techniques", 
    description: "Master various methods to successfully close deals.", 
    videoUrl: "/videos/closing.mp4" 
  },
  { 
    id: 4, 
    title: "Building Relationships", 
    description: "Strategies for developing long-term customer relationships.", 
    videoUrl: "/videos/relationships.mp4" 
  }
];

// Mock SOP (Standard Operating Procedures) data
export const sops = [
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