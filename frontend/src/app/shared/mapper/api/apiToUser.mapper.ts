import {UserType} from "../../../types/user-type.enum";
import {User} from "../../../types/user.interface";
import {UserAccount} from "../../../types/api/user-account .interface";
import {mapMenteeDetails} from "./apiToMenteeDetails.mapper";
import {mapMentorDetails} from "./apiToMentorDetails.mapper";

  export function mapApiToUser(api: UserAccount): User {
  return {
    id: api.id,
    joined: api.joined,
    roles: api.roles as UserType[],
    isArchived: !api.is_active,
    firstName: api.first_name,
    lastName: api.last_name,
    email: api.email,
    isAdmin: api.is_staff,
    occupation: api.occupation || null,
    occupationStartDate: api.occupation_start_date || null,
    profilePic: api.profilePic,
    menteeDetails: api?.menteeDetails? mapMenteeDetails(api.menteeDetails) : undefined,
    mentorDetails: api?.mentorDetails? mapMentorDetails(api?.mentorDetails) : undefined,
  };
}
