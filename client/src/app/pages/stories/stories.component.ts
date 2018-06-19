import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ColonyService } from '../../services/colony/colony.service';

enum CardSize {
  THIRD = 1,
  HALF = 2
}

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  providers: [CurrencyPipe]
})
export class StoriesComponent implements OnInit {
  public CardSize = CardSize;
  public stories$ = new Array(10);

  constructor(private colonyService: ColonyService) {}

  ngOnInit() {
    // TODO: Don't load every single story at once
    this.colonyService.getStoryCount().subscribe(x => {
      this.loadStories(0, x);
    });
  }

  getCardSize(index: number) {
    const relative = index % 6;

    switch (relative) {
      case 1:
      case 4:
        return CardSize.THIRD;
    }

    return CardSize.HALF;
  }

  private loadStories(skip: number, take: number) {
    this.stories$ = this.colonyService
      .getStories(skip, take)
      .map((story$, index) =>
        story$.pipe(
          tap(story => {
            let characterLimit = 140;

            if (this.getCardSize(index) === CardSize.HALF) {
              characterLimit = 200;
            }

            if (story.story.storyDetails.details.length <= characterLimit) {
              return;
            }

            // TODO: Smarter truncation
            story.story.storyDetails.details =
              story.story.storyDetails.details.substring(0, characterLimit) +
              '…';
          })
        )
      );
  }
}
