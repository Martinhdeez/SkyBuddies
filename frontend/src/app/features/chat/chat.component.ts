import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ScrollingModule,
  CdkVirtualScrollViewport
} from '@angular/cdk/scrolling';

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
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  userId    = '';
  groupId   = '';
  chatId    = '';
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
    // Forzamos a CDK a recalcular la altura del viewport ahora que el CSS está aplicado
    setTimeout(() => this.viewport.checkViewportSize(), 100);
  }

  initChat(): void {
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

  loadMessages(): void {
    this.chatService.getAllMessages(this.chatId).subscribe({
      next: all => {
        this.messages = all;
        // un tick para que lleguen y luego scroll
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

    // Enviar mensaje al servicio
    this.chatService.sendMessage({
      chat_id: this.chatId,
      sender_uid: this.userId,
      message: text
    });

    // Añadir el mensaje temporal para actualizar la UI
    this.messages.push(temp);

    // Vaciar el input
    this.newMessage = '';

    // Actualizar el scroll para el nuevo mensaje
    setTimeout(() => {
      this.scrollToBottom(true);
    }, 50); // Ajusta el tiempo si es necesario



  this.chatService.sendMessage({
      chat_id: this.chatId,
      sender_uid: this.userId,
      message: text
    });

    this.messages.push(temp);
    this.newMessage = '';
    this.scrollToBottom(true);
  }

  scrollToBottom(force = false): void {
    const count = this.messages.length;
    if (!this.viewport) return;

    if (force) {
      this.viewport.scrollToIndex(count - 1, 'smooth');
    } else {
      const rendered = this.viewport.getRenderedRange();
      if (count - 1 >= rendered.end - 1) {
        this.viewport.scrollToIndex(count - 1, 'smooth');
      }
    }
  }


  ngOnDestroy(): void {
      this.chatService.disconnect();
    }
}
