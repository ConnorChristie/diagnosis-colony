import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IStoryTask } from '../../models/story';
import { ColonyService } from '../../services/colony/colony.service';
import { IPostCardDetails } from '../post-card/post-card.component';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent {
  public cardDetails: Observable<IPostCardDetails>;

  constructor(private colonyService: ColonyService) {}

  // TODO: Include authors / researchers working on the story
  @Input()
  set story(storyTask: IStoryTask) {
    if (!storyTask) {
      return;
    }

    const { id, story, potId } = storyTask;

    this.cardDetails = this.colonyService.getPotBalance(potId).pipe(
      map(potBalance => potBalance.toNumber()),
      map<number, IPostCardDetails>(potBalance => ({
        id: id,
        title: story.storyDetails.title,
        description: story.storyDetails.details,
        category: story.conditionDetails.category,
        image: story.storyDetails.mainImage.raw,

        metadata: `Raised ${potBalance} DIAG`,
        progress: (1200 / 1500) * 100,

        contributors: []
      }))
    );
  }
}
