import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { IStoryTask } from '../../models/story';
import { ColonyService } from '../../services/colony/colony.service';

enum ViewState {
  CONDITION = 1,
  SYMPTOMS = 2,
  IMAGES = 3,
  QUESTIONS = 4,
  SUBMIT = 5
}

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {
  public story: IStoryTask;

  public viewState = ViewState.CONDITION;
  public ViewState = ViewState;

  constructor(
    private colonyService: ColonyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id'))
      )
      .subscribe(id => this.loadStory(id));
  }

  private loadStory(id: number) {
    this.colonyService.getStory(id).subscribe(story => this.story = story);
  }
}
