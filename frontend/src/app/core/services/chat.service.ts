import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Message {
  id: string;
  sender_uid: string;
  chat_id: string;
  message: string;
  created_at?: string;     /* ← el backend suele devolver ISO‑date */
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  /* GET /users/chat/messages/{chat_id} */
  getAllMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.apiUrl}/users/chat/messages/${chatId}`
    );
  }

  /* GET /users/chat/messages/n/{chat_id}?n&incr */
  getNMessages(chatId: string, n = 50, incr = 0): Observable<Message[]> {
    const params = new HttpParams()
      .set('n', n)
      .set('incr', incr);
    return this.http.get<Message[]>(
      `${this.apiUrl}/users/chat/messages/n/${chatId}`, { params }
    );
  }

  /* POST /users/chat/messages/add */
  addMessage(data: { sender_uid: string; message: string; chat_id: string }):
    Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/users/chat/messages/add`, data
    );
  }

  /* PUT y DELETE disponibles si los necesitas */
  updateMessage(payload: { message_id: string; message: string }) {
    return this.http.put<string>(`${this.apiUrl}/users/chat/messages`, payload);
  }
  deleteMessage(messageId: string) {
    return this.http.delete<string>(
      `${this.apiUrl}/users/chat/messages/${messageId}`
    );
  }
}
