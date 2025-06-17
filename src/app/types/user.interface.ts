import { MenteeDetails} from "./user details/mentee.interface";
import {UserInfo} from "./user details/user-info.interface";
import {MentorDetails} from "./user details/mentor/mentor.interface";

export interface UserDetails extends UserInfo {
  id: string;
  isArchived: boolean;
}

export interface User extends UserDetails {
  menteeDetails?: MenteeDetails
  mentorDetails?: MentorDetails
}

export interface MentorUser extends User {
  mentorDetails: MentorDetails;
}

export interface MenteeUser extends User {
  menteeDetails: MenteeDetails
}
