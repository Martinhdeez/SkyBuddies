import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// INTERFACE THAT DEFINES THE GROUP DATA
export interface Group {
  id: string;
  name: string;
  members: string[];
  visibility: 'public' | 'private';
  updated_at: string;
  created_at: string;
}

// INTERFACE THAT DEFINES THE GROUP DATA
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
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
    members: string[];
    visibility: 'public' | 'private';
  }): Observable<Group> {
    return this.http.post<Group>(this.baseUrl, payload);
  }

  /**
   * PUT /group/{group_id} → Update a group
   * @param groupId The ID of the group to update.
   * @param payload The data to update the group.
   */
  updateGroup(
    groupId: string,
    payload: {
      name?: string;
      members?: string[];
      visibility?: 'public' | 'private';
    }
  ): Observable<Group> {
    return this.http.put<Group>(`${this.baseUrl}/${groupId}`, payload);
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
    members: string[]
  ): Observable<Group> {
    return this.http.post<Group>(
      `${this.baseUrl}/${groupId}/add/members`,
      { members }
    );
  }

  /**
   * POST /group/{group_id}/remove/members → Remove members from a group
   * @param groupId The ID of the group.
   * @param members The list of member IDs to remove.
   */
  removeMembers(
    groupId: string,
    members: string[]
  ): Observable<Group> {
    return this.http.post<Group>(
      `${this.baseUrl}/${groupId}/remove/members`,
      { members }
    );
  }

  /**
   * GET /group/search → Search for N groups by name
   * @param term The search term.
   * @param n The number of groups to return.
   */
  searchGroups(term: string, n: string): Observable<Group[]> {
    const params = new HttpParams()
      .set('search', term)
      .set('limit', n);
    return this.http.get<Group[]>(this.baseUrl, { params });
  }
}
