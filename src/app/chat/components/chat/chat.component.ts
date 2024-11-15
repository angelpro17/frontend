import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from "../../../home/components/toolbar/toolbar.component";
import { ChatService } from "../../services/chat.service";
import { ChatMessage } from "../../models/chat-message";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {AuthService} from "../../../login/service/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarComponent,
    MatSnackBarModule
  ]
})
export class ChatComponent implements OnInit {
  messageInput: string = '';
  userId: string = '';
  messageList: any[] = [];
  isLoading: boolean = true;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {
    const currentUser = this.authService.getLoggedInUser();
    this.userId = currentUser ? currentUser.username : 'Guest';
  }

  ngOnInit(): void {
    console.log('Chat initialized for user:', this.userId);
    this.setupChat();
  }

  private setupChat(): void {
    this.chatService.getMessages().subscribe(
      messages => {
        this.messageList = messages.map(item => ({
          ...item,
          message_side: item.user === this.userId ? 'sender' : 'receiver'
        }));
        this.isLoading = false;
        console.log('Messages loaded:', this.messageList);
      },
      error => {
        console.error('Error receiving messages:', error);
        this.isLoading = false;
      }
    );
  }

  async sendMessage(): Promise<void> {
    if (!this.messageInput?.trim()) {
      return;
    }

    try {
      const message: ChatMessage = {
        message: this.messageInput.trim(),
        user: this.userId
      };

      console.log('Sending message:', message);
      await this.chatService.sendMessage(message);
      console.log('Message sent successfully');
      this.messageInput = '';
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}
