import {inject, Injectable} from "@angular/core";
import {map, Observable, switchMap, take} from "rxjs";

import {User, UserDetails} from "../../types/user.interface";
import {UserType} from "../../types/user-type.enum";
import {ApiUserDetails, UserDetailsUpdateRequest} from "../../types/api/user-details.interface";
import {UserAccount, UserAccountDetails} from "../../types/api/user-account .interface";

import {mapApiToUserDetails} from "../mapper/api/apiToUserDetails.mapper";
import {mapUserAccountToApiPayload} from "../mapper/userAccountToApi.mapper";
import {mapUserFormToApiPayload} from "../mapper/userDetailsToApi.mapper";
import {mapApiUserDetailsToUserDetails} from "../mapper/api/apiToUser.mapper";
import {HttpService} from "../services/http.service";

@Injectable({
  providedIn: "root",
})

export class UserRepository {

  private readonly apiService = inject(HttpService)

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

  getUserById(userDetailsId: string): Observable<User> {
    const detailsEndpoint = `users/details/${userDetailsId}`;

    return this.apiService.get<ApiUserDetails>(detailsEndpoint).pipe(
      map((details) => mapApiUserDetailsToUserDetails(details))
    )
  }



  updateUserAccount(account: UserAccountDetails, userAccountId: string) {
    const updateAccountEndpoint = `users/accounts/${userAccountId}/`;

    const mappedAccountDetails = mapUserAccountToApiPayload(account);

    return this.apiService.put<UserAccount>(updateAccountEndpoint, mappedAccountDetails)
  }

  createUserDetailsRequest(details: UserDetailsUpdateRequest, roles: UserType[]): FormData {
    const userRegistration = mapUserFormToApiPayload(details, roles)
    const formData = new FormData();

    for (const key in userRegistration) {
      if (Object.prototype.hasOwnProperty.call(userRegistration, key)) {
        const value = userRegistration[key as keyof typeof userRegistration];

        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
    }
    return formData;
  }

  updateUserDetails(updateRequest: Partial<UserDetailsUpdateRequest>, userDetailsId: string) {
    const updateDetailsEndpoint = `users/details/${userDetailsId}/`;
    const mappedDetails = this.createUserDetailsRequest(updateRequest as UserDetailsUpdateRequest, updateRequest.roles as UserType[])

    return this.apiService.put<ApiUserDetails>(updateDetailsEndpoint, mappedDetails).pipe(
      map((details) => {
          const detail = details as ApiUserDetails;
          return mapApiUserDetailsToUserDetails(detail);
        }
      )
    );
  }

  deleteMultipleUsers(userIds: string[]) {
    const endpoint = `users/accounts/delete-all/`;
    const body = { ids: userIds };

    return this.apiService.post<{ deleted: number }>(endpoint, body).pipe(
      map((response) => `Deleted ${response.deleted} users`)
    );
  }

}
