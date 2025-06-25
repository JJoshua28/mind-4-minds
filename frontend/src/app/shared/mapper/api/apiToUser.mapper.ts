import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {UserType} from "../../../types/user-type.enum";
import {User} from "../../../types/user.interface";

  export function mapApiUserDetailsToUserDetails(api: ApiUserDetails): User {
  return {
    id: api.id,
    joined: api.user_account.joined,
    roles: api.roles as UserType[],
    isArchived: !api.user_account.is_active,
    firstName: api.first_name,
    lastName: api.last_name,
    email: api.user_account.email,
    occupation: api.occupation || null,
    occupationStartDate: api.occupation_start_date || null,
    profilePic: api.profilePic,
  };
}
