import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) {}

  // Crear chat
  createChat(groupId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/chat/groups/${groupId}`, {});
  }

  // Borrar chat
  deleteChat(chatId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/chat/${chatId}`);
  }

  // Obtener todos los mensajes de un chat
  getAllMessages(chatId: string): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.apiUrl}/users/chat/messages`, { chat_id: chatId });
  }

  // Obtener N mensajes
  getNMessages(chatId: string, n: number): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.apiUrl}/users/chat/messages/n`, {
      chat_id: chatId,
      limit: n,
    });
  }

  // Actualizar un mensaje
  updateMessage(message: Message): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/chat/messages`, message);
  }

  // Borrar un mensaje
  deleteMessage(messageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/chat/messages/${messageId}`);
  }

  // Conectar al WebSocket
  connect(chatId: string): void {
    this.socket = new WebSocket(`wss://tu-backend.com/ws/chat/${chatId}`);
    this.socket.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      this.messageSubject.next(data);
    };
  }

  // Desconectar del WebSocket
  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Enviar mensaje por WebSocket
  sendMessage(message: { chat_id: string; sender_uid: string; message: string }): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  // Observable para escuchar mensajes entrantes
  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }
}
