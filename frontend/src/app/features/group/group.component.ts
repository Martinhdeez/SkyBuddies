import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule }   from '@angular/common';
import { RouterLink }     from '@angular/router';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';

import { HeaderComponent }   from '../../core/components/header/header.component';
import { FooterComponent }   from '../../core/components/footer/footer.component';
import { GroupService, Group } from '../../core/services/group.service';

@Component({
  selector: 'app-group-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
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
    trigger('formSlide', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
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
  private allGroups: Group[] = [];

  groups: Group[] = [];
  hoverState: Record<string,'rest'|'hover'> = {};
  showNewForm = false;

  newGroupForm!: FormGroup;
  searchControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private svc: GroupService
  ) {}

  ngOnInit() {
    this.newGroupForm = this.fb.group({
      name:       ['', Validators.required],
      visibility: ['public' as 'public'|'private', Validators.required],
      members:    ['']
    });

    this.svc.getGroups().subscribe(list => {
      this.allGroups = list;
      this.applyFilter('');
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(term => {
      this.applyFilter(term || '');
    });
  }

  private applyFilter(term: string) {
    const q = term.trim().toLowerCase();
    const filtered = q
      ? this.allGroups.filter(g => g.name.toLowerCase().includes(q))
      : [...this.allGroups];

    this.groups = filtered.slice(0, 20);
    this.hoverState = {};
    this.groups.forEach(g => this.hoverState[g.id] = 'rest');
  }

  onCardEnter(id: string) { this.hoverState[id] = 'hover'; }
  onCardLeave(id: string) { this.hoverState[id] = 'rest'; }

  toggleNewForm() {
    this.showNewForm = !this.showNewForm;
  }

  submitNewGroup() {
    if (this.newGroupForm.invalid) return;
    const { name, visibility, members } = this.newGroupForm.value;
    const membersArr = (members as string)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    this.svc.createGroup({ name, visibility, members: membersArr })
      .subscribe(g => {
        this.allGroups.unshift(g);
        this.applyFilter(this.searchControl.value || '');
        this.newGroupForm.reset({ name:'', visibility:'public', members:'' });
        this.showNewForm = false;
      });
  }
}
