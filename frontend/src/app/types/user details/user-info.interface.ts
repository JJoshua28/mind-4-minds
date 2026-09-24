import {MeetingPreferences} from "./mentor/mentor.enum";
import {NeurodivergenceConditions} from "./neurodivergence.enum";
import {LearningPreferences} from "./learning-preferences.enum";
import {UserType} from "../user-type.enum";

export interface UserInfo {
  id: string;
  firstName: string
  lastName: string
  email: string;
  occupation: string | null
  occupationStartDate: string | null
  profilePic: string;
  isAdmin: boolean;
  joined: string;
  roles: UserType[]
  isArchived: boolean;
}

export interface MentorInfo {
  description: string;
  qualifications: string;
  experience: string;
  commitment: string;
  meetingPreferences: Array<MeetingPreferences>
  neurodivergentConditions: Array<NeurodivergenceConditions>;
}

export interface MenteeInfo {
  description: string;
  goals: Array<string>;
  learningPreferences: Array<LearningPreferences>;
  expectations: string;
  meetingPreferences: Array<MeetingPreferences>
  neurodivergentConditions: Array<NeurodivergenceConditions>;
  commitment: string;
}
