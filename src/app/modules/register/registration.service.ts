import { Injectable } from '@angular/core';
import {UserType} from "../../types/user-type.enum";

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
  _roles: Array<UserType> = [];

  get roles () {
    return this._roles;
  }

  get userDetails () {
    return this._userDetails;
  }

  addRoles(
    roles: UserType[]) {
    this._roles = roles;
  }

  addUserDetails(details: RegistrationUserDetails) {
    this._userDetails = details;
  }
}
