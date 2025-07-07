import { UserAccountDetails, UserAccountPayload } from "../../types/api/user-account .interface";

export function mapUserAccountToApiPayload(account: UserAccountDetails): UserAccountPayload {
  const {isArchived, isAdmin, ...accountDetails} = account
  return {
    ...accountDetails,
    is_active: !isArchived,
    is_staff: isAdmin
  }

}
