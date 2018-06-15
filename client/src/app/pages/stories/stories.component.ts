import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ColonyService } from '../../services/colony/colony.service';
import { flatMap, map, tap } from 'rxjs/operators';
import { IStoryTask } from '../../models/story';
import { Observable } from 'rxjs';

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
  // public stories: IStoryHeader[] = [
  //   {
  //     author: 'Peter Giles',
  //     description:
  //       'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
  //       'with our new and official integration with Zapier.',
  //     category: 'Physical',
  //     link: '/',
  //     image:
  //       'https://blog.ghost.org/content/images/2018/01/ghostzapimg--3-.jpg',
  //
  //     funded: 14900,
  //     fundGoal: 20000,
  //
  //     contributors: [
  //       {
  //         name: 'Dr. O\'Neil',
  //         image:
  //           '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
  //         link: '/'
  //       },
  //       {
  //         name: 'Hannah Wolfe',
  //         image:
  //           '//www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&amp;d=mm&amp;r=x',
  //         link: '/'
  //       }
  //     ]
  //   }
  // ];

  public CardSize = CardSize;
  public stories$ = new Array(10);

  constructor(
    private colonyService: ColonyService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
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
      .map((story$, index) => this.loadStory(story$, skip, index));
  }

  private loadStory(
    story$: Observable<IStoryTask>,
    skip: number,
    index: number
  ) {
    const storyId = ColonyService.toStoryId(skip, index);

    return story$.pipe(
      flatMap(story => this.storyToCard(storyId, story, index))
    );
  }

  // TODO: Include authors / researchers working on the story
  private storyToCard(storyId: number, storyTask: IStoryTask, index: number) {
    let characterLimit = 140;

    if (this.getCardSize(index) === CardSize.HALF) {
      characterLimit = 200;
    }

    const { story, potId } = storyTask;

    return this.colonyService.getPotBalance(potId).pipe(
      map(potBalance => potBalance.toNumber()),
      map(potBalance => ({
        id: storyId,
        title: story.storyDetails.title,
        description:
          story.storyDetails.details.substring(0, characterLimit) + '…',
        category: story.conditionDetails.category,
        image: story.storyDetails.mainImage,

        metadata: `Raised ${potBalance} DIAG`,
        progress: (1200 / 1500) * 100,

        contributors: []
      }))
    );
  }
}
