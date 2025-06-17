import { Injectable } from '@angular/core';

import {UserType} from "../../types/user-type.enum";

import {MenteeInfo, MentorInfo, UserInfo} from "../../types/user details/user-info.interface";
import {Subject} from "rxjs";

export interface RegistrationUserDetails extends Omit<UserInfo, 'profilePic'> {
  currentPassword?: string | null | undefined
  profilePic: File | null
  email: string
  newPassword: string | null
}

@Injectable({

  providedIn: 'root'
})
export class RegistrationService {
  private _userDetails!: RegistrationUserDetails;
  private _roles: Array<UserType> = [];
  private _menteeDetails!: MenteeInfo;
  private _mentorDetails!: MentorInfo;
  private _navigateToNextSection: Subject<void> = new Subject<void>();

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

  addRoles(
    roles: UserType[]) {
    this._roles = roles;
  }

  addUserDetails(details: RegistrationUserDetails) {
    this._userDetails = details;
  }

  addMenteeDetails(menteeDetails: MenteeInfo) {
    this._menteeDetails = menteeDetails;
  }

  addMentorDetails(mentorDetails: MentorInfo) {
    this._mentorDetails = mentorDetails;
  }

  sectionNavigationObserver() {
    return this._navigateToNextSection.asObservable();
  }

  navigateToNextSection() {
    this._navigateToNextSection.next();
  }
}
