import {
  Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService, Message } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { Location } from '@angular/common';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { Subject, interval, of, throwError } from 'rxjs';
import {
  takeUntil, startWith, switchMap, catchError
} from 'rxjs/operators';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [
    CdkVirtualScrollViewport,
    FormsModule,
    ScrollingModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  private readonly POLL_MS = 2000;
  private readonly INITIAL_BATCH = 50;
  private destroy$ = new Subject<void>();

  userId = '';
  groupId = '';
  chatId = '';
  messages: Message[] = [];
  newMessage = '';

  constructor(
    private chatSvc: ChatService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  /* ---------------- ciclo ---------------- */
  ngOnInit(): void {
    this.userId = this.auth.getUserId() ?? '';
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.groupId = params['groupId'];
      if (!this.groupId) return;

      this.chatId = this.groupId;                         // simplificación
      this.loadCache();
      this.loadInitial();
      this.startPolling();
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  /* ---------------- cache ---------------- */
  private cacheKey(): string { return `msgs-${this.chatId}`; }
  private loadCache(): void {
    const raw = sessionStorage.getItem(this.cacheKey());
    if (raw) {
      try { this.messages = JSON.parse(raw) as Message[]; this.refresh(); } catch {}
    }
  }
  private saveCache(): void {
    sessionStorage.setItem(this.cacheKey(), JSON.stringify(this.messages));
  }

  /* -------- carga inicial -------- */
  private loadInitial(): void {
    this.chatSvc.getNMessages(this.chatId, this.INITIAL_BATCH)
      .pipe(
        catchError(err => err.status === 404 ? of([] as Message[]) : throwError(() => err)),
        takeUntil(this.destroy$)
      )
      .subscribe(msgs => { this.messages = msgs; this.saveCache(); this.refresh(); });
  }

  /* -------- polling -------- */
  private startPolling(): void {
    interval(this.POLL_MS).pipe(
      startWith(0),
      switchMap(() =>
        this.chatSvc.getAllMessages(this.chatId).pipe(
          catchError(err => err.status === 404 ? of([] as Message[]) : throwError(() => err))
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(msgs => { this.messages = msgs; this.saveCache(); this.refresh(); });
  }

  /* -------- enviar -------- */
  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text) return;

    this.chatSvc.addMessage({ sender_uid: this.userId, message: text, chat_id: this.chatId })
      .subscribe({
        next: saved => {
          this.messages.push(saved);
          this.saveCache();
          this.refresh();
          this.newMessage = '';
        },
        error: err => console.error('[Chat] send error', err)
      });
  }

  /* -------- helpers UI -------- */
  private refresh(): void {
    this.cdr.detectChanges();
    if (this.viewport && this.messages.length) {
      this.viewport.scrollToIndex(this.messages.length - 1);
    }
  }
  goBack(): void { this.location.back(); }
}
