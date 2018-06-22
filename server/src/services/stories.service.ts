import { Injectable } from '@nestjs/common';

@Injectable()
export class StoriesService {
  private researchInterests: { [story: number]: {} } = {};

  getResearchInterests(storyId: number) {
    return this.researchInterests[storyId] || {};
  }

  addResearchInterest(storyId: number, user: string, duration: number) {
    const userLowered = user.toLowerCase();
    const users = this.getResearchInterests(storyId);

    users[userLowered] = { duration };

    this.researchInterests[storyId] = users;
  }

  removeResearchInterest(storyId: number, user: string) {
    const userLowered = user.toLowerCase();
    const users = this.getResearchInterests(storyId);

    delete users[userLowered];

    this.researchInterests[storyId] = users;
  }
}
