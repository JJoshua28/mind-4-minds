import { UserAccountDetails, UserAccountPayload } from "../../types/api/user-account .interface";

export function mapUserAccountToApiPayload(account: UserAccountDetails): UserAccountPayload {
  const {isArchived, ...accountDetails} = account
  return {
    ...accountDetails,
    is_active: isArchived,
  }

}
