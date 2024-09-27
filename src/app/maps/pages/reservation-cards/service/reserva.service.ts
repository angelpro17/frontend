import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'https://fake-api-go-uni.vercel.app/reservas';  // URL de la API de reservas

  constructor(private http: HttpClient) {}

  // Obtener todas las reservas
  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        retry(2), // Reintentar 2 veces en caso de error
        catchError(this.handleError) // Manejar errores
      );
  }

  // Agregar una nueva reserva
  addReserva(reserva: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reserva)
      .pipe(
        catchError(this.handleError) // Manejar errores
      );
  }

  // Obtener una reserva específica por ID
  getReservaById(reservaId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${reservaId}`)
      .pipe(
        catchError(this.handleError) // Manejar errores
      );
  }

  // Actualizar una reserva existente
  updateReserva(reservaId: number, updatedReserva: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${reservaId}`, updatedReserva)
      .pipe(
        catchError(this.handleError) // Manejar errores
      );
  }

  // Eliminar una reserva
  deleteReserva(reservaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reservaId}`)
      .pipe(
        catchError(this.handleError) // Manejar errores
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '¡Ha ocurrido un error desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del backend
      errorMessage = `Código de Error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
