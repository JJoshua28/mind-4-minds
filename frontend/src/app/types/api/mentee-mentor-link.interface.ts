import {MenteeDetailsApi} from "./mentee-details-interface";
import {MentorDetailsApi, MentorUserApi} from "./mentor-details.interface";

export interface MenteeMentorLinkApi {
  id: string;
  mentees: string;
  mentors: string;
  mentee_record: MenteeDetailsApi;
  mentor_record: MentorUserApi;
}
