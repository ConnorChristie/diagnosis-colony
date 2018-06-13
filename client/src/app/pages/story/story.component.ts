import { Component, OnInit } from '@angular/core';
import { IAuthor } from '../../components/author-list/author-list.component';
import { ColonyService } from '../../services/colony/colony.service';
import { ActivatedRoute } from '@angular/router';
import { filter, flatMap, map } from 'rxjs/operators';
import { IStory } from '../../models/story';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  public authors: IAuthor[] = [
    {
      name: 'Dr. O\'Neil',
      image:
        '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
      link: '/'
    },
    {
      name: 'Hannah Wolfe',
      image:
        '//www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&amp;d=mm&amp;r=x',
      link: '/'
    }
  ];

  public story: IStory;

  constructor(
    private colonyService: ColonyService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id')),
        flatMap(id => this.colonyService.getStoryDetails(id))
      )
      .subscribe(story => {
        this.story = story;
      });
  }
}
