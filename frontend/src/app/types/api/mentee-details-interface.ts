export interface MenteeDetailsApi {
  id: string;
  user_details?: string
  description: string;
  commitment: string;
  meeting_preferences: string[];
  goals: string[];
  expectations: string;
  learning_preferences: string[];
  neurodivergent_conditions: string[];
}

