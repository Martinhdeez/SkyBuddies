import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecommendCountriesPayload {
  id: string;
  date: string;
  climate: Record<'warm'|'cold'|'tempered', boolean>;
  food: Record<'vegetarian'|'vegan'|'gluten_free'|'lactose_free'|'italian'|'mediterranean'|'japanese'|'chinese'|'fast_food', boolean>;
  weather: Record<'sunny'|'rainy'|'snowy'|'windy'|'stormy'|'foggy'|'cloudy', boolean>;
  activities: Record<'hiking'|'swimming'|'skiing'|'surfing'|'climbing'|'cycling'|'running'|'walking'|'museums'|'discos', boolean>;
  events: Record<'concerts'|'festivals'|'exhibitions'|'sports_events'|'local_events'|'parties', boolean>;
  continents: Record<'europe'|'asia'|'north_america'|'south_america'|'africa'|'oceania', boolean>;
  entorno: Record<'urban'|'rural'|'beach'|'mountain'|'desert'|'forest'|'island', boolean>;
  city: string;
  created_at?: string;
  updated_at?: string;
}

// Este es el shape real de la respuesta que tú viste
export interface RecommendCountriesResponse {
  recommended_countries: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor(private http: HttpClient) {}

  recommendCountries(payload: RecommendCountriesPayload): Observable<RecommendCountriesResponse> {
    return this.http.post<RecommendCountriesResponse>(
      `${environment.apiUrl}/recommend-countries`,
      payload
    );
  }
}
