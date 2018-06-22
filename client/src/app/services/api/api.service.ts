import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getResearchInterests(storyId: number) {
    return this.http.get<{}>(`/api/stories/${storyId}/researchers`);
  }

  submitResearchInterest(storyId: number, user: string, duration: number) {
    return this.http.post(`/api/stories/${storyId}/researchers`, {
      user,
      duration
    });
  }

  removeResearchInterest(storyId: number, user: string) {
    return this.http.delete(`/api/stories/${storyId}/researchers/${user}`);
  }
}
