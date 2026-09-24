import {UserAccount, UserAccountDetails, UserAccountPayload} from "../../types/api/user-account .interface";
import {UserInfo} from "../../types/user details/user-info.interface";


export function mapUserAccountToApiPayload(account: Partial<UserInfo>): Partial<UserAccount> {
  const {isArchived, isAdmin, email, ...accountDetails} = account
  return {
    ...accountDetails,
    is_active: !isArchived,
    is_staff: isAdmin
  }

}
