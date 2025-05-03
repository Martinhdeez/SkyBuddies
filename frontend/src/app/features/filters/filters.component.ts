// src/app/features/filters/filters.component.ts
import {
  Component,
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
import { Router }      from '@angular/router';
import { HeaderComponent }             from '../../core/components/header/header.component';
import { FooterComponent }             from '../../core/components/footer/footer.component';
import { FiltersService, Filter }      from '../../core/services/filters.service';
import {RecommendationService, RecommendCountriesPayload} from '../../core/services/recomendation.service';

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
export class FiltersComponent implements AfterViewInit {
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
    private router:     Router
  ) {}


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
    this.currentFilter.updated_at = new Date().toISOString();
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
          climate:      f.climate,
          food:         f.food,
          weather:      f.weather,
          activities:   f.activities,
          events:       f.events,
          continents:   f.continents,
          entorno:      f.entorno,
          city:         f.city,
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
