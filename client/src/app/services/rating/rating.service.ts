import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { StoryRole } from '../../models/story-role';

interface IRating {
  rating: number;
  secret: string;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  constructor(private localStorage: LocalStorage) {}

  saveRatingSecret(
    storyId: number,
    role: StoryRole,
    rating: number,
    secret: string
  ) {
    return this.localStorage.setItem(`rating/${storyId}/${role}`, {
      rating,
      secret
    });
  }

  getRatingSecret(storyId: number, role: StoryRole) {
    return this.localStorage.getItem<IRating>(`rating/${storyId}/${role}`);
  }

  removeRatingSecret(storyId: number, role: StoryRole) {
    return this.localStorage.removeItem(`rating/${storyId}/${role}`);
  }
}
