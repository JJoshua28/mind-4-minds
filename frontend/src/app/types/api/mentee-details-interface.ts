import {ApiUserDetails} from "./user-details.interface";

export interface MenteeDetailsApi {
  id: string;
  user_details?: string
  mentor_ids: string[];
  user_details_record?: ApiUserDetails
  description: string;
  commitment: string;
  meeting_preferences: string[];
  goals: string[];
  expectations: string;
  learning_preferences: string[];
  neurodivergent_conditions: string[];
}

