import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebSocketService } from './socket.service';

export interface Message {
  id: string;
  sender_uid: string;
  chat_id: string;
  message: string;
  updated_at: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  private socket: WebSocket | null = null;
  private messageSubject = new Subject<Message>();

  constructor(
    private http: HttpClient, 
    private webSocketService: WebSocketService
  ) {}

  /**
   * Create a new chat.
   * @param groupId The ID of the group to create the chat for.
   */
  createChat(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/chat/groups/${groupId}`, {});
  }

  /**
   * Get all chats for a user.
   * @param chatId The ID of the chat to retrieve.
   */
  deleteChat(chatId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/chat/${chatId}`);
  }

  /**
   * Get all chats for a user.
   * @param chatId The ID of the chat to retrieve.
   */
  getAllMessages(payload: { chat_id: string }): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.apiUrl}/users/chat/messages`, payload);
  }
  
  

  /**
   * Get the last N messages from a chat.
   * @param chatId The ID of the chat to retrieve messages from.
   * @param n The number of messages to retrieve.
   */
  getNMessages(chatId: string, n: number): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.apiUrl}/users/chat/messages/n`, {
      chat_id: chatId,
      limit: n,
    });
  }

  /**
   * Update a message.
   * @param message The message object to update.
   */
  updateMessage(message: Message): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/chat/messages`, message);
  }

  /**
   * Delete a message.
   * @param messageId The ID of the message to delete.
   */
  deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/chat/messages/${messageId}`);
  }

  /**
   * Connect to a WebSocket for a specific chat.
   * @param chatId The ID of the chat to connect to.
   */
  connect(chatId: string): void {
    if (!chatId) {
      console.error('Chat ID no definido.');
      return;
    }

    if (this.socket) {
      this.disconnect(); // Cierra si hay uno abierto
    }

    this.socket = new WebSocket(`wss://${this.apiUrl}/users/chat/${chatId}`);

    this.socket.onopen = () => {
      console.log('✅ WebSocket conectado');
    };

    this.socket.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      this.messageSubject.next(data);
    };

    this.socket.onerror = (err) => {
      console.error('WebSocket error', err);
    };

    this.socket.onclose = () => {
      console.warn('WebSocket cerrado');
    };
  }



  /**
   * Disconnect from the WebSocket.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Send a message through the WebSocket.
   * @param message The message object to send.
   */
  sendMessage(data: { chat_id: string }) {
    return this.http.post<Message[]>(`${this.apiUrl}/users/chat/messages`, data);
  }

  /**
   * Listen for incoming messages.
   */
  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }
}
