// src/app/features/group/new-group.component.ts
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
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
  private userPrivateGroups: Group[] = [];
  groups: Group[] = [];
  hoverState: Record<string,'rest'|'hover'> = {};
  searchControl = new FormControl('');

  constructor(
    private svc:    GroupService,
    private auth:   AuthService,
    private router: Router
  ) {}

  ngOnInit() {

    const me = this.auth.getUserId()!;

    this.svc.getGroups().subscribe(all => {
      this.userPrivateGroups = all.filter(g =>
        g.visibility === 'private' &&
        g.members.includes(me)
      );
      this.applyList(this.userPrivateGroups);
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(term => this.applyFilter(term || ''));
  }

  /** Sin término → privados. Con término → busca y filtra solo públicos */
  private applyFilter(term: string) {
    const q = term.trim().toLowerCase();
    if (!q) {
      this.applyList(this.userPrivateGroups);
    } else {
      this.svc.searchGroups(q, 20).subscribe(list => {
        const pubs = list.filter(g => g.visibility === 'public');
        this.applyList(pubs);
      });
    }
  }

  /** Actualiza la vista y el estado hover */
  private applyList(arr: Group[]) {
    this.groups = arr;
    this.hoverState = {};
    arr.forEach(g => this.hoverState[g.id] = 'rest');
  }

  onCardEnter(id: string) { this.hoverState[id] = 'hover'; }
  onCardLeave(id: string) { this.hoverState[id] = 'rest'; }

  /** Navega al formulario "nuevo grupo" en otra página */
  goToCreate() {
    this.router.navigate(['/groups/new']);
  }

  goToChat(groupId: string) {
    this.router.navigate(['/users/chat/groups', groupId]);
  }
}
