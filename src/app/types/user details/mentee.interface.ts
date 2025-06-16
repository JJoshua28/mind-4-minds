import {LearningPreferences} from "./learning-preferences.enum";
import {MeetingPreferences} from "./mentor/mentor.enum";
import {NeurodivergenceConditions} from "./neurodivergence.enum";

export interface MenteeDetails {
  description: string;
  goals: Array<string>;
  learningPreferences: Array<LearningPreferences>;
  expectations: string;
  meetingPreferences: Array<MeetingPreferences>
  neurodivergentConditions: Array<NeurodivergenceConditions>;
  commitment: string;
}

export interface Mentee extends MenteeDetails {
  id: string;
}
