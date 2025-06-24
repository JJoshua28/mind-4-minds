export interface MentorDetailsApi {
  id: string;
  user_details?: string
  description: string;
  qualifications: string;
  experience: string;
  commitment: string;
  meeting_preferences: string[];
  neurodivergent_conditions: string[];
  is_available?: boolean;
}
