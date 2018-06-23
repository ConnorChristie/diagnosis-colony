import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { IPostCardDetails } from '../../components/post-card/post-card.component';
import { IStoryTask } from '../../models/story';
import { ColonyService } from '../../services/colony/colony.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public featuredCard: IPostCardDetails = {
    id: 0,
    title: 'Research Colony - Introduction to Medical',
    description:
      'We have just added the Medical domain to our researchColony! This includes the ability to create new stories along with ' +
      'allowing researchers and evaluators to sign-up to help figure out the causes!',
    category: 'New Things',
    contributors: [
      {
        name: 'Connor Christie',
        link: '/',
        image: '/assets/profile-me.png'
      }
    ],
    image:
      'https://images.unsplash.com/photo-1476136236990-838240be4859?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb' +
      '&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ&amp;s=102972864c7368a7bf02374c0a9ac06e'
  };

  public stories$: Observable<IStoryTask>[];

  constructor(private colonyService: ColonyService) {}

  ngOnInit() {
    this.colonyService.getStoryCount().subscribe(count => {
      if (count === 0) {
        return;
      }

      const skip = Math.max(0, count - 3);
      const take = Math.min(3, count);

      this.stories$ = this.colonyService.getStories(skip, take);
    });
  }
}
