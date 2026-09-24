import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {UserType} from "../../../types/user-type.enum";
import {User} from "../../../types/user.interface";
import {UserAccount} from "../../../types/api/user-account .interface";

  export function mapApiUserInfo(api: UserAccount): User {
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
  };
}
