import { Injectable } from '@angular/core';
import { Usuario, AuthResponse, Payload } from '../interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { map, of, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  private _baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;
  private _token!: string;

  get usuario(): Usuario {
    if (this._usuario) {
      return { ... this._usuario }; //return copy
    }
    if (localStorage.getItem('usuario')) {
      this._usuario = JSON.parse(localStorage.getItem('usuario') || '') as Usuario;
      return this._usuario;
    }
    return { uid: '', username: '' };
  }

  get token(): string {
    if (this._token) {
      return this._token;
    }
    this._token = localStorage.getItem('token') || '';
    return this._token;
  }

  login(username: string, password: string) {
    const credenciales = btoa('tareasApp' + ':' + 'tareasApp123*');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', username);
    params.set('password', password);

    return this.http.post<AuthResponse>(`${this._baseUrl}/oauth/token`, params.toString(), { headers: httpHeaders }).pipe(
      map((resp) => {
        this.guardarUsuarioToken(resp);
        return true;
      })
    );
  }

  guardarUsuarioToken(resp: AuthResponse) {
    this._usuario = {
      uid: resp.id,
      username: resp.username,
    };
    this._token = resp.access_token;
    localStorage.setItem('token', resp.access_token);
    localStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  obtenerDatosToken(accessToken: string): Payload | null {
    if (accessToken) {
      return JSON.parse(atob(accessToken.split(".")[1])) as Payload;
    }
    return null;
  }

  isAuthenticated(): Observable<boolean> {
    let payload = this.obtenerDatosToken(this.token);
    if (payload?.username) {
      return of(true);
    }
    return of(false);
  }

  logout() {
    this._usuario = { uid: '', username: '' };
    this._token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
}
