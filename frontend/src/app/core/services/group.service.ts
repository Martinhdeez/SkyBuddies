import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Filter} from './filters.service';

// INTERFACE THAT DEFINES THE GROUP DATA
export interface Group {
  id: string;
  name: string;
  members: string[];
  visibility: 'public' | 'private';
  travel_filter_mean: Filter;
  users_travel_filter: Filter[];
  code: string;
  updated_at: string;
  created_at: string;
}


export interface GroupRecommendation {
  id: string;
  name: string;
  members: string[];
  visibility: 'public' | 'private';
  users_travel_filter: Filter[];
  code: string;
  created_at: string;
  updated_at: string;
}


@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly baseUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  /**
   * GET /group → Get all group
   * @returns Observable<Group[]> that emits the array of group.
   */
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl);
  }

  /**
   * GET /group/{group_id} → Get a group by ID
   * @param groupId The ID of the group to retrieve.
   */
  getGroup(groupId: string): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/${groupId}`);
  }

  /**
   * POST /group → Create a new group
   * @param payload The data to create the group.
   */
  createGroup(payload: {
    name: string;
    visibility: 'public' | 'private';
    users_travel_filter: Filter[];
    members: string[];
  }): Observable<GroupRecommendation> {
    return this.http.post<GroupRecommendation>(this.baseUrl, payload);
  }

  /**
   * PUT /group/{group_id} → Update a group
   * @param groupId The ID of the group to update.
   * @param payload The data to update the group.
   */
  updateGroup(groupId: string, payload: {
    name?: string;
    members?: string[];
    visibility?: 'public' | 'private';
    users_travel_filter?: Filter[];
  }): Observable<Group> {
    return this.http.put<Group>(`${this.baseUrl}/${groupId}`, payload);
  }

  /**
   * GET /group/code/{code} → Get a group by code
   * @param code The code of the group to retrieve.
   */
  getGroupByCode(code: string): Observable<Group> {
    return this.http.get<Group>(`${this.baseUrl}/code/${code}`);
  }

  /**
   * DELETE /group/{group_id} → Delete a group
   * @param groupId The ID of the group to delete.
   */
  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${groupId}`);
  }

  /**
   * POST /group/{group_id}/add/members → Add members to a group
   * @param groupId The ID of the group.
   * @param members The list of member IDs to add.
   */
  addMembers(
    groupId: string,
    users_travel_filter: Filter[],
    members: string[]
  ): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${groupId}/add/members`, {
      users_travel_filter,
      members
    });
  }

  /**
   * POST /group/{group_id}/remove/members → Remove members from a group
   * @param groupId The ID of the group.
   * @param members The list of member IDs to remove.
   */
  removeMembers(groupId: string, members: string[]): Observable<Group> {
    return this.http.post<Group>(
      `${this.baseUrl}/${groupId}/remove/members`,
      { members }
    );
  }

  /**
   * GET /group/search → Search for N groups by name
   * @param term The search term.
   * @param limit The number of groups to return.
   */
  searchGroups(term: string, limit: number): Observable<Group[]> {
    const params = new HttpParams()
      .set('search', term)
      .set('limit', limit.toString());
    return this.http.get<Group[]>(this.baseUrl, { params });
  }

  /**
   * POST /group/recommendations → Get group recommendations
   * @param filterMean The filter mean to use for recommendations.
   */
  recommendGroups(filterMean: Filter): Observable<Group[]> {
    return this.http.post<Group[]>(`${this.baseUrl}/recommendations`, filterMean);
  }

  /**
   * GET /group/user/{user_id} → Get groups by user ID
   * @param userId The ID of the user to get groups for.
   */
  getGroupsByUser(userId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.baseUrl}/user/${userId}`);
  }

  
  getGroupByCode(code: string): Observable<GroupRecommendation> {
    return this.http.get<GroupRecommendation>(`${this.baseUrl}/by-code/${code}`);
  }
  
}
