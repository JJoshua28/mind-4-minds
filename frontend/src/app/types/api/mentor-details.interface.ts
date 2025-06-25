import {ApiUserDetails} from "./user-details.interface";
import {UserAccount} from "./user-account .interface";

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

export interface MentorUserApi {
  id: string;
  user_details?: string
  description: string;
  qualifications: string;
  experience: string;
  commitment: string;
  meeting_preferences: string[];
  neurodivergent_conditions: string[];
  is_available?: boolean;
  user_details_record: ApiUserDetails;
  user_account: UserAccount;
}
