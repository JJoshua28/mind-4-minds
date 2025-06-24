import {UserInfo} from "../user details/user-info.interface";
import {UserType} from "../user-type.enum";

export interface ApiUserDetails {
  id: string;
  first_name: string
  last_name: string
  occupation: string
  occupation_start_date: string
  profilePic: string
  roles: string[]
}


export interface UserDetailsUpdateRequest {
  profilePic?: File
  firstName: string
  roles: UserType[]
  lastName: string
  occupation: string | null
  occupationStartDate: string | null
}
