import {inject, Injectable, OnInit} from '@angular/core';
import {LocalStorageService} from "../local-storage.service";
import {Router} from "@angular/router";
import {HttpService} from "../http.service";
import { forkJoin, map, Observable, of, switchMap, take} from "rxjs";
import {AuthServiceService} from "../auth-service.service";
import {UserAccount, UserAccountDetails} from "../../../types/api/user-account .interface";
import {mapApiToUserDetails} from "../../mapper/api/apiToUserDetails.mapper";
import {UserDetails} from "../../../types/user.interface";
import {ApiUserDetails, UserDetailsUpdateRequest} from "../../../types/api/user-details.interface";
import {UserInfo} from "../../../types/user details/user-info.interface";
import {mapApiToUserInfo} from "../../mapper/api/apiToUserInfo.mapper";
import {mapUserAccountToApiPayload} from "../../mapper/userAccountToApi.mapper";
import {UserType} from "../../../types/user-type.enum";
import {mapUserFormToApiPayload} from "../../mapper/userDetailsToApi.mapper";
import {RegistrationUserDetails} from "../../../modules/register/registration.service";


@Injectable({
  providedIn: null
})

export class UserService implements OnInit {
  private readonly _router = inject(Router)

  private readonly _localStorageService = inject(LocalStorageService)
  private readonly _authService = inject(AuthServiceService)

  private readonly apiService = inject(HttpService)

  private _userId = this._localStorageService.getItem("user_id")  || "" as string;

  ngOnInit(): void {
    const authToken = this._authService.getAccessToken();
    const userId = this._localStorageService.getItem("user_id") ;


    if (!authToken || !userId && this._router.url !== '/login') {
      this.throwUserUnauthorizedUser();
    }

    this._userId = userId as string;
  }

  throwUserUnauthorizedUser() {
    this._router.navigate(['/login']);
  }

  userDetails(userId?: string): Observable<UserDetails> {
    const usersEndpoint = `users/accounts/${userId || this._userId }`;
    const detailsEndpoint = `users/details`;

    return this.apiService.get(usersEndpoint).pipe(
      switchMap(userAccount => {
        const { details } = userAccount as UserAccount;
        const userDetailsEndpoint = `${detailsEndpoint}/${details}`;
        return forkJoin([
          of(userAccount) as Observable<UserAccount>,
          this.apiService.get(userDetailsEndpoint) as Observable<ApiUserDetails>
        ]);
      }),
      map(([userAccount, userDetails]) => mapApiToUserDetails(userAccount, userDetails)),
      take(1)
    );
  }

  updateUserAccount(account: UserAccountDetails) {
    const updateAccountEndpoint = `users/accounts/${this._userId}/`;

    const mappedAccountDetails = mapUserAccountToApiPayload(account);

    return this.apiService.put(updateAccountEndpoint, mappedAccountDetails).pipe(take(1))
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

  updateUserDetails(updateRequest: UserDetailsUpdateRequest) {
    const usersEndpoint = `users/accounts/${this._userId }`;
    const updateDetailsEndpoint = `users/details`;

    return this.apiService.get(usersEndpoint).pipe(
      switchMap(userAccount => {
        const {details} = userAccount as UserAccount;
        const userDetailsEndpoint = `${updateDetailsEndpoint}/${details}/`;
        const mappedDetails = this.createUserDetailsRequest(updateRequest, updateRequest.roles)
        return this.apiService.put(userDetailsEndpoint, mappedDetails).pipe(take(1))
      })
    )
  }

  userInfo(): Observable<UserInfo> {
    const usersEndpoint = `users/accounts/${this._userId}`;
    const detailsEndpoint = `users/details`;

    return this.apiService.get(usersEndpoint).pipe(
      switchMap(userAccount => {
        const { details } = userAccount as UserAccount;
        const userDetailsEndpoint = `${detailsEndpoint}/${details}`;
        return forkJoin([
          of(userAccount) as Observable<UserAccount>,
          this.apiService.get(userDetailsEndpoint) as Observable<ApiUserDetails>
        ]);
      }),
      map(([userAccount, userDetails]) => mapApiToUserInfo(userAccount, userDetails)),
      take(1)
    );
  }
}
