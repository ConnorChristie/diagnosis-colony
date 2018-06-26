import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface IResearchRequest {
  requestId: number;
  user: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getResearchInterests(storyId: number) {
    return this.http.get<{ [user: string]: IResearchRequest }>(
      `/api/stories/${storyId}/researchers`
    );
  }

  submitResearchInterest(
    storyId: number,
    user: string,
    duration: number,
    durationSig: {}
  ) {
    return this.http.post(`/api/stories/${storyId}/researchers`, {
      user,
      duration,
      durationSig
    });
  }

  removeResearchInterest(storyId: number, user: string) {
    return this.http.delete(`/api/stories/${storyId}/researchers/${user}`);
  }
}
