import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';
import {GroupService} from '../../core/services/group.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ]),
    ]),
    trigger('cardHover', [
      state('rest',   style({ transform: 'scale(1)' })),
      state('hover',  style({ transform: 'scale(1.05)' })),
      transition('rest <=> hover', animate('300ms ease-in-out'))
    ])
  ]
})

export class HomeComponent implements AfterViewInit {
  @ViewChild('flightPath') flightPath?: ElementRef<SVGPathElement>;

  constructor(private router: Router, private groupService: GroupService) {}

  ngAfterViewInit(): void {
    if (!this.flightPath) {
      return;
    }
    const pathEl = this.flightPath.nativeElement;
    const length = pathEl.getTotalLength();
    pathEl.style.setProperty('--path-length', `${length}`);
  }

  currentQuestion = 1;
  hoverState: Record<string, 'rest' | 'hover'> = {
    solo: 'rest',
    accompanied: 'rest',
    private: 'rest',
    public: 'rest'
  };
  showGroupInput = true;
  groupCode = '';
  joinError: string | null = null;

  onSelectSolo()        { this.router.navigate(['/filters']).then(r => console.log('Navigated:', r)); }
  onSelectAccompanied() { this.currentQuestion = 2; }
  /** Comprueba si existe el grupo; si no, muestra error */
  onJoinGroup() {
    const code = this.groupCode.trim();
    if (!code) return;
    this.joinError = null;
    this.groupService.getGroupByCode(code).subscribe({
      next: () => {
        // Si el endpoint devolvió 200, redirigimos
        this.router.navigate(['/join'], { queryParams: { code } });
      },
      error: err => {
        console.error('Group lookup failed', err);
        this.joinError = 'Invalid group code. Please try again.';
      }
    });
  }
  onSelectPublic()      { this.router.navigate(['/connections']).then(r => console.log('Navigated:', r)); }
  setHover(card: 'solo'|'accompanied'|'private'|'public', state: 'rest' | 'hover') {
    this.hoverState[card] = state;
  }
}
