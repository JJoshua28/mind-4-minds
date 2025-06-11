import {Mentee} from "./user details/mentee.interface";
import {Mentor} from "../shared/types/mentor.interface";

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
