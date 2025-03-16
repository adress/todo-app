import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, EMPTY } from 'rxjs';
import { Tarea, TareaResponse } from '../interfaces/tarea.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private http: HttpClient,
    private _snackBar: MatSnackBar) { }

  private _baseUrl: string = environment.baseUrl;

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this._baseUrl}/tareas/consultar`);
  }

  getTareasParams(params: any): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this._baseUrl}/tareas/consultar`, { params });
  }

  getTareaById(id: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${this._baseUrl}/tareas/ver/${id}`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 404) {
          this._snackBar.open(err.error.mensaje, 'ok', { duration: 5 * 1000 });
          return EMPTY;
        }
        return throwError(() => err);
      })
    );
  }

  agregarTarea(tarea: Tarea): Observable<TareaResponse> {
    return this.http.post<TareaResponse>(`${this._baseUrl}/tareas/crear`, tarea).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 404 || err.status == 500) {
          this._snackBar.open(err.error.mensaje, 'ok', { duration: 5 * 1000 });
          return EMPTY;
        }
        if (err.status == 400) {
          this._snackBar.open(err.error.mensaje, 'ok', { duration: 5 * 1000 });
        }
        return throwError(() => err);
      })
    );
  };

  actualizarTarea(tarea: Tarea): Observable<TareaResponse> {
    const { id, ...data } = tarea;
    return this.http.put<TareaResponse>(`${this._baseUrl}/tareas/actualizar/${tarea.id}`, data).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status == 404 || err.status == 500) {
          this._snackBar.open(err.error.mensaje, 'ok', { duration: 5 * 1000 });
          return EMPTY;
        }
        if (err.status == 400) {
          this._snackBar.open(err.error.mensaje, 'ok', { duration: 5 * 1000 });
        }
        return throwError(() => err);
      })
    );
  }

  borrarTarea(id: string) {
    return this.http.delete(`${this._baseUrl}/tareas/borrar/${id}`);
  };

}
