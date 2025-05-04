// src/app/features/group/group.component.ts
import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule }   from '@angular/common';
import { Router } from '@angular/router';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { AuthService }     from '../../core/services/auth.service';
import { GroupService, Group } from '../../core/services/group.service';
import { UserService, User } from '../../core/services/user.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
  animations: [
    trigger('listAnim', [
      transition('* <=> *', [
        query('.group-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('300ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      state('rest',  style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.04)' })),
      transition('rest <=> hover', animate('200ms ease-in-out'))
    ])
  ]
})
export class GroupComponent implements OnInit {
  private myGroups: Group[] = [];
  groups: Group[] = [];
  hoverState: Record<string,'rest'|'hover'> = {};
  searchControl = new FormControl('');
  
  visibleParticipants: Record<string, boolean> = {};
  participants: Record<string, User[]> = {};

  constructor(
    private svc:    GroupService,
    private auth:   AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const me = this.auth.getUserId()!;

    this.svc.getGroupsByUser(me).subscribe(userGroups => {
      this.myGroups = userGroups;
      this.applyList(this.myGroups);
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(term => this.applyFilter(term || ''));
  }

  private applyFilter(term: string) {
    const q = term.trim().toLowerCase();
    if (!q) {
      this.applyList(this.myGroups);
    } else {
      const filtered = this.myGroups.filter(g =>
        g.name.toLowerCase().includes(q)
      );
      this.applyList(filtered);
    }
  }

  private applyList(arr: Group[]) {
    this.groups = arr;
    this.hoverState = {};
    arr.forEach(g => this.hoverState[g.id] = 'rest');
  }

  onCardEnter(id: string) { this.hoverState[id] = 'hover'; }
  onCardLeave(id: string) { this.hoverState[id] = 'rest'; }

  goToCreate() {
    this.router.navigate(['/groups/new']);
  }

  goToChat(groupId: string) {
    this.router.navigate(['/users/chat/groups', groupId]);
  }

  showParticipants(groupId: string) {
    this.visibleParticipants[groupId] = true;
  
    if (!this.participants[groupId]) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        const requests = group.members.map(uid =>
          this.userService.getUserById(uid).pipe(catchError(() => of(null)))
        );
  
        forkJoin(requests).subscribe(users => {
          this.participants[groupId] = users.filter(u => u !== null) as User[];
        });
      }
    }
  }
  
  hideParticipants(groupId: string) {
    this.visibleParticipants[groupId] = false;
  }
  
  
}
