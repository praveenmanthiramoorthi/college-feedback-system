export type Role = 'admin' | 'hod' | 'staff' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  isHOD?: boolean;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorRole: Role;
  targetRole: Role;
  department?: string;
  createdAt: string;
  status: 'active' | 'closed';
}

export interface FeedbackResponse {
  id: string;
  feedbackId: string;
  userId: string;
  responses: Record<string, string | number | boolean>;
  submittedAt: string;
}
