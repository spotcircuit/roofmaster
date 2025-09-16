import { pgTable, text, integer, timestamp, boolean, jsonb, decimal, uuid, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Auth tables for NextAuth
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified'),
  name: text('name'),
  image: text('image'),
  role: text('role').default('trainee'), // trainee, apex, manager, admin
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  userIdIdx: index('account_user_id_idx').on(account.userId),
}));

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
}, (session) => ({
  userIdIdx: index('session_user_id_idx').on(session.userId),
}));

// Gamification tables
export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  currentPhase: integer('current_phase').default(1),
  currentWeek: integer('current_week').default(1),
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  streak: integer('streak').default(0),
  lastActivityDate: timestamp('last_activity_date'),
  personalWhy: text('personal_why'),
  mentorId: text('mentor_id'),
  startDate: timestamp('start_date').defaultNow(),
  graduationDate: timestamp('graduation_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (profile) => ({
  userIdIdx: index('profile_user_id_idx').on(profile.userId),
  mentorIdIdx: index('profile_mentor_id_idx').on(profile.mentorId),
}));

export const userStats = pgTable('user_stats', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  doorsKnocked: integer('doors_knocked').default(0),
  conversationsHad: integer('conversations_had').default(0),
  appointmentsSet: integer('appointments_set').default(0),
  inspectionsCompleted: integer('inspections_completed').default(0),
  dealsCloned: integer('deals_closed').default(0),
  totalCommission: decimal('total_commission', { precision: 10, scale: 2 }).default('0'),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }).default('0'),
  weeklyGoalsHit: integer('weekly_goals_hit').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (stats) => ({
  userIdIdx: index('stats_user_id_idx').on(stats.userId),
}));

export const badges = pgTable('badges', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').unique().notNull(), // door-warrior, trust-builder, etc
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  xpReward: integer('xp_reward').default(0),
  rarity: text('rarity'), // common, rare, epic, legendary
  category: text('category'), // milestone, performance, special
  requirement: jsonb('requirement'), // JSON object with criteria
  createdAt: timestamp('created_at').defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
  progress: integer('progress').default(0),
  target: integer('target'),
}, (userBadge) => ({
  userBadgeKey: index('user_badge_idx').on(userBadge.userId, userBadge.badgeId),
}));

export const phases = pgTable('phases', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: integer('number').unique().notNull(), // 1-5
  name: text('name').notNull(), // door-opener, rapport-builder, etc
  title: text('title').notNull(),
  description: text('description'),
  weeks: text('weeks'), // "Weeks 1-2"
  icon: text('icon'),
  color: text('color'), // gradient colors
  createdAt: timestamp('created_at').defaultNow(),
});

export const modules = pgTable('modules', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  phaseId: text('phase_id').notNull().references(() => phases.id),
  code: text('code').unique().notNull(), // do-1, rb-1, etc
  title: text('title').notNull(),
  type: text('type').notNull(), // lesson, practice, simulation, quiz, field
  description: text('description'),
  content: jsonb('content'), // Rich content in JSON
  duration: text('duration'),
  xpReward: integer('xp_reward').default(0),
  orderIndex: integer('order_index'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (module) => ({
  phaseIdIdx: index('module_phase_id_idx').on(module.phaseId),
}));

export const userModuleProgress = pgTable('user_module_progress', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  moduleId: text('module_id').notNull().references(() => modules.id),
  completed: boolean('completed').default(false),
  score: integer('score'),
  attempts: integer('attempts').default(0),
  timeSpent: integer('time_spent').default(0), // in seconds
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (progress) => ({
  userModuleIdx: index('user_module_idx').on(progress.userId, progress.moduleId),
}));

export const practiceScenarios = pgTable('practice_scenarios', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').unique().notNull(), // deb-scenario, etc
  title: text('title').notNull(),
  description: text('description'),
  difficulty: text('difficulty'), // beginner, intermediate, advanced
  phases: jsonb('phases'), // Array of conversation phases
  scoringCriteria: jsonb('scoring_criteria'),
  tips: jsonb('tips'),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const practiceAttempts = pgTable('practice_attempts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  scenarioId: text('scenario_id').notNull().references(() => practiceScenarios.id),
  responses: jsonb('responses'), // User's responses
  score: integer('score'),
  feedback: jsonb('feedback'),
  timeSpent: integer('time_spent'), // in seconds
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (attempt) => ({
  userScenarioIdx: index('user_scenario_idx').on(attempt.userId, attempt.scenarioId),
}));

export const dailyActivities = pgTable('daily_activities', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  doorsKnocked: integer('doors_knocked').default(0),
  conversationsHad: integer('conversations_had').default(0),
  appointmentsSet: integer('appointments_set').default(0),
  practicesCompleted: integer('practices_completed').default(0),
  xpEarned: integer('xp_earned').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
}, (activity) => ({
  userDateIdx: index('user_date_idx').on(activity.userId, activity.date),
}));

export const leaderboard = pgTable('leaderboard', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  period: text('period').notNull(), // daily, weekly, monthly, all-time
  xp: integer('xp').default(0),
  deals: integer('deals').default(0),
  rank: integer('rank'),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (board) => ({
  periodRankIdx: index('period_rank_idx').on(board.period, board.rank),
}));

export const challenges = pgTable('challenges', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text('code').unique().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type'), // daily, weekly, special
  xpReward: integer('xp_reward').default(0),
  requirement: jsonb('requirement'),
  activeFrom: timestamp('active_from'),
  activeUntil: timestamp('active_until'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userChallenges = pgTable('user_challenges', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: text('challenge_id').notNull().references(() => challenges.id),
  progress: integer('progress').default(0),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (userChallenge) => ({
  userChallengeIdx: index('user_challenge_idx').on(userChallenge.userId, userChallenge.challengeId),
}));

// Training Videos table
export const trainingVideos = pgTable('training_videos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // in seconds
  category: text('category'),
  phaseId: text('phase_id').references(() => phases.id),
  moduleId: text('module_id').references(() => modules.id),
  orderIndex: integer('order_index').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (video) => ({
  phaseIdIdx: index('video_phase_id_idx').on(video.phaseId),
  moduleIdIdx: index('video_module_id_idx').on(video.moduleId),
}));

// Quizzes table
export const quizzes = pgTable('quizzes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  videoId: text('video_id').references(() => trainingVideos.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  passingScore: integer('passing_score').default(70), // percentage
  attempts: integer('attempts').default(3), // max attempts allowed
  timeLimit: integer('time_limit'), // in minutes
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (quiz) => ({
  videoIdIdx: index('quiz_video_id_idx').on(quiz.videoId),
}));

// Quiz Questions table
export const quizQuestions = pgTable('quiz_questions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  type: text('type').notNull().default('multiple_choice'), // multiple_choice, true_false, open_ended
  options: jsonb('options'), // Array of options for multiple choice
  correctAnswer: text('correct_answer'), // For MC and T/F
  expectedKeywords: jsonb('expected_keywords'), // For open-ended AI evaluation
  explanation: text('explanation'), // Shown after answering
  points: integer('points').default(1),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
}, (question) => ({
  quizIdIdx: index('question_quiz_id_idx').on(question.quizId),
}));

// User Quiz Attempts table
export const userQuizAttempts = pgTable('user_quiz_attempts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  quizId: text('quiz_id').notNull().references(() => quizzes.id),
  videoId: text('video_id').references(() => trainingVideos.id),
  score: integer('score'),
  percentage: integer('percentage'),
  passed: boolean('passed').default(false),
  answers: jsonb('answers'), // User's answers
  timeSpent: integer('time_spent'), // in seconds
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
}, (attempt) => ({
  userQuizIdx: index('user_quiz_attempt_idx').on(attempt.userId, attempt.quizId),
  userIdIdx: index('quiz_attempt_user_idx').on(attempt.userId),
}));

// Video Progress Tracking
export const userVideoProgress = pgTable('user_video_progress', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').notNull().references(() => trainingVideos.id),
  watchedDuration: integer('watched_duration').default(0), // in seconds
  completed: boolean('completed').default(false),
  lastWatchedAt: timestamp('last_watched_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (progress) => ({
  userVideoIdx: index('user_video_progress_idx').on(progress.userId, progress.videoId),
}));

// AI Comprehension Tracking
export const aiComprehensionScores = pgTable('ai_comprehension_scores', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  videoId: text('video_id').references(() => trainingVideos.id),
  quizId: text('quiz_id').references(() => quizzes.id),
  comprehensionScore: decimal('comprehension_score', { precision: 5, scale: 2 }), // 0-100
  keyConceptsUnderstood: jsonb('key_concepts_understood'),
  areasForImprovement: jsonb('areas_for_improvement'),
  aiAnalysis: text('ai_analysis'),
  evaluatedAt: timestamp('evaluated_at').defaultNow(),
}, (score) => ({
  userIdIdx: index('ai_score_user_idx').on(score.userId),
  userVideoIdx: index('ai_score_user_video_idx').on(score.userId, score.videoId),
}));

// Overall User Comprehension Summary
export const userComprehensionSummary = pgTable('user_comprehension_summary', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  overallScore: decimal('overall_score', { precision: 5, scale: 2 }).default('0'),
  videosCompleted: integer('videos_completed').default(0),
  quizzesPassed: integer('quizzes_passed').default(0),
  quizzesFailed: integer('quizzes_failed').default(0),
  averageQuizScore: decimal('average_quiz_score', { precision: 5, scale: 2 }).default('0'),
  strongAreas: jsonb('strong_areas'),
  weakAreas: jsonb('weak_areas'),
  lastAssessment: timestamp('last_assessment'),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (summary) => ({
  userIdIdx: index('comprehension_summary_user_idx').on(summary.userId),
}));

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  stats: one(userStats),
  badges: many(userBadges),
  moduleProgress: many(userModuleProgress),
  practiceAttempts: many(practiceAttempts),
  dailyActivities: many(dailyActivities),
  challenges: many(userChallenges),
}));

export const phasesRelations = relations(phases, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  phase: one(phases, {
    fields: [modules.phaseId],
    references: [phases.id],
  }),
  progress: many(userModuleProgress),
}));