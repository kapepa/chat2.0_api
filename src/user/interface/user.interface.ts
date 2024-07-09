export interface UserInt {
  id: string;
  username: string;
  email: string;
  description: string;
  avatarUrl: string | null;
  subscriptionAmount: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  stack: string[];
  city: string;
  created_at: Date;
  updated_at: Date;
}