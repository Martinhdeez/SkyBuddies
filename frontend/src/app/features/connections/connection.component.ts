import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { FiltersService, Filter } from '../../core/services/filters.service';
import { AuthService } from '../../core/services/auth.service';
import { GroupService, GroupRecommendation } from '../../core/services/group.service';

type StepType = 'card' | 'options' | 'text' | 'binary';

interface Step {
  type: StepType;
  cat: string;
}

interface Option {
  key: string;
  label: string;
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardHover', [
      state('rest', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('rest <=> hover', animate('300ms ease-in-out'))
    ]),
    trigger('stepAnim', [
      transition(':enter', [
        query('.checkbox-wrapper', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('.checkbox-wrapper', [
          stagger(-50, [
            animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ConnectionComponent implements OnInit, AfterViewInit {
  @ViewChild('flightPath') flightPath!: ElementRef<SVGPathElement>;

  categories: string[] = [];
  steps: Step[] = [];
  currentStep = 0;
  hoverState: Record<string, 'rest' | 'hover'> = {};
  filterSelections: Record<string, boolean> = {};
  options: Record<string, Option[]> = {};

  recommendedGroups: GroupRecommendation[] = [];
  showResults = false;

  private filterId: string | null = null;
  private isNew = false;
  protected currentFilter!: Filter;

  joiningGroupId: string | null = null;
  joinedGroups = new Set<string>();

  constructor(
    private filtersSvc: FiltersService,
    private groupService: GroupService,
    private route: ActivatedRoute,
    protected router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.filterId = this.route.snapshot.paramMap.get('filter_id');
    this.isNew = !this.filterId || this.filterId === 'new';

    const queryParams = this.route.snapshot.queryParamMap;
    const userIdParam = queryParams.get('user_id') ?? '';
    const departureCityParam = queryParams.get('departure_city') ?? '';

    if (this.isNew) {
      const emptyFilter = this.createEmptyFilter(userIdParam, departureCityParam);
      this.loadFromFilter(emptyFilter);
    } else {
      this.filtersSvc.getFilterById(this.filterId!).subscribe({
        next: f => this.loadFromFilter(f),
        error: _ => this.router.navigate(['/index'])
      });
    }
  }

  private loadFromFilter(f: Filter) {
    this.currentFilter = { ...f };

    this.categories = Object.keys(f)
      .filter(k => typeof (f as any)[k] === 'object')
      .filter(k => !['id', 'created_at', 'updated_at', 'date'].includes(k));

    this.steps = [
      { type: 'text' as StepType, cat: 'departure_city' },
      ...this.categories.flatMap(cat => [
        { type: 'card' as StepType, cat },
        { type: 'options' as StepType, cat }
      ]),
      { type: 'binary' as StepType, cat: 'preferences' }
    ];

    for (const cat of this.categories) {
      this.hoverState[cat] = 'rest';
      const group = (f as any)[cat] as Record<string, boolean>;

      this.options[cat] = Object.keys(group).map(key => ({
        key,
        label: this.toLabel(key)
      }));

      for (const key of Object.keys(group)) {
        this.filterSelections[`${cat}_${key}`] = group[key];
      }
    }
  }

  private createEmptyFilter(userId: string = '', departureCity: string = ''): Filter {
    const now = new Date().toISOString();
    return {
      id: '',
      user_id: userId,
      date: now,
      departure_city: departureCity,
      low_cost: false,
      eco_travel: false,
      created_at: now,
      updated_at: now,
      climate:    { warm: false, cold: false, tempered: false },
      food:       { vegetarian: false, vegan: false, gluten_free: false, lactose_free: false, italian: false, mediterranean: false, japanese: false, chinese: false, fast_food: false },
      weather:    { sunny: false, rainy: false, snowy: false, windy: false, stormy: false, foggy: false, cloudy: false },
      activities: { hiking: false, swimming: false, skiing: false, surfing: false, climbing: false, cycling: false, running: false, walking: false, museums: false, discos: false },
      events:     { concerts: false, festivals: false, exhibitions: false, sports_events: false, local_events: false, parties: false },
      continents: { europe: false, asia: false, north_america: false, south_america: false, africa: false, oceania: false },
      entorno:    { urban: false, rural: false, beach: false, mountain: false, desert: false, forest: false, island: false }
    };
  }

  private toLabel(key: string): string {
    return key.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  }

  ngAfterViewInit() {
    const p = this.flightPath.nativeElement;
    const len = p.getTotalLength();
    p.style.setProperty('--path-length', `${len}`);
  }

  get stepType() {
    return this.steps[this.currentStep].type;
  }

  get stepCategory() {
    return this.steps[this.currentStep].cat;
  }

  setHover(cat: string, s: 'rest' | 'hover') {
    this.hoverState[cat] = s;
  }

  back() {
    if (this.currentStep > 0) this.currentStep--;
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.saveFilterAndRecommend();
    }
  }

  private saveFilterAndRecommend() {
    const now = new Date().toISOString();
    const userId = this.authService.getUserId();

    this.currentFilter.updated_at = now;
    this.currentFilter.user_id = userId;
    this.currentFilter.date = this.currentFilter.date || now;

    for (const cat of this.categories) {
      for (const opt of this.options[cat]) {
        (this.currentFilter as any)[cat][opt.key] =
          this.filterSelections[`${cat}_${opt.key}`];
      }
    }

    const op$ = this.isNew
      ? this.filtersSvc.createFilter(this.currentFilter)
      : this.filtersSvc.updateFilter(this.filterId!, this.currentFilter);

    op$.subscribe({
      next: f => {
        const payload: Filter = {
          ...f
        };

        this.groupService.recommendGroups(payload).subscribe({
          next: groups => {
            this.recommendedGroups = groups;
            this.showResults = true;
          },
          error: e => console.error('Error obteniendo recomendaciones de grupo', e)
        });
      },
      error: e => console.error('Error guardando filtro', e)
    });
  }

  joinGroup(groupId: string) {
    this.joiningGroupId = groupId;
    const me = this.authService.getUserId()!;

    const usersTravelFilter = [ this.currentFilter ];
    const members = [ me ];

    this.groupService
      .addMembers(groupId, usersTravelFilter, members)
      .subscribe({
        next: () => {
          this.joinedGroups.add(groupId);
          this.joiningGroupId = null;
        },
        error: e => {
          console.error('Error joining group', e);
          this.joiningGroupId = null;
        }
      });
  }
}
