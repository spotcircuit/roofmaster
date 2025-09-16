// 24-7 Restoration Apex Sales Pro Journey - Game Data
// Modern gamified training platform data structure

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainee' | 'apex' | 'manager' | 'admin';
  startDate: Date;
  currentPhase: number;
  currentWeek: number;
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  stats: UserStats;
  personalWhy: string;
  mentor?: string;
}

export interface UserStats {
  doorsKnocked: number;
  conversationsHad: number;
  appointmentsSet: number;
  inspectionsCompleted: number;
  dealsCloned: number;
  totalCommission: number;
  conversionRate: number;
  weeklyGoalsHit: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Phase {
  id: number;
  name: string;
  title: string;
  weeks: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  modules: Module[];
  milestones: Milestone[];
  weeklyGoals: WeeklyGoal[];
}

export interface Module {
  id: string;
  title: string;
  type: 'lesson' | 'practice' | 'simulation' | 'quiz' | 'field';
  duration: string;
  xpReward: number;
  completed: boolean;
  score?: number;
  content?: any;
}

export interface Milestone {
  id: string;
  title: string;
  requirement: string;
  progress: number;
  target: number;
  reward: string;
}

export interface WeeklyGoal {
  week: number;
  goals: {
    doors: number;
    conversations: number;
    appointments: number;
    practices: number;
  };
}

// The 5-Phase Journey
export const apexJourney: Phase[] = [
  {
    id: 1,
    name: "door-opener",
    title: "The Door Opener",
    weeks: "Weeks 1-2",
    description: "Master the fundamentals of door-to-door engagement and first impressions",
    icon: "🚪",
    color: "from-blue-400 to-blue-600",
    unlocked: true,
    modules: [
      {
        id: "do-1",
        title: "The 30-Second Hook",
        type: "lesson",
        duration: "20 min",
        xpReward: 100,
        completed: false
      },
      {
        id: "do-2",
        title: "Body Language Mastery",
        type: "practice",
        duration: "15 min",
        xpReward: 150,
        completed: false
      },
      {
        id: "do-3",
        title: "Virtual Neighborhood",
        type: "simulation",
        duration: "30 min",
        xpReward: 300,
        completed: false
      },
      {
        id: "do-4",
        title: "First Week Field Challenge",
        type: "field",
        duration: "5 days",
        xpReward: 500,
        completed: false
      }
    ],
    milestones: [
      {
        id: "m1-1",
        title: "First 100 Doors",
        requirement: "Knock 100 doors",
        progress: 0,
        target: 100,
        reward: "Badge: Door Warrior"
      },
      {
        id: "m1-2",
        title: "Conversation Starter",
        requirement: "Have 20 full conversations",
        progress: 0,
        target: 20,
        reward: "Unlock: Advanced Scripts"
      }
    ],
    weeklyGoals: [
      {
        week: 1,
        goals: {
          doors: 300,
          conversations: 60,
          appointments: 3,
          practices: 5
        }
      },
      {
        week: 2,
        goals: {
          doors: 400,
          conversations: 80,
          appointments: 4,
          practices: 5
        }
      }
    ]
  },
  {
    id: 2,
    name: "rapport-builder",
    title: "The Rapport Builder",
    weeks: "Weeks 3-5",
    description: "Advanced techniques for building instant trust and handling objections",
    icon: "🤝",
    color: "from-purple-400 to-purple-600",
    unlocked: false,
    modules: [
      {
        id: "rb-1",
        title: "The Deb Scenario",
        type: "simulation",
        duration: "45 min",
        xpReward: 400,
        completed: false
      },
      {
        id: "rb-2",
        title: "Reading Homeowner Cues",
        type: "lesson",
        duration: "25 min",
        xpReward: 200,
        completed: false
      },
      {
        id: "rb-3",
        title: "Objection Jujitsu",
        type: "practice",
        duration: "30 min",
        xpReward: 250,
        completed: false
      }
    ],
    milestones: [
      {
        id: "m2-1",
        title: "Trust Master",
        requirement: "Complete 10 trust-building scenarios",
        progress: 0,
        target: 10,
        reward: "Badge: Trust Builder"
      }
    ],
    weeklyGoals: [
      {
        week: 3,
        goals: {
          doors: 400,
          conversations: 100,
          appointments: 6,
          practices: 10
        }
      }
    ]
  },
  {
    id: 3,
    name: "inspection-expert",
    title: "The Inspection Expert",
    weeks: "Weeks 6-8",
    description: "Master damage identification, drone operations, and technical expertise",
    icon: "🔍",
    color: "from-green-400 to-green-600",
    unlocked: false,
    modules: [
      {
        id: "ie-1",
        title: "Damage Detection AR",
        type: "practice",
        duration: "40 min",
        xpReward: 350,
        completed: false
      },
      {
        id: "ie-2",
        title: "Drone Footage Analysis",
        type: "lesson",
        duration: "30 min",
        xpReward: 250,
        completed: false
      },
      {
        id: "ie-3",
        title: "Virtual Roof Walk",
        type: "simulation",
        duration: "45 min",
        xpReward: 400,
        completed: false
      }
    ],
    milestones: [
      {
        id: "m3-1",
        title: "Eagle Eye",
        requirement: "Correctly identify 50 damage types",
        progress: 0,
        target: 50,
        reward: "Badge: Damage Detective"
      }
    ],
    weeklyGoals: [
      {
        week: 6,
        goals: {
          doors: 300,
          conversations: 80,
          appointments: 8,
          practices: 8
        }
      }
    ]
  },
  {
    id: 4,
    name: "insurance-master",
    title: "The Insurance Master",
    weeks: "Weeks 9-10",
    description: "Navigate insurance claims, supplements, and legal compliance",
    icon: "📋",
    color: "from-orange-400 to-orange-600",
    unlocked: false,
    modules: [
      {
        id: "im-1",
        title: "Policy Decoder",
        type: "lesson",
        duration: "35 min",
        xpReward: 300,
        completed: false
      },
      {
        id: "im-2",
        title: "Supplement Calculator",
        type: "practice",
        duration: "25 min",
        xpReward: 250,
        completed: false
      },
      {
        id: "im-3",
        title: "Claims Battle Simulator",
        type: "simulation",
        duration: "50 min",
        xpReward: 500,
        completed: false
      }
    ],
    milestones: [
      {
        id: "m4-1",
        title: "Claims Champion",
        requirement: "Successfully navigate 5 claim scenarios",
        progress: 0,
        target: 5,
        reward: "Badge: Insurance Wizard"
      }
    ],
    weeklyGoals: [
      {
        week: 9,
        goals: {
          doors: 250,
          conversations: 70,
          appointments: 10,
          practices: 6
        }
      }
    ]
  },
  {
    id: 5,
    name: "apex-pro",
    title: "The Apex Sales Pro",
    weeks: "Weeks 11-12",
    description: "Master psychological principles and become a top performer",
    icon: "🏆",
    color: "from-red-500 to-pink-600",
    unlocked: false,
    modules: [
      {
        id: "ap-1",
        title: "Mind Ninja Training",
        type: "lesson",
        duration: "45 min",
        xpReward: 500,
        completed: false
      },
      {
        id: "ap-2",
        title: "6-Figure Mindset",
        type: "practice",
        duration: "30 min",
        xpReward: 400,
        completed: false
      },
      {
        id: "ap-3",
        title: "Final Boss Scenarios",
        type: "simulation",
        duration: "60 min",
        xpReward: 1000,
        completed: false
      }
    ],
    milestones: [
      {
        id: "m5-1",
        title: "Apex Achievement",
        requirement: "Close 10 deals",
        progress: 0,
        target: 10,
        reward: "Badge: Apex Sales Pro"
      }
    ],
    weeklyGoals: [
      {
        week: 11,
        goals: {
          doors: 200,
          conversations: 60,
          appointments: 12,
          practices: 5
        }
      }
    ]
  }
];

// Badges System
export const badges: Badge[] = [
  // Milestone Badges
  {
    id: "door-warrior",
    name: "Door Warrior",
    description: "Knocked your first 100 doors",
    icon: "🚪",
    xpReward: 500,
    rarity: "common"
  },
  {
    id: "trust-builder",
    name: "Trust Builder",
    description: "Mastered rapport building techniques",
    icon: "🤝",
    xpReward: 750,
    rarity: "rare"
  },
  {
    id: "damage-detective",
    name: "Damage Detective",
    description: "Correctly identified 50+ damage types",
    icon: "🔍",
    xpReward: 1000,
    rarity: "rare"
  },
  {
    id: "insurance-wizard",
    name: "Insurance Wizard",
    description: "Mastered insurance claim navigation",
    icon: "🧙‍♂️",
    xpReward: 1250,
    rarity: "epic"
  },
  {
    id: "apex-pro",
    name: "Apex Sales Pro",
    description: "Completed the 12-week journey",
    icon: "🏆",
    xpReward: 5000,
    rarity: "legendary"
  },
  // Performance Badges
  {
    id: "first-sale",
    name: "First Blood",
    description: "Closed your first deal",
    icon: "💰",
    xpReward: 1000,
    rarity: "rare"
  },
  {
    id: "perfect-week",
    name: "Perfect Week",
    description: "Hit all weekly goals",
    icon: "⭐",
    xpReward: 750,
    rarity: "rare"
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "30-day activity streak",
    icon: "🔥",
    xpReward: 1500,
    rarity: "epic"
  },
  {
    id: "six-figure",
    name: "Six Figure Club",
    description: "Reached $100k in total commissions",
    icon: "💎",
    xpReward: 10000,
    rarity: "legendary"
  }
];

// Daily Challenges
export const dailyChallenges = [
  {
    id: "dc-1",
    title: "Morning Motivator",
    description: "Complete a 30-second hook practice before 9 AM",
    xpReward: 50,
    timeLimit: "9:00 AM"
  },
  {
    id: "dc-2",
    title: "Objection Crusher",
    description: "Practice 5 different objection responses",
    xpReward: 75,
    timeLimit: "End of day"
  },
  {
    id: "dc-3",
    title: "Knowledge Check",
    description: "Score 80%+ on a random quiz",
    xpReward: 100,
    timeLimit: "End of day"
  }
];

// Leaderboard Mock Data
export const leaderboard = [
  { rank: 1, name: "Mike Johnson", xp: 15420, level: 28, deals: 18 },
  { rank: 2, name: "Sarah Williams", xp: 14200, level: 26, deals: 16 },
  { rank: 3, name: "You", xp: 8750, level: 18, deals: 8, isCurrentUser: true },
  { rank: 4, name: "James Chen", xp: 8400, level: 17, deals: 7 },
  { rank: 5, name: "Maria Garcia", xp: 7900, level: 16, deals: 6 }
];

// Level System
export const getLevelFromXP = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  return Math.pow(currentLevel, 2) * 50;
};

// Practice Scenarios from real training
export const practiceScenarios = {
  deb: {
    id: "deb-scenario",
    title: "The Deb Scenario",
    description: "Build trust with a reluctant homeowner who needs guidance",
    difficulty: "advanced",
    phases: [
      {
        ai: "Oh, another roofing person? I've had three companies knock this week. I'm really not interested in dealing with this right now.",
        hints: ["Start with non-roof topic", "Find common ground", "Be genuinely interested"],
        perfectResponse: "I totally understand the frustration! Seems like everyone's been busy in the neighborhood. I actually noticed your beautiful garden - those roses are stunning! How long have you been working on it?"
      },
      {
        ai: "Oh, thank you! I've been working on it for about 5 years now. It's my pride and joy. But really, I don't think I need any roof work.",
        hints: ["Build on the connection", "Gently transition", "No pressure"],
        perfectResponse: "Five years of work really shows! My mom would be so jealous - she's been trying to get her roses to bloom like that. By the way, I did notice what might be some wear on your roof when I was admiring the garden. Have you noticed anything unusual lately, or has everything been fine?"
      }
    ],
    scoringCriteria: [
      "Started with non-roof conversation",
      "Built genuine rapport",
      "Gentle transition to business",
      "No pressure approach",
      "Demonstrated trustworthiness"
    ]
  }
};

export default {
  apexJourney,
  badges,
  dailyChallenges,
  leaderboard,
  practiceScenarios,
  getLevelFromXP,
  getXPForNextLevel
};