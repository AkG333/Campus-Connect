export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedDate: string;
  questionsCount: number;
  answersCount: number;
  reputation: number;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  votes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}