import {UserDetails} from "../../../types/user.interface";
import {UserAccount} from "../../../types/api/user-account .interface";
import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {UserType} from "../../../types/user-type.enum";

export function mapApiToUserDetails (account: UserAccount, details: ApiUserDetails): UserDetails {
  return {
    id: details.id,
    firstName: details.first_name,
    lastName: details.last_name,
    occupation: details.occupation,
    occupationStartDate: details.occupation_start_date,
    profilePic: details.profilePic,
    roles: details.roles as UserType[],
    joined: account.joined,
    isArchived: account.is_active,
    email: account.email,
  }


}
