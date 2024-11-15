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
  firstName: string = ''; // Campo para nombres
  lastName: string = ''; // Campo para apellidos
  username: string = ''; // Campo para correo/código institucional
  password: string = ''; // Campo para contraseña
  showPassword = false; // Mostrar/ocultar contraseña
  termsAccepted = false; // Checkbox para términos y condiciones

  // Expresión regular para validar la estructura del correo institucional
  private usernameRegex = /^[uU]\d{9}@(upc\.edu\.pe|pucp\.edu\.pe|unmsm\.edu\.pe)$/;

  constructor(private authService: AuthService, private router: Router) {}

  // Validar si el username tiene la estructura correcta
  isUsernameAllowed(username: string): boolean {
    return this.usernameRegex.test(username);
  }

  // Validación y envío del formulario
  onSubmit() {
    console.log('Iniciando proceso de registro...');

    // Validar términos y condiciones
    if (!this.termsAccepted) {
      console.warn('El usuario no aceptó los Términos y Condiciones.');
      alert('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    // Validar estructura del correo institucional
    if (!this.isUsernameAllowed(this.username)) {
      console.warn('El correo institucional no cumple con el formato requerido.');
      alert('El correo institucional debe tener la estructura válida (uXXXXXXXX@dominio permitido).');
      return;
    }

    // Validar que los campos de nombres y apellidos no estén vacíos
    if (!this.firstName.trim() || !this.lastName.trim()) {
      console.warn('Los campos de nombres y apellidos son obligatorios.');
      alert('Los campos de nombres y apellidos no pueden estar vacíos.');
      return;
    }

    // Preparar datos para el registro
    const registrationData = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      role: 'USER'
    };

    console.log('Datos enviados para registro:', registrationData);

    // Llamar al servicio de autenticación para registrar al usuario
    this.authService.register(registrationData.username, registrationData.password, registrationData.role).subscribe({
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

  // Alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log('Estado de visibilidad de contraseña:', this.showPassword ? 'Visible' : 'Oculta');
  }

  // Navegar a la página de inicio de sesión
  navigateToLogin() {
    console.log('Navegando a la página de inicio de sesión...');
    this.router.navigate(['/login']);
  }
}
