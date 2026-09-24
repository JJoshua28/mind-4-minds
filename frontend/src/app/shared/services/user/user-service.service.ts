import {inject, Injectable, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {LocalStorageService} from "../local-storage.service";

import {
  combineLatestWith,
  filter,
  interval,
  map,
  Observable,
  of,
  startWith, Subject,
  Subscription,
  switchMap,
  take,
  tap
} from "rxjs";

import {UserInfo} from "../../../types/user details/user-info.interface";

import {UserRepository} from "../../repositories/user.repository";
import {ApiUserDetails} from "../../../types/api/user-details.interface";
import {mapApiUserInfo} from "../../mapper/api/apiToUser.mapper";
import {Router} from "@angular/router";
import {toObservable} from "@angular/core/rxjs-interop";
import {isPlatformBrowser} from "@angular/common";
import {UserAccount} from "../../../types/api/user-account .interface";


@Injectable({
  providedIn: 'root'
})

export class UserService {
  public readonly subscriptions: Subscription = new Subscription();
  private readonly _router = inject(Router);

  private readonly _localStorageService = inject(LocalStorageService)
  private readonly _userRepository = inject(UserRepository)


  readonly $userAccountId:WritableSignal<string> = signal(this._localStorageService.getItem("user_id") || "");

  readonly unauthorizedRedirect$ = new Subject<void>();

  readonly $userAccount: WritableSignal<UserInfo> = signal<UserInfo>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePic: '',
    occupation: '',
    occupationStartDate: '',
    roles: [],
    joined: '',
    isArchived: false,
    isAdmin: false
  });

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

   constructor () {
     this.isBrowser = isPlatformBrowser(this.platformId);

     if(this.$userAccountId() !== "")
     {
       this.subscriptions.add(interval(30000).pipe(
         startWith(0),
         switchMap(() => this._userRepository.getUserDetailsByAccountId(this.$userAccountId())),
       ).subscribe(
         ( userDetails) => {
           this.$userAccount.set(userDetails);
         }
       ))
     }
     this.unauthorizedRedirect$.subscribe(() => {
       this._router.navigate(['/login']);
     })
   }


  initUserFromStorage(){
    if (!this.isBrowser) {
      // Running on server: skip localStorage access
      return of(false);
    }
    // Safe to access localStorage here
    const data = localStorage.getItem('user');
    return of(data).pipe(
      filter((data) => !!data))
    // ... initialize user from data
  }


  initialiseData (userDetails?: UserAccount){
     if(userDetails)
     {
       const mappedUserDetails = mapApiUserInfo(userDetails);
       this.$userAccount.set(mappedUserDetails);

       return of(mappedUserDetails)
     }
     else
     {
       this.$userAccountId.set(this._localStorageService.getItem("user_id") || "");

       return interval(30000).pipe(
         startWith(0),
         switchMap(() => this._userRepository.getUserById(this.$userAccountId())),
         tap((userDetails) => {
           this.$userAccount.set(userDetails);
         }),
       )

     }

   }

  updateData (userDetailsToUpdate?: Partial<UserInfo>) {
    if(userDetailsToUpdate)
    {
      this.$userAccount.update(userDetails => {
        return {...userDetails, ...userDetailsToUpdate};
      });

      return;
    }

     this._userRepository.getUserDetailsByAccountId(this.$userAccountId()).pipe(
      take(1)
    ).subscribe(
      (userDetails) => {
        this.$userAccount.set(userDetails);
    })

  }

}
