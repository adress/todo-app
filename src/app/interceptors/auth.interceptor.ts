import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', err.error.message);
          snackBar.open('Algo salió mal, intente de nuevo', 'ok', { duration: 5000 });
          return throwError(() => err);
        } else {
          if (err.status === 401) {
            if (authService.isAuthenticated()) {
              authService.logout();
              router.navigate(['/login']);
            } else {
              // try to sing in again
              return throwError(() => err);
            }
          }

          if (err.status === 403) {
            const mensaje = err.error.mensaje || 'No tienes permisos para realizar esta acción';
            snackBar.open(mensaje, 'ok', { duration: 5000 });
            router.navigate(['/tareas']);
            return throwError(() => err);
          }

          return throwError(() => err);
        }
      }
      return throwError(() => err);
    })
  );
};
