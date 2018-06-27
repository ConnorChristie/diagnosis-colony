import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

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
    this.colonyService.getStoryCount().subscribe(count => {
      this.stories$ = this.colonyService.getStories(0, count);
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
}
