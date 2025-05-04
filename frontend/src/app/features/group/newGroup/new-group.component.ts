import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  state
} from '@angular/animations';
import {Router} from '@angular/router';
import { Filter, FiltersService } from '../../../core/services/filters.service';
import { AuthService } from '../../../core/services/auth.service';
import { GroupService } from '../../../core/services/group.service';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FooterComponent } from '../../../core/components/footer/footer.component';

type FilterGroupKey =
  | 'climate'
  | 'food'
  | 'weather'
  | 'activities'
  | 'events'
  | 'continents'
  | 'entorno';

interface FilterGroup {
  key: FilterGroupKey;
  title: string;
  options: string[];
  labels?: Record<string, string>;
}

const FILTER_GROUPS: FilterGroup[] = [
  {
    key: 'climate',
    title: 'WHAT TYPE OF CLIMATE DO YOU PREFER?',
    options: ['warm', 'cold', 'temperate'],
    labels: { warm: 'Warm', cold: 'Cold', temperate: 'Temperate' }
  },
  {
    key: 'food',
    title: 'WHAT TYPE OF FOOD?',
    options: [
      'vegetarian',
      'vegan',
      'gluten_free',
      'lactose_free',
      'italian',
      'mediterranean',
      'japanese',
      'chinese',
      'fast_food'
    ],
    labels: {
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
      gluten_free: 'Gluten Free',
      lactose_free: 'Lactose Free',
      italian: 'Italian',
      mediterranean: 'Mediterranean',
      japanese: 'Japanese',
      chinese: 'Chinese',
      fast_food: 'Fast Food'
    }
  },
  {
    key: 'weather',
    title: 'WHAT WEATHER DO YOU LIKE?',
    options: ['sunny', 'rainy', 'snowy', 'windy', 'stormy', 'foggy', 'cloudy'],
    labels: {
      sunny: 'Sunny',
      rainy: 'Rainy',
      snowy: 'Snowy',
      windy: 'Windy',
      stormy: 'Stormy',
      foggy: 'Foggy',
      cloudy: 'Cloudy'
    }
  },
  {
    key: 'activities',
    title: 'ACTIVITIES YOU ARE INTERESTED IN',
    options: [
      'hiking',
      'swimming',
      'skiing',
      'surfing',
      'climbing',
      'cycling',
      'running',
      'walking',
      'museums',
      'nightlife'
    ],
    labels: {
      hiking: 'Hiking',
      swimming: 'Swimming',
      skiing: 'Skiing',
      surfing: 'Surfing',
      climbing: 'Climbing',
      cycling: 'Cycling',
      running: 'Running',
      walking: 'Walking',
      museums: 'Museums',
      nightlife: 'Nightlife'
    }
  },
  {
    key: 'events',
    title: 'WHAT TYPE OF EVENTS?',
    options: [
      'concerts',
      'festivals',
      'exhibitions',
      'sports_events',
      'local_events',
      'parties'
    ],
    labels: {
      concerts: 'Concerts',
      festivals: 'Festivals',
      exhibitions: 'Exhibitions',
      sports_events: 'Sports Events',
      local_events: 'Local Events',
      parties: 'Parties'
    }
  },
  {
    key: 'continents',
    title: 'WHICH CONTINENTS?',
    options: ['europe', 'asia', 'north_america', 'south_america', 'africa', 'oceania'],
    labels: {
      europe: 'Europe',
      asia: 'Asia',
      north_america: 'North America',
      south_america: 'South America',
      africa: 'Africa',
      oceania: 'Oceania'
    }
  },
  {
    key: 'entorno',
    title: 'WHAT TYPE OF ENVIRONMENT?',
    options: ['urban', 'rural', 'beach', 'mountain', 'desert', 'forest', 'island'],
    labels: {
      urban: 'Urban',
      rural: 'Rural',
      beach: 'Beach',
      mountain: 'Mountain',
      desert: 'Desert',
      forest: 'Forest',
      island: 'Island'
    }
  }
];

@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardHover', [
      state('rest', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('rest <=> hover', animate('200ms ease-in-out'))
    ])
  ]
})
export class NewGroupComponent implements OnInit, AfterViewInit {
  @ViewChild('flightPath') flightPath?: ElementRef<SVGPathElement>;

  currentStep = 1;
  hoverState: Record<string, 'rest' | 'hover'> = {
    solo: 'rest',
    accompanied: 'rest',
    private: 'rest',
    public: 'rest'
  };
  isSolo = true;
  visibility: 'private' | 'public' = 'private';

  filterGroups = FILTER_GROUPS;
  currentFilterIndex = 0;
  newFilter!: Filter & {
    low_cost: boolean;
    eco_travel: boolean;
    departure_city: string;
  };

  groupName = '';

  userId!: string;

  isCreating = false;
  createSuccess = false;

  constructor(
    private auth: AuthService,
    private filtersSvc: FiltersService,
    private groupsSvc: GroupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.auth.getUserId()!;
    this.newFilter = this.buildEmptyFilter();
  }

  ngAfterViewInit() {
    if (!this.flightPath) return;
    const len = this.flightPath.nativeElement.getTotalLength();
    this.flightPath.nativeElement.style.setProperty('--path-length', `${len}`);
  }

  private buildEmptyFilter(): Filter {
    const now = new Date().toISOString();
    return {
      id: '',
      date: now,
      user_id: this.userId,
      climate: { warm: false, cold: false, tempered: false },
      food: {
        vegetarian: false,
        vegan: false,
        gluten_free: false,
        lactose_free: false,
        italian: false,
        mediterranean: false,
        japanese: false,
        chinese: false,
        fast_food: false
      },
      weather: {
        sunny: false,
        rainy: false,
        snowy: false,
        windy: false,
        stormy: false,
        foggy: false,
        cloudy: false
      },
      activities: {
        hiking: false,
        swimming: false,
        skiing: false,
        surfing: false,
        climbing: false,
        cycling: false,
        running: false,
        walking: false,
        museums: false,
        discos: false
      },
      events: {
        concerts: false,
        festivals: false,
        exhibitions: false,
        sports_events: false,
        local_events: false,
        parties: false
      },
      continents: {
        europe: false,
        asia: false,
        north_america: false,
        south_america: false,
        africa: false,
        oceania: false
      },
      entorno: {
        urban: false,
        rural: false,
        beach: false,
        mountain: false,
        desert: false,
        forest: false,
        island: false
      },
      low_cost: false,
      eco_travel: false,
      departure_city: '',
      created_at: now,
      updated_at: now
    };
  }

  setHover(key: string, state: 'rest' | 'hover') {
    this.hoverState[key] = state;
  }

  selectSolo()   { this.isSolo = true;  this.currentStep = 2; }
  selectAccompanied() { this.isSolo = false; this.currentStep = 2; }
  selectPrivate() { this.visibility = 'private'; this.currentStep = 3; }
  selectPublic()  { this.visibility = 'public';  this.currentStep = 3; }

  back() {
    if (this.currentStep > 1) {
      if (this.currentStep === 4)       this.currentStep = 3;
      else if (this.currentStep === 5)  this.currentStep = 4;
      else                              this.currentStep--;
    }
  }

  isOptionSelected(key: FilterGroupKey, opt: string): boolean {
    const rec = this.newFilter[key] as Record<string, boolean>;
    return rec[opt];
  }

  toggleOption(key: FilterGroupKey, opt: string) {
    const rec = this.newFilter[key] as Record<string, boolean>;
    rec[opt] = !rec[opt];
  }

  anySelected(key: FilterGroupKey): boolean {
    const rec = this.newFilter[key] as Record<string, boolean>;
    return Object.values(rec).some(v => v);
  }

  backFilter() {
    if (this.currentFilterIndex > 0) {
      this.currentFilterIndex--;
    } else {
      this.currentStep = 2;
    }
  }

  nextFilter() {
    if (this.currentFilterIndex < this.filterGroups.length - 1) {
      this.currentFilterIndex++;
    } else {
      this.currentStep = 4;
    }
  }

  nextExtra() {
    if (!this.newFilter.departure_city.trim()) return;
    this.currentStep = 5;
  }

  createGroup() {

    if (
      !this.groupName.trim() ||
      !this.newFilter.departure_city?.trim()
    ) {
      return;
    }

    this.isCreating = true;

    const now = new Date().toISOString();

    this.newFilter.updated_at  = now;
    this.newFilter.created_at  = now;
    this.newFilter.date        = now;
    this.newFilter.user_id     = this.userId;

    const payload = {
      name:                this.groupName.trim(),
      visibility:          this.visibility,
      users_travel_filter: [ this.newFilter ],
      members:             [ this.userId ]
    };

    this.groupsSvc.createGroup(payload).subscribe({
      next: () => {
        this.createSuccess = true;

        setTimeout(() => {
          this.router.navigate(['/groups']);
        }, 3000);
      },
      error: err => {
        console.error('Error creando grupo', err);
        this.isCreating = false;
      },
      complete: () => {
        this.isCreating = false;
      }
    });
  }
}
