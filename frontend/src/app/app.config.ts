import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {tokenInterceptor} from "./auth/token.interceptor";
import {UserService} from "./shared/services/user/user-service.service";
import {RegistrationService} from "./modules/register/registration.service";



function initUserFactory(userService: UserService) {
  return () => userService.initUserFromStorage(); // <-- Note the `()` here!
}

function initRegistrationFactory(registrationService: RegistrationService) {
  return () => registrationService.initRegistrationFromLocalStorage();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initUserFactory,
      deps: [UserService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initRegistrationFactory,
      deps: [RegistrationService],
      multi: true
    }
  ]
};
