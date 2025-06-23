import {UserAccount} from "../../../types/api/user-account .interface";
import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {UserInfo} from "../../../types/user details/user-info.interface";

export function mapApiToUserInfo (account: UserAccount, details: ApiUserDetails): UserInfo {
  return {
    firstName: details.first_name,
    lastName: details.last_name,
    occupation: details.occupation,
    occupationStartDate: details.occupation_start_date,
    profilePic: details.profilePic,
    email: account.email,
  }


}
