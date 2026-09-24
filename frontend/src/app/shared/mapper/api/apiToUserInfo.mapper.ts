import {UserAccount} from "../../../types/api/user-account .interface";
import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {UserInfo} from "../../../types/user details/user-info.interface";
import {UserType} from "../../../types/user-type.enum";

export function mapApiToUserInfo (account: UserAccount): UserInfo {
  const {first_name, last_name, occupation_start_date, is_active, is_staff, roles, ...otherDetails} = account;
  return {
    firstName: first_name,
    lastName: last_name,
    isAdmin: is_staff,
    isArchived: is_active,
    roles: roles as UserType[],
    occupationStartDate: occupation_start_date,
    ...otherDetails

  }
}
