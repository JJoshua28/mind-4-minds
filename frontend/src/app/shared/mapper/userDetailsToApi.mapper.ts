import { RegistrationUserDetails } from "../../modules/register/registration.service";
import { UserType } from "../../types/user-type.enum";
import {UserDetailsUpdateRequest} from "../../types/api/user-details.interface";

interface IRegistrationUserDetails extends Omit<RegistrationUserDetails, "email" | "newPassword"> {}

export function mapUserFormToApiPayload(details: IRegistrationUserDetails | UserDetailsUpdateRequest, roles: UserType[]) {
  return {
    first_name: details.firstName,
    last_name: details.lastName,
    occupation: details.occupation,
    occupation_start_date: details.occupationStartDate || null,
    profile_pic: details.profilePic,
    roles: JSON.stringify(roles),
  };
}
