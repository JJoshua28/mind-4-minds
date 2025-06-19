import {MentorInfo} from "../user-info.interface";

export interface MentorDetails extends MentorInfo {
  id: string
  isAvailable: boolean;
}
