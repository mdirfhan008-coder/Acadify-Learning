export enum View {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  COURSES = 'COURSES',
  CONTACT = 'CONTACT',
  FEEDBACK = 'FEEDBACK',
  DASHBOARD = 'DASHBOARD',
  MATERIALS = 'MATERIALS',
  QUIZ = 'QUIZ',
  TUTOR = 'TUTOR',
  EXPLORE = 'EXPLORE',
  COMMUNITY = 'COMMUNITY',
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudySet {
  topic: string;
  summary: string;
  keyConcepts: string[];
  flashcards: Flashcard[];
  createdAt: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  topic: string;
  date: Date;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Stats for dashboard
export interface StudyStats {
  topicsStudied: number;
  quizzesTaken: number;
  averageScore: number;
  hoursSpent: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: string[];
  progress?: number; // 0 to 100
}

export interface SubjectOverview {
  subject: string;
  description: string;
  topics: string[];
  difficulty: string;
  relatedFields: string[];
}

export interface AppSettings {
  language: string;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export interface ActivityLog {
  id: string;
  action: string; // e.g., "Completed Quiz", "Generated Summary"
  topic: string;
  timestamp: Date;
  meta?: string; // e.g., "Score: 80%"
}