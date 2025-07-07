import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../shared/services/auth-service.service';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take, tap,
  throwError
} from 'rxjs';
import {UserService} from "../shared/services/user/user-service.service";

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);

  const skipUrls = ['/api/token', '/api/token/refresh'];
  const skipPostUrls = ['/api/users/details', '/api/users/mentee-details', '/api/users/mentor-details'];

  const shouldSkip = (url: string, list: string[]) => list.some(skip => url.includes(skip));

  if (shouldSkip(req.url, skipUrls)) return next(req);
  if (req.method === 'POST' && shouldSkip(req.url, skipPostUrls)) return next(req);

  const accessToken = authService.getAccessToken();
  let request = req;
  if (accessToken) {
    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, authService: AuthServiceService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    if(!authService.getRefreshToken()) {
      authService.logout();
    }

    return authService.refreshToken().pipe(
      switchMap((tokenResponse: any) => {
        isRefreshing = false;
        authService.setAccessToken(tokenResponse.access);
        refreshTokenSubject.next(tokenResponse.access);
        return next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenResponse.access}`
          }
        }));
      }),
      catchError(err => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token =>
        next(req.clone({
          setHeaders: {
            Authorization: `Bearer ${token!}`
          }
        }))
      )
    );
  }
}
