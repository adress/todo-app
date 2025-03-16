import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule]
})
export default class LoginComponent implements OnInit {

  myForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {

    if (window.innerWidth >= 992) {
      document.body.classList.add('imagen-fondo-login');
    }

    this.authService.isAuthenticated().subscribe(
      (resp) => {
        if (resp) {
          this.router.navigateByUrl('/tareas');
          this._snackBar.open(`Bienvenido de nuevo ${this.authService.usuario.username}`, 'ok');
        }
      });
  }

  login() {
    const { username, password } = this.myForm.value;
    this.authService.login(username, password).subscribe({
      next: (ok) => {
        this.router.navigateByUrl('/tareas');
      },
      error: (err) => {
        const verticalPosition = (window.innerWidth >= 992) ? 'bottom' : 'top';
        if (err.status == 400) {
          this._snackBar.open('Credenciales incorrectas intentelo de nuevo', 'ok', { duration: 5 * 1000, verticalPosition });
        } else {
          this._snackBar.open('Algo salio mal', 'ok', { duration: 5 * 1000, verticalPosition });
        }
      }
    });
  }

}
