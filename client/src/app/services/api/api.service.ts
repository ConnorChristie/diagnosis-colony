import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getResearchInterests(storyId: number) {
    return this.http.get<string[]>(`/api/stories/${storyId}/researchers`);
  }

  submitResearchInterest(storyId: number, user: string) {
    return this.http.post(`/api/stories/${storyId}/researchers`, {
      user
    });
  }

  removeResearchInterest(storyId: number, user: string) {
    return this.http.delete(`/api/stories/${storyId}/researchers/${user}`);
  }
}
