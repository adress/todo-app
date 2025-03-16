import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated()
      .pipe(
        tap(autenticated => {
          console.log('canActivate ', autenticated, 'isTokenExpirado ', this.isTokenExpirado());
          if (!autenticated || this.isTokenExpirado()) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated()
      .pipe(
        tap(autenticated => {
          console.log('canLoad ', autenticated, 'isTokenExpirado ', this.isTokenExpirado());
          if (!autenticated || this.isTokenExpirado()) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

  isTokenExpirado(): boolean {
    const token = this.authService.token;
    const payload = this.authService.obtenerDatosToken(token);
    const now = new Date().getTime() / 1000;
    if (payload) {
      if (payload.exp < now) {
        return true;
      }
    }
    return false;
  }

}
