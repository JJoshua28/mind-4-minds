import { Injectable } from '@angular/core';
import {UserType} from "../../types/user-type.enum";
import {MenteeDetails} from "../../types/user details/mentee.interface";

export interface RegistrationUserDetails {
  firstName: string
  lastName: string
  occupation: string | null
  occupationStartDate: string | null
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
  private _menteeDetails!: MenteeDetails;

  get roles () {
    return this._roles;
  }

  get userDetails () {
    return this._userDetails;
  }

  get menteeDetails () {
    return this._menteeDetails;
  }

  addRoles(
    roles: UserType[]) {
    this._roles = roles;
  }

  addUserDetails(details: RegistrationUserDetails) {
    this._userDetails = details;
  }

  addMenteeDetails(menteeDetails: MenteeDetails) {
    this._menteeDetails = menteeDetails;
  }
}
