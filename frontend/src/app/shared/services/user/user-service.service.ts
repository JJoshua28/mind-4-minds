import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from "../local-storage.service";
import {Router} from "@angular/router";
import {HttpService} from "../http.service";
import {concatMap, forkJoin, map, Observable, of, switchMap, take} from "rxjs";
import {AuthServiceService} from "../auth-service.service";
import {UserAccount, UserAccountDetails} from "../../../types/api/user-account .interface";
import {mapApiToUserDetails} from "../../mapper/api/apiToUserDetails.mapper";
import {UserDetails} from "../../../types/user.interface";
import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {UserInfo} from "../../../types/user details/user-info.interface";
import {mapApiToUserInfo} from "../../mapper/api/apiToUserInfo.mapper";
import {mapUserAccountToApiPayload} from "../../mapper/userAccountToApi.mapper";


@Injectable({
  providedIn: 'root'
})

export class UserServiceService {
  private readonly _router = inject(Router)

  private readonly _localStorageService = inject(LocalStorageService)
  private readonly _authService = inject(AuthServiceService)

  private readonly apiService = inject(HttpService)

  private readonly _userId!: string;

  constructor() {
    const authToken = this._authService.getAccessToken();
    const userId = this._localStorageService.getItem("user_id") ;
    if (!authToken || !userId) {
      this._router.navigate(['/login']);
    }

    this._userId = userId as string;
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
