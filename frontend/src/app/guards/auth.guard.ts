import { inject, Injectable } from "@angular/core";
import { CanMatch, Route, UrlSegment, Router } from "@angular/router";
import { UserService } from "../shared/services/user/user-service.service";
import { LocalStorageService } from "../shared/services/local-storage.service";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch {
  private readonly router = inject(Router);
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly userService = inject(UserService);

  canMatch(): boolean {
    const idFromSignal = this.userService.$userAccountId();
    const idFromStorage: string = this._localStorageService.getItem('user_id') || '';

    const result = !!idFromSignal && idFromStorage.trim() !== '';

    if (!result) {
      this.userService.unauthorizedRedirect$.next();
    }

    return result;
  }


}
