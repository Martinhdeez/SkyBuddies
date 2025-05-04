import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {DatePipe, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WebSocketService } from '../../core/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    CdkVirtualScrollViewport,
    NgClass,
    FormsModule,
    DatePipe,
    CdkFixedSizeVirtualScroll,
    ScrollingModule,
    WebSocketService
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  userId = '';
  groupId = '';
  chatId = '';
  messages: Message[] = [];
  newMessage = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private webSocketService: WebSocketService
  ) {}
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userId = this.authService.getUserId() ?? '';

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.groupId = params['groupId'];
      if (this.groupId) {
        this.startChat();
      }
    });
  }


  initChat(groupId: string) {
    // Paso 1: Crear o recuperar el chat por groupId
    this.chatService.createChat(groupId).subscribe({
      next: (res: any) => {
        this.chatId = res.chat_id;

        // Paso 2: Obtener todos los mensajes del chat
        this.chatService.getAllMessages({chat_id: this.chatId}).subscribe({
          next: (response: any) => {
            this.messages = response.messages || [];
          },
          error: (err) => {
            console.error('Error al obtener mensajes:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al crear/obtener chat:', err);
      }
    });
  }

  startChat(): void {
    this.chatService.createChat(this.groupId).subscribe({
      next: (res) => {
        if (!res.id) {
          console.error('❌ Error: res.id es inválido:', res);
          return;
        }
        this.chatId = res.id;
  
        // Obtener mensajes ANTES de conectar WebSocket
        this.loadMessages(() => {
          this.chatService.connect(this.chatId);
  
          this.chatService.onMessage()
            .pipe(takeUntil(this.destroy$))
            .subscribe((msg) => {
              this.messages.push(msg);
              console.log('📩 Mensaje recibido del WebSocket:', msg);
              this.cdr.detectChanges();
            });
        });
      },
      error: (err) => console.error('Error creando chat:', err),
    });
  }
  

  loadMessages(callback?: () => void): void {
    this.chatService.getAllMessages({ chat_id: this.chatId }).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.cdr.detectChanges();
        setTimeout(() => {
          callback?.();
        }, 100);
      }});
  }
  

  sendMessage(): void {
    const text = { type: 'message', data: this.newMessage.trim()}
    this.webSocketService.sendMessage(text);
    this.newMessage = '';
  }
  


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatService.disconnect();
  }
}
