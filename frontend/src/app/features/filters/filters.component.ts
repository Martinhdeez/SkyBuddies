import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule, NgIf }   from '@angular/common';
import { FormsModule }          from '@angular/forms';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent }       from '../../core/components/header/header.component';
import { FooterComponent }       from '../../core/components/footer/footer.component';
import { FiltersService, Filter }      from '../../core/services/filters.service';
import { RecommendationService, RecommendCitiesPayload } from '../../core/services/recomendation.service';
import { AuthService }                 from '../../core/services/auth.service';

type StepType = 'text' | 'binary' | 'card' | 'options';
interface Step   { type: StepType; cat: string }
interface Option { key: string;    label: string }

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
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
export class FiltersComponent implements OnInit, AfterViewInit {
  @ViewChild('flightPath') flightPath!: ElementRef<SVGPathElement>;

  steps: Step[] = [];
  currentStep = 0;
  hoverState: Record<string,'rest'|'hover'> = {};
  categories: string[] = [];
  options: Record<string,Option[]> = {};
  filterSelections: Record<string,boolean> = {};

  private filterId: string | null = null;
  private isNew = false;
  currentFilter!: Filter;

  constructor(
    private filtersSvc: FiltersService,
    private recSvc:     RecommendationService,
    private authService: AuthService,
    private route:      ActivatedRoute,
    private router:     Router
  ) {}

  ngOnInit() {
    this.filterId = this.route.snapshot.paramMap.get('filter_id');
    this.isNew    = !this.filterId || this.filterId === 'new';

    if (this.isNew) {
      // arrancamos con filtro vacío
      this.loadFromFilter(this.createEmptyFilter());
    } else {
      this.filtersSvc.getFilterById(this.filterId!)
        .subscribe({
          next: f => this.loadFromFilter(f),
          error: _ => this.router.navigate(['/'])
        });
    }
  }

  private loadFromFilter(f: Filter) {
    this.currentFilter = { ...f };

    // extraer keys dinámicas
    this.categories = Object.keys(f)
      .filter(k => typeof (f as any)[k] === 'object')
      .filter(k => !['id','date','created_at','updated_at','departure_city','low_cost','eco_travel','user_id'].includes(k));

    this.steps = [
      // paso de texto para city
      { type: 'text',   cat: 'departure_city' } as Step,

      // luego tus filtros dinámicos
      ...this.categories.flatMap(cat =>
        [
          { type: 'card',    cat } as Step,
          { type: 'options', cat } as Step
        ]
      ),
      // por último el paso binary
      { type: 'binary', cat: 'preferences' } as Step
    ];

    // inicializar hover + opciones + selecciones
    for (const cat of this.categories) {
      this.hoverState[cat] = 'rest';
      const group = (f as any)[cat] as Record<string,boolean>;
      this.options[cat] = Object.keys(group).map(key => ({
        key, label: this.toLabel(key)
      }));
      for (const key of Object.keys(group)) {
        this.filterSelections[`${cat}_${key}`] = group[key];
      }
    }
  }

  private createEmptyFilter(): Filter {
    const now = new Date().toISOString();
    return {
      id: '',
      user_id:    this.authService.getUserId()!,
      date:       now,
      departure_city: '',
      low_cost:   false,
      eco_travel: false,
      created_at: now,
      updated_at: now,
      climate:    { warm:false, cold:false, tempered:false },
      food:       { vegetarian:false, vegan:false, gluten_free:false, lactose_free:false,
        italian:false, mediterranean:false, japanese:false, chinese:false, fast_food:false },
      weather:    { sunny:false, rainy:false, snowy:false, windy:false, stormy:false,
        foggy:false, cloudy:false },
      activities: { hiking:false, swimming:false, skiing:false, surfing:false, climbing:false,
        cycling:false, running:false, walking:false, museums:false, discos:false },
      events:     { concerts:false, festivals:false, exhibitions:false, sports_events:false,
        local_events:false, parties:false },
      continents: { europe:false, asia:false, north_america:false, south_america:false,
        africa:false, oceania:false },
      entorno:    { urban:false, rural:false, beach:false, mountain:false,
        desert:false, forest:false, island:false }
    };
  }

  private toLabel(key: string): string {
    return key.split('_').map(w => w[0].toUpperCase()+w.slice(1)).join(' ');
  }

  ngAfterViewInit() {
    const p = this.flightPath.nativeElement;
    const len = p.getTotalLength();
    p.style.setProperty('--path-length', `${len}`);
  }

  get stepType(): StepType {
    return this.steps[this.currentStep].type as StepType;
  }
  get stepCategory(): string {
    return this.steps[this.currentStep].cat;
  }

  setHover(cat: string, s: 'rest'|'hover') {
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
    // actualizar timestamps y user_id
    const now = new Date().toISOString();
    this.currentFilter.updated_at = now;
    this.currentFilter.date       = this.currentFilter.date || now;

    // volcamos selecciones dinámicas
    for (const cat of this.categories) {
      for (const opt of this.options[cat]) {
        (this.currentFilter as any)[cat][opt.key] =
          this.filterSelections[`${cat}_${opt.key}`];
      }
    }

    // guardamos o actualizamos
    const op$ = this.isNew
      ? this.filtersSvc.createFilter(this.currentFilter)
      : this.filtersSvc.updateFilter(this.filterId!, this.currentFilter);

    op$.subscribe({
      next: f => {
        // preparamos payload para recomendaciones
        const payload: RecommendCitiesPayload = {
          id:         f.id,
          date:       f.date,
          departure_city: f.departure_city,
          user_id:    f.user_id,
          climate:    f.climate,
          food:       f.food,
          weather:    f.weather,
          activities: f.activities,
          events:     f.events,
          continents: f.continents,
          entorno:    f.entorno,
          low_cost:   f.low_cost,
          eco_travel: f.eco_travel,
          created_at: f.created_at,
          updated_at: f.updated_at
        };

        this.recSvc.recommendCities(payload).subscribe({
          next: recObj => {
            // Imprimimos lo que viene del backend
            console.log('✅ recObj (respuesta recommendCities):', recObj);
            // Preparamos el objeto de estado
            const navState = {
              recommended: recObj.recommended_cities,
              departure_city: f.departure_city,
            };
            // Imprimimos el state que vamos a enviar
            console.log('➡️ Navegando a /recommendations con state:', navState);

            // Redirigimos pasando el state
            this.router.navigate(['/recommendations'], { state: navState });
          },
          error: err => console.error('Error en recomendaciones', err)
        });
      },
      error: e => console.error('Error guardando filtro', e)
    });
  }
}
