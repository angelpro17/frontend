import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { ChatMessage } from "../models/chat-message";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messageSubject = new BehaviorSubject<ChatMessage[]>([]);
  private apiUrl = 'https://gouniprojectdeploy-production.up.railway.app/api/v1/chat';
  private pollingInterval = 2000; // Poll every 2 seconds

  constructor(
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {
    console.log('Chat service initialized');
    this.startPolling();
  }

  private startPolling(): void {
    console.log('Starting message polling');
    interval(this.pollingInterval).subscribe(() => {
      this.loadMessages().catch(error => {
        console.error('Error polling messages:', error);
      });
    });
  }

  async sendMessage(message: ChatMessage): Promise<void> {
    try {
      console.log('Sending message to backend:', message);
      await this.httpClient.post(`${this.apiUrl}/send`, message).toPromise();
      console.log('Message sent successfully');
      await this.loadMessages(); // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
      this.showError('Error al enviar mensaje');
      throw error;
    }
  }

  private async loadMessages(): Promise<void> {
    try {
      console.log('Loading messages from backend');
      const messages = await this.httpClient
        .get<ChatMessage[]>(`${this.apiUrl}/messages`)
        .toPromise();

      if (messages) {
        console.log('Messages received:', messages);
        this.messageSubject.next(messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      this.showError('Error al cargar mensajes');
      throw error;
    }
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messageSubject.asObservable();
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
