import { Injectable } from '@angular/core';
import {UserType} from "../../types/user-type.enum";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private _roles: Array<UserType> = [];

  get roles () {
    return this._roles;
  }

  addRoles(roles: UserType[]) {
    this._roles = roles;
  }


}
