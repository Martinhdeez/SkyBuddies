import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule }           from '@angular/common';
import { FormsModule }            from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  state,
  query,
  stagger
} from '@angular/animations';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { User, UserService } from '../../core/services/user.service';
import { TimeAgoPipe }     from '../../core/pipes/time-ago.pipe';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    TimeAgoPipe
  ],
  templateUrl: './user.component.html',
  styleUrls:   ['./user.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('buttonHover', [
      state('rest',  style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('rest <=> hover', animate('200ms ease-in-out'))
    ]),
    trigger('inputsAnim', [
      transition(':enter', [
        query('.detail-item, .action-buttons button', [
          style({ opacity: 0, transform: 'translateX(-10px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class UserComponent implements OnInit {
  user!: User;
  isLoading = false;
  isEditing = false;
  editedUser!: User;

  hoverState: Record<string,'rest'|'hover'> = {
    edit:   'rest',
    save:   'rest',
    back:   'rest',
    toggle: 'rest'
  };

  constructor(
    private service: UserService,
    private route:   ActivatedRoute,
    private authService: AuthService,
    private router:  Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.router.navigate(['/index']);
      return;
    }
    this.service.getUserById(userId).subscribe({
      next:   u => this.user = u,
      error: _ => this.router.navigate(['/index'])
    });
  }

  toggleEditMode() {
    if (!this.isEditing) this.editedUser = { ...this.user };
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this.isLoading = true;
    this.service.updateUser(this.user.id, {
      username:  this.editedUser.username,
      email:     this.editedUser.email,
      full_name: this.editedUser.full_name,
      password:  this.editedUser.password
    }).subscribe({
      next:     u => { this.user = u; this.isEditing = false; },
      error:    e => console.error(e),
      complete: () => this.isLoading = false
    });
  }

  deleteAccount() {
    this.isLoading = true;

    this.service.deleteUser(this.user.id ).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/index']);
      },
      error: e => {
        console.error('Error borrando cuenta:', e);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/index']);
  }

  setHover(btn: string, state: 'rest'|'hover') {
    this.hoverState[btn] = state;
  }
}
