import { Component, Input } from '@angular/core';
import { combineLatest, of, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { IStoryTask } from '../../models/story';
import { ColonyService } from '../../services/colony/colony.service';
import { IPostCardDetails } from '../post-card/post-card.component';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent {
  public cardDetails$: Observable<IPostCardDetails>;

  constructor(private colonyService: ColonyService) {}

  // TODO: Include authors / researchers working on the story
  @Input()
  set story(storyTask: Observable<IStoryTask>) {
    if (!storyTask) {
      return;
    }

    this.cardDetails$ = storyTask.pipe(
      flatMap(({ id }) =>
        combineLatest(
          of(id),
          this.colonyService.getStoryPayout(id),
          this.colonyService.getStoryDetails(id)
        )
      ),
      map(([id, payout, story]) => ({
        id: id,
        title: story.storyDetails.title,
        description: story.storyDetails.details,
        category: story.conditionDetails.category,
        image: story.storyDetails.mainImage.raw,

        metadata: `Raised ${payout.toNumber()} DIAG`,
        progress: (1200 / 1500) * 100,

        contributors: []
      }))
    );
  }
}
