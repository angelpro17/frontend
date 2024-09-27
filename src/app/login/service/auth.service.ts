import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://fake-api-go-uni.vercel.app';

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    const user = localStorage.getItem('authUser');
    return user !== null;
  }

  checkUserExists(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/users?email=${email}`)
      .pipe(
        map(users => users.length > 0 ? users : null),
        catchError(this.handleError)
      );
  }

  register(userData: any): Observable<any> {
    return this.checkUserExists(userData.email).pipe(
      map(existingUser => {
        if (existingUser) {
          throw new Error('User already exists');
        }
        return this.http.post(`${this.baseUrl}/users`, userData).pipe(
          catchError(this.handleError)
        );
      }),
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.baseUrl}/users?email=${email}`)
      .pipe(
        map(users => {
          if (users.length > 0 && users[0].password === password) {
            localStorage.setItem('authUser', JSON.stringify(users[0]));
            return true;
          }
          throw new Error('Invalid credentials');
        }),
        catchError(this.handleError)
      );
  }

  logout() {
    localStorage.removeItem('authUser');
    console.log('Usuario desconectado');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
