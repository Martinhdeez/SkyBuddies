import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService }   from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import {
  ScrollingModule,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';
import {
  trigger, transition, style, animate, query, stagger
} from '@angular/animations';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('listAnim', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  userId     = '';
  groupId    = '';
  chatId     = '';
  messages: Message[] = [];
  newMessage = '';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const stored = this.authService.getUserId();
    if (!stored) {
      console.warn('No se encontró userId');
      return;
    }
    this.userId = stored;
    this.route.params.subscribe(p => {
      this.groupId = p['groupId'];
      this.initChat();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.viewport.checkViewportSize());
  }

  private initChat(): void {
    this.chatService.createChat(this.groupId).subscribe({
      next: res => {
        this.chatId = res.chat_id;
        this.chatService.connect(this.chatId);
        this.chatService.onMessage().subscribe(msg => {
          this.messages.push(msg);
          this.scrollToBottom();
        });
        this.loadMessages();
      },
      error: err => console.error('Error iniciando el chat:', err)
    });
  }

  private loadMessages(): void {
    this.chatService.getAllMessages(this.chatId).subscribe({
      next: all => {
        this.messages = all;
        setTimeout(() => this.scrollToBottom(true));
      },
      error: err => console.error('Error cargando mensajes:', err)
    });
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    const temp: Message = {
      id: crypto.randomUUID(),
      chat_id: this.chatId,
      sender_uid: this.userId,
      message: text,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.chatService.sendMessage({
      chat_id: this.chatId,
      sender_uid: this.userId,
      message: text
    });

    this.messages.push(temp);
    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(true), 50);
  }

  scrollToBottom(force = false): void {
    const count = this.messages.length;
    if (!this.viewport) return;
    if (force) {
      this.viewport.scrollToIndex(count - 1, 'smooth');
    } else {
      const { start, end } = this.viewport.getRenderedRange();
      if (count - 1 >= end - 1) {
        this.viewport.scrollToIndex(count - 1, 'smooth');
      }
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
