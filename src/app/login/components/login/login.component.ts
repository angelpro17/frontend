import { Component } from '@angular/core';
import {MatCard} from "@angular/material/card";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import { MatInputModule} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCard,
    MatFormFieldModule,
    MatFormField,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIcon
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Método para iniciar sesión
  onSubmit() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          // Redirige a la app después de autenticarse
          this.router.navigate(['/home']);
        } else {
          alert('Credenciales incorrectas. Inténtalo de nuevo.');
        }
      });
    }
  }

  // Alternar visibilidad de la contraseña
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Navegar a la página de registro
  navigateToRegister() {
    this.router.navigate(['/register']);
  }


}
