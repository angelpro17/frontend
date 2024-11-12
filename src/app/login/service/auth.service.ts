import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gounibackend-production.up.railway.app/api/v1/authentication';

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/sign-in`;
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token); // Almacena el token
          return true;
        }
        return false;
      }),
      catchError(error => {
        console.error('Error during login:', error);
        return of(false);
      })
    );
  }

  register(username: string, password: string, role: string = 'USER'): Observable<any> {
    const url = `${this.apiUrl}/sign-up`;
    const body = { username, password, role };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error during registration:', error);
        return of(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
