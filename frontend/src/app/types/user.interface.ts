import { MenteeDetails} from "./user details/mentee.interface";
import {UserInfo} from "./user details/user-info.interface";
import {MentorDetails} from "./user details/mentor/mentor.interface";
import {UserType} from "./user-type.enum";

export interface UserDetails extends UserInfo {
  id: string;
  accountId: string;
  isAdmin: boolean;
  joined: string;
  roles: UserType[]
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
