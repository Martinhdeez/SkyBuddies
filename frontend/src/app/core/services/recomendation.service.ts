import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecommendCitiesPayload {
  id: string;
  date: string;
  departure_city: string;
  user_id: string | null;
  climate: Record<'warm'|'cold'|'tempered', boolean>;
  food: Record<'vegetarian'|'vegan'|'gluten_free'|'lactose_free'|'italian'|'mediterranean'|'japanese'|'chinese'|'fast_food', boolean>;
  weather: Record<'sunny'|'rainy'|'snowy'|'windy'|'stormy'|'foggy'|'cloudy', boolean>;
  activities: Record<'hiking'|'swimming'|'skiing'|'surfing'|'climbing'|'cycling'|'running'|'walking'|'museums'|'discos', boolean>;
  events: Record<'concerts'|'festivals'|'exhibitions'|'sports_events'|'local_events'|'parties', boolean>;
  continents: Record<'europe'|'asia'|'north_america'|'south_america'|'africa'|'oceania', boolean>;
  entorno: Record<'urban'|'rural'|'beach'|'mountain'|'desert'|'forest'|'island', boolean>;
  eco_travel: boolean;
  low_cost: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RecommendCitiesResponse {
  recommended_cities: string[];
}

export interface PlacesResponse {
  city: string;
  recommended_places: string[];
  photos: string[];
}


@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor(private http: HttpClient) {}

  /**
   * POST /recommend-cities → Get recommended countries based on user preferences
   * @param payload The user preferences
   */
  recommendCities(payload: RecommendCitiesPayload): Observable<RecommendCitiesResponse> {
    return this.http.post<RecommendCitiesResponse>(
      `${environment.apiUrl}/recommend-cities`,
      payload
    );
  }

  /**
   * POST /recommended-places → Get recommended places for a given city
   * @param city The departure city
   */
  getPlaces(city: string): Observable<PlacesResponse> {
    return this.http.post<PlacesResponse>(
      `${environment.apiUrl}/recommended-places`,
      { city }
    );
  }
}
