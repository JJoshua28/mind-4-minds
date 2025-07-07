import {Injectable, PLATFORM_ID, inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly platformId = inject(PLATFORM_ID)

  setItem<T>(key: string, value: T): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);
      } catch (error) {
        console.error('localStorage setItem failed', error);
      }
    }
  }

  getItem<T>(key: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) as T : null;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
}
