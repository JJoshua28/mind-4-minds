import {MeetingPreferences, Specialities} from "./mentor.enum";

export interface MentorDetails {
  meetingPreference: Array<MeetingPreferences>
  mainSpeciality: Specialities;
  specialities: Array<Specialities>;
  description: string;
  qualifications: string;
  experience: string;
  isAvailable: boolean;
}
