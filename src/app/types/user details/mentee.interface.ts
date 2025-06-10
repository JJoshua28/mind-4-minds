import {LearningPreferences} from "./learning-preferences.enum";
import {MeetingPreferences} from "./mentor/mentor.enum";
import {NeurodivergenceConditions} from "./neurodivergence.enum";

export interface Mentee {
  description: string;
  goals: Array<string>;
  learningPreference: Array<LearningPreferences>;
  expectations: string;
  meetingPreference: Array<MeetingPreferences>
  neurodivergentConditions: Array<NeurodivergenceConditions>;
  commitment: string;
}
