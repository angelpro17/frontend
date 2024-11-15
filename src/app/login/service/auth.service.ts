import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gouniprojectdeploy-production.up.railway.app/api/v1/authentication';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/sign-in`;
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('Sending login request to backend...');
    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        if (response && response.token) {
          console.log('Login successful. Token received from backend.');
          localStorage.setItem('token', response.token);
          const user: User = { username, role: response.role || 'USER' };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return true;
        }
        console.log('Login failed. No token received from backend.');
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

    console.log('Sending registration request to backend...');
    return this.http.post<any>(url, body, { headers }).pipe(
      tap(response => console.log('Registration successful. Response from backend:', response)),
      catchError(error => {
        console.error('Error durante el registro:', error);
        return of(null);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserValue;
  }

  logout(): void {
    console.log('Logging out user...');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('User logged out successfully.');
  }

  getLoggedInUser(): User | null {
    return this.currentUserValue;
  }
}
