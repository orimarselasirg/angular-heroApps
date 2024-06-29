import { Injectable, Pipe, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, map, pipe, tap } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';

@Injectable({providedIn: 'root'})
export class AuthGuard {
  constructor(private route: Router) { }

  // canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean>{
  //   console.log('canMatch');
  //   console.log({route, segments});
  //   return true
  // }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
  //   console.log('canActivate');
  //   console.log({route, state});
  //   return true
  // }
}

// export const AuthGuardMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
//   return Inject(AuthGuard).canMatch(route, segments)
// }
// export const AuthGuardActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
//   return Inject(AuthGuard).canMatch(route, state)
// }

const checkAuthStatus = (): Observable<boolean> => {
  const authService = inject(AuthServiceService)
  const router = inject(Router)
  return authService.checkAuth()
    .pipe(
      tap(isAuth => console.log('is Authenticated ', isAuth)),
      tap( isAuth => {
        if(isAuth) {
          router.navigate(['/heroes/list'])
        }
      }),
      map(isAuth => !isAuth)
    )
}

const checkLoginStatus = (): Observable<boolean> => {
  const authService = inject(AuthServiceService)
  const router = inject(Router)
  return authService.checkAuth()
    .pipe(
      tap(isAuth => console.log('is Authenticated ', isAuth)),
      tap( isAuth => {
        if(!isAuth) {
          router.navigate(['/auth/login'])
        }
      })
    )
}

export const AuthGuardMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
 return checkLoginStatus()
}

export const AuthGuardActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
  console.log('canActivate');
  return checkLoginStatus()
}

export const PublicGuardActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
  console.log('canActivate');
  return checkAuthStatus()
}


