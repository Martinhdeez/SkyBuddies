import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  Injectable
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {DatePipe, NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';

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
    CommonModule
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  userId = '';
  groupId = '';
  chatId = '';
  messages: Message[] = [];
  newMessage = '';
  private messageSubscription: Subscription | undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() ?? '';
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.groupId = params['groupId'];
      if (this.groupId) {
        this.initChat();
      }
    });
  }

  initChat(): void {
    // Crear o recuperar chat por groupId
    this.chatService.createChat(this.groupId).subscribe({
      next: (res) => {
        this.chatId = res.id;        // Conectar WebSocket solo después de obtener el chat y mensajes
      },
      error: (err) => {
        console.error('Error al crear/obtener chat:', err);
      }
    });
  }

  generateMessageId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }  

  sendMessage(): void {
    const messageData = {
      sender_uid: this.userId, 
      message: this.newMessage, 
      chat_id: this.chatId,          
    };  
    this.chatService.sendMessage(messageData).subscribe(
      (response) => {
        console.log('Mensaje enviado correctamente:', response);
      },
      (error) => {
        console.error('Error al enviar el mensaje:', error);
      }
    );
    this.newMessage = ''; 
  }

  ngOnDestroy(): void {
    // Unsubscribe de todos los observables al destruir el componente
    this.destroy$.next();
    this.destroy$.complete();
  }
}