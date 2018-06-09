import { Component } from '@angular/core';
import { IPostCardDetails } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public featuredCard: IPostCardDetails = {
    title: 'Unsplash x Ghost',
    description: 'We\'ve just released an official Unsplash integration for Ghost; Now you can find and use beautiful free photos from the world\'s most generous community of photographers! No matter what case study you look',
    category: 'New Things',
    author: 'Connor Christie',
    link: '/',
    image: 'https://images.unsplash.com/photo-1476136236990-838240be4859?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;ixid=eyJhcHBfaWQiOjExNzczfQ&amp;s=102972864c7368a7bf02374c0a9ac06e'
  };

  public cards: IPostCardDetails[] = [
    {
      title: 'Unsplash x Ghost',
      description: 'We\'ve just released an official Unsplash integration for Ghost; Now you can find and use beautiful free photos from the world\'s most generous community of photographers! No matter what case study you look',
      category: 'New Things',
      author: 'Connor Christie',
      link: '/',
      image: 'https://images.unsplash.com/photo-1502888395188-799b90b43871?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=a27af800130b6bf7eba979e5bcd030b2'
    },
    {
      title: 'Unsplash x Ghost',
      description: 'We\'ve just released an official Unsplash integration for Ghost; Now you can find and use beautiful free photos from the world\'s most generous community of photographers! No matter what case study you look',
      category: 'New Things',
      author: 'Connor Christie',
      link: '/',
      image: 'https://images.unsplash.com/photo-1502888395188-799b90b43871?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=a27af800130b6bf7eba979e5bcd030b2'
    },
    {
      title: 'Unsplash x Ghost',
      description: 'We\'ve just released an official Unsplash integration for Ghost; Now you can find and use beautiful free photos from the world\'s most generous community of photographers! No matter what case study you look',
      category: 'New Things',
      author: 'Connor Christie',
      link: '/',
      image: 'https://images.unsplash.com/photo-1502888395188-799b90b43871?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=a27af800130b6bf7eba979e5bcd030b2'
    }
  ];

}
