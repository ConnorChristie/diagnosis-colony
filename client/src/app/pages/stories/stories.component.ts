import { Component } from '@angular/core';
import { IPostCardDetails } from '../../components/post-card/post-card.component';
import { CurrencyPipe } from '@angular/common';
import { IAuthor } from '../../components/author-list/author-list.component';

interface IStoryHeader {
  author: string;
  description: string;
  category: string;
  link: string;
  image: string;

  funded: number;
  fundGoal: number;

  contributors: IAuthor[];
}

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
  providers: [CurrencyPipe]
})
export class StoriesComponent {
  public stories: IStoryHeader[] = [
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image:
        'https://blog.ghost.org/content/images/2018/01/ghostzapimg--3-.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image:
        'https://blog.ghost.org/content/images/2018/01/ghostzapimg--3-.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image: 'https://blog.ghost.org/content/images/2018/04/codeinj--2-.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image: 'https://blog.ghost.org/content/images/2018/04/excerpts3.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image: 'https://blog.ghost.org/content/images/2017/07/hemingway.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image:
        'https://images.unsplash.com/photo-1502888395188-799b90b43871?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy' +
        '&amp;cs=tinysrgb&amp;w=1080&amp;fit=max&amp;s=a27af800130b6bf7eba979e5bcd030b2',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image: 'https://blog.ghost.org/content/images/2017/08/social-main-1.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    },
    {
      author: 'Peter Giles',
      description:
        'Ever wanted to connect external services to your Ghost site and create seamless automation between them? Now you can, ' +
        'with our new and official integration with Zapier.',
      category: 'Physical',
      link: '/',
      image:
        'https://blog.ghost.org/content/images/2017/11/DSCF1207-Edit--2-.jpg',

      funded: 14900,
      fundGoal: 20000,

      contributors: [
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
      ]
    }
  ];

  constructor(private currencyPipe: CurrencyPipe) {}

  get cards(): IPostCardDetails[] {
    return this.stories.map(story => ({
      id: 'peter-giles-1',
      title: story.author,
      description: story.description,
      category: story.category,
      image: story.image,

      metadata: `Raised ${this.currencyPipe.transform(story.funded, 'USD')}`,
      progress: (story.funded / story.fundGoal) * 100,

      contributors: story.contributors
    }));
  }

  calculateFlex(index: number) {
    const relative = index % 6;

    switch (relative) {
      case 1:
      case 4:
        return 'flex-quarter';
    }

    return 'flex-half';
  }
}
