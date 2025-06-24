import {inject, Injectable} from '@angular/core';

import {UserType} from "../../types/user-type.enum";

interface UserAccount {
  id: string;
  email: string;
  password: string;
}



import {MenteeInfo, MentorInfo, UserInfo} from "../../types/user details/user-info.interface";
import {map, Observable, of, Subject, switchMap, take, tap} from "rxjs";
import {LocalStorageService} from "../../shared/services/local-storage.service";

import {HttpService} from "../../shared/services/http.service";
import {mapUserFormToApiPayload} from "../../shared/mapper/userDetailsToApi.mapper";
import mapMenteeDetailsToApiPayload from "../../shared/mapper/menteeDetailsToApi.mapper";
import {UserDetails} from "../../types/user.interface";
import {mapMentorDetailsToApiPayload} from "../../shared/mapper/mentorDetailsToApi.mapper";
import {AuthServiceService, AuthToken} from "../../shared/services/auth-service.service";

export interface RegistrationUserDetails extends Omit<UserInfo, 'profilePic'> {
  profilePic: File | null;
  storageProfilePic?: string;
  newPassword: string | null
}

@Injectable({

  providedIn: 'root'
})
export class RegistrationService {
  private _localStorageService = inject(LocalStorageService);
  private readonly apiService = inject(HttpService);
  private readonly _authService = inject(AuthServiceService);

  private _userDetails!: RegistrationUserDetails;
  private _roles: Array<UserType> = [];
  private _menteeDetails!: MenteeInfo;
  private _mentorDetails!: MentorInfo;
  private _navigateToNextSection: Subject<void> = new Subject<void>()
  private _registrationComplete: Subject<UserType[]> = new Subject<UserType[]>()

  constructor() {
    this._roles = this._localStorageService.getItem('roles') || [];
    this._userDetails = {
      ...this._localStorageService.getItem('userDetails'),
      storageProfilePic: this._localStorageService.getItem('profilePic') || undefined,
      profilePic: this._localStorageService.getItem('profilePic') || undefined,

    } as RegistrationUserDetails;
    this._menteeDetails = this._localStorageService.getItem('menteeDetails') as MenteeInfo|| {};
    this._mentorDetails = this._localStorageService.getItem('mentorDetails') as MentorInfo|| {};
  }

  get roles () {
    return this._roles;
  }

  get userDetails () {
    return this._userDetails;
  }

  get menteeDetails () {
    return this._menteeDetails;
  }

  get mentorDetails () {
    return this._mentorDetails;
  }

  addRoles(roles: UserType[]) {
    this._roles = roles;
    this._localStorageService.setItem('roles', roles);
  }

  addUserDetails(details: RegistrationUserDetails) {
    this._userDetails = details;
    const {profilePic, ...rest} = details;
    this._localStorageService.setItem('userDetails', rest);
    if(profilePic) {
      try{
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          this._localStorageService.setItem('profilePic', base64);
        };
        reader.readAsDataURL(profilePic);
      } catch(error) {
        console.log("problem adding profile pic");
      }
    }
  }

  addMenteeDetails(menteeDetails: MenteeInfo) {
    this._menteeDetails = menteeDetails;
    this._localStorageService.setItem('menteeDetails', menteeDetails);
  }

  addMentorDetails(mentorDetails: MentorInfo) {
    this._mentorDetails = mentorDetails;
    this._localStorageService.setItem('mentorDetails', mentorDetails);
  }

  sectionNavigationObserver() {
    return this._navigateToNextSection.asObservable();
  }

  registrationCompleteObserver() {
    return this._registrationComplete.asObservable();
  }

  getAuthenticationToken () {
    const endpoint = "token"
    const {email, newPassword: password} = this.userDetails

    return this.apiService.post(endpoint, {email, password})
  }

  createUserRequest(details: RegistrationUserDetails) {
    const {email, newPassword: password} = details
    return {
      email,
      password,
    }
  }

  createUserDetailsRequest(details: RegistrationUserDetails, roles: UserType[], userId: string): FormData {
    const { storageProfilePic, email, newPassword,...registration } = details;
    const userRegistration = mapUserFormToApiPayload(registration, roles)
    const formData = new FormData();

    for (const key in userRegistration) {
      if (Object.prototype.hasOwnProperty.call(userRegistration, key)) {
        const value = userRegistration[key as keyof typeof userRegistration];

        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      }
    }

    formData.append('user', userId);

    return formData;
  }


  createUser (): Observable<Object> {
    const usersEndpoint = 'users/accounts/';
    const userDetailsEndpoint = 'users/details/';
    const menteeDetailsEndpoint = 'users/mentee-details/';
    const mentorDetailsEndpoint = 'users/mentor-details/';

    const userRequest = this.createUserRequest(this.userDetails);

    return this.apiService.post(usersEndpoint, userRequest).pipe(
      switchMap((user) => {
        const userAccount = user as UserAccount;
        const formData = this.createUserDetailsRequest(this.userDetails, this.roles, userAccount.id);
        try {
          this.apiService.post(userDetailsEndpoint, formData);
        } catch (error) {
          console.log(error);
        }
        return this.apiService.post(userDetailsEndpoint, formData);
      }),
      switchMap((userDetails) => {
        const userDetailsPayload = userDetails as UserDetails;
        if(this.roles.includes(UserType.MENTEE)) {
          const menteeDetailsPayload = mapMenteeDetailsToApiPayload(this.menteeDetails, userDetailsPayload.id);
          return this.apiService.post(menteeDetailsEndpoint, menteeDetailsPayload).pipe(
            map(() => userDetailsPayload)
          );
        }
        return of(userDetailsPayload);
      }),
      switchMap((userDetails) => {
        const userDetailsPayload = userDetails as UserDetails;
        if(this.roles.includes(UserType.MENTOR)) {
          const mentorDetailsPayload = mapMentorDetailsToApiPayload(this.mentorDetails, userDetailsPayload.id);
          return this.apiService.post(mentorDetailsEndpoint, mentorDetailsPayload);
        }
        return of(userDetailsPayload);
      }),
      switchMap(() => {
        return this.getAuthenticationToken()
      }),
      tap((authToken) => {
        this._localStorageService.clear()

        const {access, refresh, user_id} = authToken as AuthToken;

        this._authService.setRefreshToken(refresh);
        this._authService.setAccessToken(access);

        this._localStorageService.setItem("user_id", user_id);

        this._registrationComplete.next(this.roles);
      }),
      take(1)
    );
  }

  navigateToNextSection() {
    this._navigateToNextSection.next();
  }
}
