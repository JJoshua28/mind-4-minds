import {MenteeDetailsApi} from "./mentee-details-interface";
import {MentorDetailsApi} from "./mentor-details.interface";
import {UserType} from "../user-type.enum";

export interface UserAccount {
  id: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  joined: string;
  first_name: string
  last_name: string
  occupation: string | null;
  occupation_start_date: string | null;
  profilePic: string;
  roles: string[];
  menteeDetails?: MenteeDetailsApi;
  mentorDetails?: MentorDetailsApi;
}

export interface UserAccountPayload {
  email: string;
  is_active: boolean;
  is_staff?: boolean;
  password?: string;
}

export interface UserAccountDetails {
  firstName?: string
  lastName?: string
  occupation?: string | null
  occupationStartDate?: string | null
  profilePic?: string;
  joined?: string;
  roles?: UserType[]
  email?: string;
  isArchived?: boolean;
  isAdmin?: boolean;
  password?: string;
}
