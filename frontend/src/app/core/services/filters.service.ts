// src/app/core/services/filters.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Filter {
  id: string;
  date: string;
  user_id: string | null;
  climate: Record<'warm'|'cold'|'tempered', boolean>;
  food: Record<
    | 'vegetarian'
    | 'vegan'
    | 'gluten_free'
    | 'lactose_free'
    | 'italian'
    | 'mediterranean'
    | 'japanese'
    | 'chinese'
    | 'fast_food',
    boolean
  >;
  weather: Record<'sunny'|'rainy'|'snowy'|'windy'|'stormy'|'foggy'|'cloudy', boolean>;
  activities: Record<
    | 'hiking'
    | 'swimming'
    | 'skiing'
    | 'surfing'
    | 'climbing'
    | 'cycling'
    | 'running'
    | 'walking'
    | 'museums'
    | 'discos',
    boolean
  >;
  events: Record<
    | 'concerts'
    | 'festivals'
    | 'exhibitions'
    | 'sports_events'
    | 'local_events'
    | 'parties',
    boolean
  >;
  continents: Record<
    | 'europe'
    | 'asia'
    | 'north_america'
    | 'south_america'
    | 'africa'
    | 'oceania',
    boolean
  >;
  entorno: Record<
    | 'urban'
    | 'rural'
    | 'beach'
    | 'mountain'
    | 'desert'
    | 'forest'
    | 'island',
    boolean
  >;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private readonly baseUrl = `${environment.apiUrl}/filters`;

  constructor(private http: HttpClient) {}

  /**
   * GET /filters → obtiene todos los filtros
   */
  getFilters(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.baseUrl);
  }

  /**
   * GET /filters/{filter_id} → obtiene un filtro por su ID
   * @param filterId El ID del filtro a obtener
   */
  getFilterById(filterId: string): Observable<Filter> {
    return this.http.get<Filter>(`${this.baseUrl}/${filterId}`);
  }

  /**
   * POST /filters → crea un nuevo filtro
   * @param payload
   */
  createFilter(payload: Filter): Observable<Filter> {
    return this.http.post<Filter>(this.baseUrl, payload);
  }

  /**
   * PUT /filters/{filter_id} → actualiza un filtro existente
   * @param filterId el ID del filtro a actualizar
   * @param payload los datos a actualizar
   */
  updateFilter(filterId: string, payload: Filter): Observable<Filter> {
    return this.http.put<Filter>(`${this.baseUrl}/${filterId}`, payload);
  }

  /**
   * DELETE /filters/{filter_id} → elimina un filtro
   * @param filterId
   */
  deleteFilter(filterId: string): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/${filterId}`);
  }
}
