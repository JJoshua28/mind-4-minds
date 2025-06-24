import {inject, Injectable} from '@angular/core';
import {LocalStorageService} from "./local-storage.service";
import {Router} from "@angular/router";
import {HttpService} from "./http.service";

export interface AuthToken {
  access: string;
  refresh: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly _localStorageService = inject(LocalStorageService)
  private _router = inject(Router);
  private readonly httpService = inject(HttpService)

  getAccessToken(): string | null {
    return this._localStorageService.getItem('auth_token');
  }


  getRefreshToken(): string | null {
    return this._localStorageService.getItem('refresh_token');
  }

  setAccessToken(token: string) {
    this._localStorageService.setItem('auth_token', token);
  }

  setRefreshToken(token: string) {
    this._localStorageService.setItem('refresh_token', token);
  }

  refreshToken() {
    const refresh = this.getRefreshToken();
    return this.httpService.post('token/refresh', { refresh });
  }

  logout() {
    this._localStorageService.clear();
    this._router.navigate(['/login']);
  }
}
