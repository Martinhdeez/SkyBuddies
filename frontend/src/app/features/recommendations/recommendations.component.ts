// src/app/features/recommendations/recommendations.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger, transition, style, animate,
  query, stagger, state
} from '@angular/animations';
import { HeaderComponent } from '../../core/components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    NgIf,
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

  constructor(private router: Router) {}

  ngOnInit() {
    const state = history.state as any;
    // aquí esperamos que state.recommended sea string[]
    if (Array.isArray(state.recommended)) {
      this.recommendations = state.recommended;
    } else {
      console.warn('No vienen recomendaciones válidas');
      this.recommendations = [];
    }
    for (const c of this.recommendations) {
      this.hoverState[c] = 'rest';
    }
  }

  setHover(country: string, state: 'rest'|'hover') {
    this.hoverState[country] = state;
  }
}
