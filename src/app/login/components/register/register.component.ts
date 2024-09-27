import { Component } from '@angular/core';
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule, MatIconButton} from "@angular/material/button";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {HttpClient} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  showPassword = false;
  termsAccepted = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.termsAccepted) {
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    this.authService.checkUserExists(this.email).subscribe(
      (users) => {
        if (users && users.length > 0) {
          alert('Ya existe una cuenta con este correo electrónico.');
        } else {
          const userData = { username: this.username, email: this.email, password: this.password };
          this.authService.register(userData).subscribe(
            () => {
              alert('Registro exitoso. Ahora puedes iniciar sesión.');
              this.router.navigate(['/login']); // Navega al login
            },
            error => {
              console.error('Error al registrar', error);
              alert('Ocurrió un error durante el registro.');
            }
          );
        }
      },
      error => {
        console.error('Error al verificar usuario', error);
        alert('No se pudo verificar el usuario. Por favor, intenta nuevamente.');
      }
    );
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
