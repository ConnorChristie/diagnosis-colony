import { Injectable } from '@nestjs/common';

@Injectable()
export class StoriesService {
  private researchInterests: { [story: number]: string[] } = {};

  getResearchInterests(storyId: number): string[] {
    return this.researchInterests[storyId] || [];
  }

  addResearchInterest(storyId: number, user: string) {
    const userLowered = user.toLowerCase();
    const users = this.researchInterests[storyId] || [];

    if (!users.some(x => x === userLowered)) {
      users.push(userLowered);
    }

    this.researchInterests[storyId] = users;
  }

  removeResearchInterest(storyId: number, user: string) {
    const userLowered = user.toLowerCase();
    const users = this.researchInterests[storyId] || [];

    if (users.some(x => x === userLowered)) {
      users.splice(users.indexOf(userLowered), 1);
    }

    this.researchInterests[storyId] = users;
  }
}
