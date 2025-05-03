import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ChatService, Message } from '../../core/services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,      // trae NgIf, NgForOf, NgClass, DatePipe, etc.
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLDivElement>;

  userId = '';
  groupId = '';
  chatId = '';
  messages: Message[] = [];
  newMessage = '';
  showScrollButton = false;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router      // si usas router.navigate en template
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('userId');
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

  ngAfterViewInit(): void { /** aquí ya puedes acceder a messageContainer **/ }

  initChat() {
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

  loadMessages() {
    this.chatService.getAllMessages(this.chatId).subscribe({
      next: all => {
        this.messages = all;
        this.scrollToBottom(true);
      },
      error: err => console.error('Error cargando mensajes:', err)
    });
  }

  sendMessage() {
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
    this.chatService.sendMessage({ chat_id: this.chatId, sender_uid: this.userId, message: text });
    this.messages.push(temp);
    this.newMessage = '';
    this.scrollToBottom(true);
  }

  scrollToBottom(force = false) {
    setTimeout(() => {
      const el = this.messageContainer.nativeElement;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      if (force || nearBottom) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  onScroll() {
    const el = this.messageContainer.nativeElement;
    this.showScrollButton = el.scrollHeight - el.scrollTop - el.clientHeight > 150;
  }

  deleteMessage(id: string) {
    this.chatService.deleteMessage(id).subscribe({
      next: () => this.messages = this.messages.filter(m => m.id !== id),
      error: e => console.error('Error borrando mensaje:', e)
    });
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
