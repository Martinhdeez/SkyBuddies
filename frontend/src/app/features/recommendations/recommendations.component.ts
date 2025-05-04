import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { CommonModule, NgForOf } from '@angular/common';
import { RouterModule } from '@angular/router';
import {PlacesResponse, RecommendationService} from '../../core/services/recomendation.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
  animations: [
    trigger('listAnim', [
      transition(':enter', [
        query('.country-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardHover', [
      state('rest',  style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('rest <=> hover', animate('200ms ease-in-out'))
    ])
  ]
})
export class RecommendationsComponent implements OnInit {
  private allCities: string[] = [];
  // guardamos sólo las respuestas válidas
  responses: Array<{ city: string; data: PlacesResponse }> = [];
  currentIndex = 0;

  loadingCount = 0;    // cuántas peticiones están activas
  anyError = false;    // si alguna falló

  constructor(
    private router: Router,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit() {
    const state = history.state as any;
    if (Array.isArray(state.recommended)) {
      this.allCities = state.recommended;
      this.fetchAllPlaces();
    }
  }

  private fetchAllPlaces() {
    this.loadingCount = this.allCities.length;
    for (const city of this.allCities) {
      this.recommendationService.getPlaces(city)
        .subscribe({
          next: resp => {
            this.responses.push({ city, data: resp });
          },
          error: () => {
            console.warn(`Error cargando lugares para ${city}`);
            this.anyError = true;
          },
          complete: () => {
            this.loadingCount--;
          }
        });
    }
  }

  // avanzar al siguiente (si existe)
  next() {
    if (this.currentIndex < this.responses.length - 1) {
      this.currentIndex++;
    }
  }

  // retroceder
  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
