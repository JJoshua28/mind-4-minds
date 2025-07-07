import {inject, Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";

import {RegistrationService} from "../modules/register/registration.service";
import {LocalStorageService} from "../shared/services/local-storage.service";
import {UserType} from "../types/user-type.enum";

@Injectable({ providedIn: 'root' })
export class RolesGuard implements CanActivate {

  private readonly router = inject(Router);
  private readonly _registrationService = inject(RegistrationService);
  private readonly _localStorageService = inject(LocalStorageService);


  canActivate(): boolean {
    const rolesFromSignal = this._registrationService.roles;
    const rolesFromStorage: UserType[] = this._localStorageService.getItem('roles') || [];

    if (rolesFromSignal.length < 1 || rolesFromStorage.length < 1)
    {
      this.router.navigate(['/register/roles']);
      return false;
    }

    return true;
  }

}
