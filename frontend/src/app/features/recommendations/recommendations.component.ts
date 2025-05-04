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
import {RecommendationService} from '../../core/services/recomendation.service';

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
  recommendations: string[] = [];
  hoverState: Record<string,'rest'|'hover'> = {};
  placesMap: Record<string,{ recommended_places: string[]; photos: string[] }> = {};
  loadingMap: Record<string, boolean> = {};
  errorMap: Record<string, boolean> = {};

  constructor(
    private router: Router,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit() {
    const state = history.state as any;
    if (Array.isArray(state.recommended)) {
      this.recommendations = state.recommended;
    }
    for (const city of this.recommendations) {
      this.hoverState[city] = 'rest';
      this.fetchPlaces(city);
    }
  }

  setHover(city: string, state: 'rest'|'hover') {
    this.hoverState[city] = state;
  }

  private fetchPlaces(city: string) {
    this.loadingMap[city] = true;
    this.errorMap[city] = false;

    this.recommendationService.getPlaces(city)
      .subscribe({
        next: resp => {
          this.placesMap[city] = {
            recommended_places: resp.recommended_places,
            photos: resp.photos
          };
          this.loadingMap[city] = false;
        },
        error: err => {
          console.error(`Error al cargar lugares para ${city}`, err);
          this.errorMap[city] = true;
          this.loadingMap[city] = false;
        }
      });
  }
}
