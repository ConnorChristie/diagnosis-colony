import { Injectable } from '@nestjs/common';

@Injectable()
export class StoriesService {
  private researchInterests: { [story: number]: {} } = {};

  getResearchInterests(storyId: number) {
    return this.researchInterests[storyId] || {};
  }

  addResearchInterest(storyId: number, user: string, properties) {
    const userLowered = user.toLowerCase();
    const users = this.getResearchInterests(storyId);

    users[userLowered] = properties;

    this.researchInterests[storyId] = users;
  }

  removeResearchInterest(storyId: number, user: string) {
    const userLowered = user.toLowerCase();
    const users = this.getResearchInterests(storyId);

    console.log(users);
    delete users[userLowered];
    console.log(users);
    this.researchInterests[storyId] = users;
  }
}
