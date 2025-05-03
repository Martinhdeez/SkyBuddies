import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule, NgIf }          from '@angular/common';
import { FormsModule }                 from '@angular/forms';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import { ActivatedRoute, Router }      from '@angular/router';
import { HeaderComponent }             from '../../core/components/header/header.component';
import { FooterComponent }             from '../../core/components/footer/footer.component';
import { FiltersService, Filter }      from '../../core/services/filters.service';
import {RecommendationService, RecommendCountriesPayload} from '../../core/services/recomendation.service';
import {AuthService} from '../../core/services/auth.service';

interface Step   { type: 'card' | 'options'; cat: string }
interface Option { key: string;     label: string }

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
  templateUrl: './filters.component.html',
  styleUrls:   ['./filters.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('cardHover', [
      state('rest',  style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('rest <=> hover', animate('300ms ease-in-out'))
    ]),
    trigger('stepAnim', [
      transition(':enter', [
        query('.checkbox-wrapper', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate('300ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ]),
      transition(':leave', [
        query('.checkbox-wrapper', [
          stagger(-50, [
            animate('200ms ease-in',
              style({ opacity: 0, transform: 'translateY(-10px)' })
            )
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class FiltersComponent implements OnInit, AfterViewInit {
  @ViewChild('flightPath') flightPath!: ElementRef<SVGPathElement>;

  categories:       string[]            = [];
  steps:            Step[]              = [];
  currentStep       = 0;
  hoverState:      Record<string,'rest'|'hover'> = {};
  filterSelections: Record<string,boolean>       = {};
  options:         Record<string,Option[]>       = {};

  private filterId:   string | null = null;
  private isNew = false;
  private currentFilter!: Filter;

  constructor(
    private filtersSvc: FiltersService,
    private recSvc:     RecommendationService,
    private route:      ActivatedRoute,
    private router:     Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.filterId = this.route.snapshot.paramMap.get('filter_id');
    this.isNew     = !this.filterId || this.filterId === 'new';

    if (this.isNew) {
      this.loadFromFilter(this.createEmptyFilter());
    } else {
      this.filtersSvc.getFilterById(this.filterId!)
        .subscribe({
          next: f => this.loadFromFilter(f),
          error: _ => {
            this.router.navigate(['/index']);
          }
        });
    }
  }

  private loadFromFilter(f: Filter) {
    this.currentFilter = { ...f };

    this.categories = Object.keys(f)
      .filter(k=> typeof (f as any)[k] === 'object')
      .filter(k=> !['id','created_at','updated_at','date'].includes(k));

    this.steps = this.categories.flatMap(cat=>[
      { type:'card',    cat },
      { type:'options', cat }
    ]);

    for(const cat of this.categories) {
      this.hoverState[cat] = 'rest';
      const group = (f as any)[cat] as Record<string,boolean>;

      this.options[cat] = Object.keys(group)
        .map(key => ({ key, label: this.toLabel(key) }));

      for(const key of Object.keys(group)) {
        this.filterSelections[`${cat}_${key}`] = group[key];
      }
    }
  }

  private createEmptyFilter(): Filter {
    const now = new Date().toISOString();
    return {
      id: '',
      user_id: '',
      date: now,
      created_at: now,
      updated_at: now,
      climate:    { warm:false,cold:false,tempered:false },
      food:       { vegetarian:false,vegan:false,gluten_free:false,
        lactose_free:false,italian:false,mediterranean:false,
        japanese:false,chinese:false,fast_food:false },
      weather:    { sunny:false,rainy:false,snowy:false,windy:false,
        stormy:false,foggy:false,cloudy:false },
      activities: { hiking:false,swimming:false,skiing:false,surfing:false,
        climbing:false,cycling:false,running:false,walking:false,
        museums:false,discos:false },
      events:     { concerts:false,festivals:false,exhibitions:false,
        sports_events:false,local_events:false,parties:false },
      continents: { europe:false,asia:false,north_america:false,
        south_america:false,africa:false,oceania:false },
      entorno:    { urban:false,rural:false,beach:false,mountain:false,
        desert:false,forest:false,island:false }
    };
  }

  private toLabel(key: string): string {
    return key.split('_')
      .map(w=> w[0].toUpperCase()+w.slice(1))
      .join(' ');
  }

  ngAfterViewInit() {
    const p = this.flightPath.nativeElement;
    const len = p.getTotalLength();
    p.style.setProperty('--path-length', `${len}`);
  }

  get stepType()     { return this.steps[this.currentStep].type; }
  get stepCategory() { return this.steps[this.currentStep].cat; }

  setHover(cat:string, s:'rest'|'hover') { this.hoverState[cat] = s; }

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
    this.currentFilter.user_id  = userId;
    this.currentFilter.date      = this.currentFilter.date || now;

    for(const cat of this.categories) {
      for(const opt of this.options[cat]) {
        (this.currentFilter as any)[cat][opt.key] =
          this.filterSelections[`${cat}_${opt.key}`];
      }
    }

    const op$ = this.isNew
      ? this.filtersSvc.createFilter(this.currentFilter)
      : this.filtersSvc.updateFilter(this.filterId!, this.currentFilter);

    op$.subscribe({
      next: f => {
        const payload: RecommendCountriesPayload = {
          id:           f.id,
          date:         f.date,
          user_id:      f.user_id,
          climate:      f.climate,
          food:         f.food,
          weather:      f.weather,
          activities:   f.activities,
          events:       f.events,
          continents:   f.continents,
          entorno:      f.entorno,
          created_at:   f.created_at,
          updated_at:   f.updated_at
        };

        this.recSvc.recommendCountries(payload)
          .subscribe(recObj => {
            this.router.navigate(['/recommendations'], {
              state: { recommended: recObj.recommended_countries }
            });
          });
      },
      error: e => console.error('Error guardando filtro', e)
    });
  }
}
