import {inject, Injectable, PLATFORM_ID, signal, WritableSignal} from '@angular/core';
import {LocalStorageService} from "../local-storage.service";

import {
  BehaviorSubject,
  filter,
  of,
  Subject,
  Subscription,
  take,
  tap
} from "rxjs";

import {UserInfo} from "../../../types/user details/user-info.interface";

import {UserRepository} from "../../repositories/user.repository";
import {Router} from "@angular/router";
import {isPlatformBrowser} from "@angular/common";
import {UserAccount} from "../../../types/api/user-account .interface";
import {mapApiToUserInfo} from "../../mapper/api/apiToUserInfo.mapper";


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

  readonly userAccount$: BehaviorSubject<UserInfo> = new BehaviorSubject(this.$userAccount())

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

   constructor () {
     this.isBrowser = isPlatformBrowser(this.platformId);

     if(this.$userAccountId() !== "")
     {
       this.subscriptions.add(this._userRepository.getUserInfoById(this.$userAccountId()).pipe(
         take(1),
       ).subscribe(
         (userInfo) => {
           this.userAccount$.next(userInfo);
         }
       ))
    }
     this.subscriptions.add(this.userAccount$.subscribe((userInfo) =>{
       this.$userAccount.set(userInfo)
     }
     ))
     this.subscriptions.add(this.unauthorizedRedirect$.subscribe(() => {
       this._router.navigate(['/login']);
     }))
   }

// look into this later
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


  initialiseData (userInfo?: UserAccount){
     if(userInfo)
     {
       const mappedUserInfo = mapApiToUserInfo(userInfo);
       this.userAccount$.next(mappedUserInfo);

       return of(mappedUserInfo)
     }
     else
     {
       this.$userAccountId.set(this._localStorageService.getItem("user_id") || "");
       return this._userRepository.getUserInfoById(this.$userAccountId()).pipe(
         take(1),
         tap(userInfo => {
           this.userAccount$.next(userInfo);
         })
       )
     }

   }

  updateData (userInfoUpdate?: Partial<UserInfo>) {
    if(userInfoUpdate)
    {
      this.userAccount$.next({...this.$userAccount(), ...userInfoUpdate});
      return of(this.$userAccount());
    }

     return this._userRepository.getUserInfoById(this.$userAccountId()).pipe(
      take(1),
      tap(userInfo => {
        this.userAccount$.next(userInfo);
      }))
  }

}
