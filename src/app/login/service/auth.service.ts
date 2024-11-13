// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gounibackend-production.up.railway.app/api/v1/authentication';
  private apiUrl2 = 'https://deploynew.onrender.com/api/v1/authentication';

  constructor(private http: HttpClient) {}

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método de inicio de sesión que intenta ambos enlaces
  login(username: string, password: string): Observable<boolean> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Primer intento con apiUrl
    return this.http.post<any>(`${this.apiUrl}/sign-in`, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          // Almacena el token en localStorage
          localStorage.setItem('token', response.token);
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error during login with apiUrl:', error);
        // Si falla, intenta con apiUrl2
        return this.http.post<any>(`${this.apiUrl2}/sign-in`, body, { headers }).pipe(
          map(response => {
            if (response && response.token) {
              localStorage.setItem('token', response.token);
              return true;
            }
            return false;
          }),
          catchError(error => {
            console.error('Error during login with apiUrl2:', error);
            return of(false);
          })
        );
      })
    );
  }

  // Método de registro que intenta ambos enlaces
  register(username: string, password: string, role: string = 'USER'): Observable<any> {
    const body = { username, password, role };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Primer intento con apiUrl
    return this.http.post<any>(`${this.apiUrl}/sign-up`, body, { headers }).pipe(
      catchError(error => {
        console.error('Error during register with apiUrl:', error);
        // Si falla, intenta con apiUrl2
        return this.http.post<any>(`${this.apiUrl2}/sign-up`, body, { headers }).pipe(
          catchError(error => {
            console.error('Error during register with apiUrl2:', error);
            return of(null);
          })
        );
      })
    );
  }

  // Método para verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Método de logout para eliminar el token
  logout(): void {
    localStorage.removeItem('token');
  }
}
