import {inject, Injectable} from '@angular/core';

import {UserType} from "../../types/user-type.enum";

import {MenteeInfo, MentorInfo, UserInfo} from "../../types/user details/user-info.interface";
import {Subject} from "rxjs";
import {LocalStorageService} from "../../shared/services/local-storage.service";

export interface RegistrationUserDetails extends Omit<UserInfo, 'profilePic'> {
  profilePic: File | null
  storageProfilePic?: string;
  email: string
  newPassword: string | null
}

@Injectable({

  providedIn: 'root'
})
export class RegistrationService {
  private _localStorageService = inject(LocalStorageService);

  private _userDetails!: RegistrationUserDetails;
  private _roles: Array<UserType> = [];
  private _menteeDetails!: MenteeInfo;
  private _mentorDetails!: MentorInfo;
  private _navigateToNextSection: Subject<void> = new Subject<void>();

  constructor() {
    this._roles = this._localStorageService.getItem('roles') || [];
    this._userDetails = {
      ...this._localStorageService.getItem('userDetails'),
      storageProfilePic: this._localStorageService.getItem('profilePic') || undefined,
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

  navigateToNextSection() {
    this._navigateToNextSection.next();
  }
}
