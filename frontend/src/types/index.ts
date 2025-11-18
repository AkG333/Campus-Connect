export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  role?: string | null;
}

export interface Question {
  id: number;
  title: string;
  body: string;
  userId: number;
  authorName: string;
  createdAt: string;
  upvotes: number;
  answerCount: number;
}

export interface Answer {
  id: number;
  body: string;
  userId: number;
  authorName: string;
  createdAt: string;
  upvotes: number;
}

export interface QuestionPage {
  content: Question[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
