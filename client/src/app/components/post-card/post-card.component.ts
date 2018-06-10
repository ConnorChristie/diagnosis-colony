import { Component, Input } from '@angular/core';

interface IPostContributor {
  name: string;
  image: string;
  link: string;
}

export interface IPostCardDetails {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;

  metadata?: string;
  progress?: number;

  contributors: IPostContributor[];
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {
  @Input() public details: IPostCardDetails;

  constructor() {}

  get link() {
    return ['/stories', this.details.id];
  }
}
