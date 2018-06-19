import { Component, OnInit } from '@angular/core';
import { IPostCardDetails } from '../../components/post-card/post-card.component';
import { ColonyService } from '../../services/colony/colony.service';
import { Observable } from 'rxjs';
import { IStoryTask } from '../../models/story';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public featuredCard: IPostCardDetails = {
    id: 0,
    title: 'News Post',
    description:
      'We\'ve just released an official Unsplash integration for Ghost; Now you can find and use beautiful free photos from the world\'s ' +
      'most generous community of photographers! No matter what case study you look',
    category: 'New Things',
    contributors: [
      {
        name: 'Connor Christie',
        link: '/',
        image:
          '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x'
      }
    ],
    image:
      'https://images.unsplash.com/photo-1476136236990-838240be4859?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb' +
      '&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ&amp;s=102972864c7368a7bf02374c0a9ac06e'
  };

  public stories$: Observable<IStoryTask>[];

  constructor(private colonyService: ColonyService) {}

  ngOnInit() {
    this.colonyService.getStoryCount().subscribe(x => {
      this.stories$ = this.colonyService
        .getStories(x - 3, 3);
    });
  }
}
