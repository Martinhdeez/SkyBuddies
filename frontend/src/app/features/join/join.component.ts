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
import {GroupService} from '../../core/services/group.service';

type StepType = 'text' | 'binary' | 'card' | 'options';
interface Step   { type: StepType; cat: string }
interface Option { key: string;    label: string }

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './join.component.html',
  styleUrls:   ['./join.component.css'],
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
export class JoinComponent implements OnInit, AfterViewInit {
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
    private groupService: GroupService,
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
      this.joinGroupFromUrl();
    }
  }

  private joinGroupFromUrl() {
    // 1) Leemos el código de la query string: /.../join?code=XYZ
    const code = this.route.snapshot.queryParamMap.get('code')?.trim();
    if (!code) {
      console.error('No code provided in URL');
      return;
    }

    // 2) Llamamos al servicio para validar que existe un grupo con ese código
    this.groupService.getGroupByCode(code).subscribe({
      next: group => {
        const groupId = group.id;
        const me = this.authService.getUserId()!;

        // 3) Nos añadimos al grupo, pasando además el filtro actual si el endpoint lo requiere
        this.groupService
          .addMembers(
            groupId,
            [ this.currentFilter ], // users_travel_filter
            [ me ]
          )
          .subscribe({
            next: () => {
              // 4) Navegamos al chat del grupo
              this.router.navigate(['/users/chat/groups', groupId]);
            },
            error: err => {
              console.error('Error joining group', err);
              // Aquí podrías mostrar un mensaje de error al usuario
            }
          });
      },
      error: err => {
        console.error('Invalid group code:', err);
        // Mostrar mensaje de "código inválido"
      }
    });
  }
}
