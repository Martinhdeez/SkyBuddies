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
    private cdr: ChangeDetectorRef
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
        this.chatService.getAllMessages(this.chatId).subscribe({
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
        this.chatId = res.chat_id;

        // Obtener mensajes ANTES de conectar WebSocket
        this.loadMessages(() => {
          this.chatService.connect(this.chatId);

          this.chatService.onMessage()
            .pipe(takeUntil(this.destroy$))
            .subscribe((msg) => {
              this.messages.push(msg);
              console.log('📩 Mensaje recibido del WebSocket:', msg);
              this.cdr.detectChanges();
              this.scrollToBottom(true);
            });
        });
      },
      error: (err) => console.error('Error creando chat:', err),
    });
  }

  loadMessages(callback?: () => void): void {
    this.chatService.getAllMessages(this.chatId).subscribe({
      next: (msgs) => {
        this.messages = msgs;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.scrollToBottom(true);
          callback?.();
        }, 100);
      },
      error: (err) => console.error('Error cargando mensajes:', err),
    });
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    const msgToSend = {
      chat_id: this.chatId,
      sender_uid: this.userId,
      message: text
    };

    this.chatService.sendMessage(msgToSend);
    this.newMessage = '';
  }


  scrollToBottom(force = false): void {
    if (!this.viewport) return;
    if (force) {
      this.viewport.checkViewportSize(); // Forzar actualización del scroll
      this.viewport.scrollToIndex(this.messages.length - 1, 'smooth');
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chatService.disconnect();
  }
}
