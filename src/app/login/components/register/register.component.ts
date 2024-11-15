import { Component } from '@angular/core';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgOptimizedImage } from "@angular/common";

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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = ''; // Campo para el correo/código institucional
  password: string = ''; // Campo para la contraseña
  showPassword = false;
  termsAccepted = false;

  // Expresión regular para validar la estructura de los correos
  private usernameRegex = /^[uU]\d{9}@(upc\.edu\.pe|pucp\.edu\.pe|unmsm\.edu\.pe)$/;

  constructor(private authService: AuthService, private router: Router) {}

  // Validar si el username tiene la estructura correcta
  isUsernameAllowed(username: string): boolean {
    return this.usernameRegex.test(username);
  }

  onSubmit() {
    console.log('Iniciando proceso de registro...');
    if (!this.termsAccepted) {
      console.warn('El usuario no aceptó los Términos y Condiciones.');
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    if (!this.isUsernameAllowed(this.username)) {
      console.warn('El código institucional no cumple con el formato requerido.');
      alert('El código institucional debe tener la estructura válida (uXXXXXXXX@dominio permitido).');
      return;
    }

    const username = this.username;
    const password = this.password;
    const role = 'USER';

    console.log('Datos enviados para registro:', { username, password, role });

    this.authService.register(username, password, role).subscribe({
      next: (response) => {
        console.log('Registro exitoso. Respuesta del servidor:', response);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en el proceso de registro:', error);
        alert('No se pudo registrar el usuario. Por favor, intenta nuevamente.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log('Estado de visibilidad de contraseña:', this.showPassword ? 'Visible' : 'Oculta');
  }

  navigateToLogin() {
    console.log('Navegando a la página de inicio de sesión...');
    this.router.navigate(['/login']);
  }
}
