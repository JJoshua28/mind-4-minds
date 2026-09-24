import {inject, Injectable} from "@angular/core";
import {map, Observable, switchMap, take} from "rxjs";

import {User, UserDetails} from "../../types/user.interface";
import {ApiUserDetails} from "../../types/api/user-details.interface";
import {UserAccount} from "../../types/api/user-account .interface";

import {mapApiToUserDetails} from "../mapper/api/apiToUserDetails.mapper";
import {mapUserAccountToApiPayload} from "../mapper/userAccountToApi.mapper";
import {mapUserFormToApiPayload} from "../mapper/userDetailsToApi.mapper";
import {mapApiUserInfo} from "../mapper/api/apiToUser.mapper";
import {HttpService} from "../services/http.service";
import {environment} from "../../../environments/environment";
import {UserInfo} from "../../types/user details/user-info.interface";

@Injectable({
  providedIn: "root",
})

export class UserRepository {

  private readonly apiService = inject(HttpService)

  private readonly baseUrl = "users/accounts";

  getAllUserDetails(currentUserAccountId: string) {
    const detailsEndpoint = `users/details/`;

    return this.apiService.get<ApiUserDetails[]>(detailsEndpoint).pipe(
      map(details => details.filter(detail => detail.user_account.id !== currentUserAccountId)),

      map(userDetails => userDetails.map(detail => {
        const { user_account } = detail;
        return mapApiToUserDetails(user_account, detail);
      })),
    );
  }

  getUserDetailsByAccountId(userAccountId?: string): Observable<UserDetails> {
    const detailsEndpoint = `users/details/?user_account_id=${userAccountId}`;

    return this.apiService.get<ApiUserDetails[]>(detailsEndpoint).pipe(
      map(([details]) => mapApiToUserDetails(details.user_account, details)),
    );
  }

  getUserDetailsById(userDetailsId: string): Observable<UserDetails> {
    const detailsEndpoint = `users/details/${userDetailsId}/`;

    return this.apiService.get<ApiUserDetails>(detailsEndpoint).pipe(
      map((details) => mapApiToUserDetails(details.user_account, details))
    )
  }

  getUserById(userId: string): Observable<User> {
    const detailsEndpoint = `${this.baseUrl}/${userId}`;

    return this.apiService.get<UserAccount>(detailsEndpoint).pipe(
      map((details) => mapApiUserInfo(details))
    )
  }



  updateUserAccount(account: Partial<UserInfo>, userAccountId?: string) {
    const updateAccountEndpoint = `${this.baseUrl}/${userAccountId || account?.id}/`;

    const mappedAccountDetails = mapUserAccountToApiPayload(account);

    return this.apiService.put<UserAccount>(updateAccountEndpoint, mappedAccountDetails).pipe(
      map((details) => {
          const detail = details as UserAccount;
          return mapApiUserInfo(detail);
        }
      ))
  }

  // createUserDetailsRequest(details: UserDetailsUpdateRequest, roles: UserType[]): FormData {
  //   const userRegistration = mapUserFormToApiPayload(details, roles)
  //   const formData = new FormData();
  //
  //   for (const key in userRegistration) {
  //     if (Object.prototype.hasOwnProperty.call(userRegistration, key)) {
  //       const value = userRegistration[key as keyof typeof userRegistration];
  //
  //       if (value !== undefined && value !== null) {
  //         formData.append(key, value);
  //       }
  //     }
  //   }
  //   return formData;
  // }

  // updateUserDetails(updateRequest: Partial<UserAccount>, accountID: string) {
  //   const updateDetailsEndpoint = `users/account/${accountID}/`;
  //   const mappedDetails = this.updateUserAccount(updateRequest, accountID);
  //
  //   return this.apiService.put<UserAccount>(updateDetailsEndpoint, mappedDetails).pipe(
  //     map((details) => {
  //         const detail = details as UserAccount;
  //         return mapApiUserInfo(detail);
  //       }
  //     )
  //   );
  // }

  deleteMultipleUsers(userIds: string[]) {
    const endpoint = `${this.baseUrl}/delete-all/`;
    const body = { ids: userIds };

    return this.apiService.post<{ deleted: number }>(endpoint, body).pipe(
      map((response) => `Deleted ${response.deleted} users`)
    );
  }

}
