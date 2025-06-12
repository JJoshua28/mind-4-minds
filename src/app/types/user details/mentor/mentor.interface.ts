import {MeetingPreferences} from "./mentor.enum";
import {NeurodivergenceConditions} from "../neurodivergence.enum";

export interface Mentor {
  id: string
  qualifications: string;
  description: string;
  experience: string;
  meetingPreferences: Array<MeetingPreferences>
  neurodivergentConditions: Array<NeurodivergenceConditions>;
  isAvailable?: boolean;
}
