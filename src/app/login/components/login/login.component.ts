import { Component } from '@angular/core';
import { MatCard } from "@angular/material/card";
import { FormsModule } from "@angular/forms";
import { MatFormField, MatFormFieldModule } from "@angular/material/form-field";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";

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
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.username && this.password) {
      console.log('Attempting to log in...');
      this.authService.login(this.username, this.password).subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            console.log('Login successful. Connection with backend established.');
            this.router.navigate(['/home']);
          } else {
            console.log('Login failed. Invalid credentials.');
            alert('Credenciales incorrectas. Inténtalo de nuevo.');
          }
        },
        (error) => {
          console.error('Error en la autenticación:', error);
          alert('Error en el servidor. Inténtalo de nuevo más tarde.');
        }
      );
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
