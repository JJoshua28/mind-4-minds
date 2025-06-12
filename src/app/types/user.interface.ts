import {Mentee} from "./user details/mentee.interface";
import {Mentor} from "./user details/mentor/mentor.interface";


export interface User {
  id: string;
  firstname: string;
  surname: string;
  occupation: string;
  profilePic: string;
  occupationStartDate: Date;
  email: string;
  menteeDetails?: Mentee
  mentorDetails?: Mentor
}

export interface MentorUser {
  id: string;
  firstname: string;
  surname: string;
  occupation: string;
  profilePic: string;
  occupationStartDate: Date;
  email: string;
  menteeDetails?: Mentee
  mentorDetails: Mentor
}

