import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { TaskRole } from '../../models/task-role';

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
    role: TaskRole,
    rating: number,
    secret: string
  ) {
    return this.localStorage.setItem(`rating/${storyId}/${role}`, {
      rating,
      secret
    });
  }

  getRatingSecret(storyId: number, role: TaskRole) {
    return this.localStorage.getItem<IRating>(`rating/${storyId}/${role}`);
  }

  removeRatingSecret(storyId: number, role: TaskRole) {
    return this.localStorage.removeItem(`rating/${storyId}/${role}`);
  }
}
