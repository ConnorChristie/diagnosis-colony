import { Component, Input } from '@angular/core';

interface IPostParticipant {
  name: string;
  image: string;
  link: string;
}

export interface IPostCardDetails {
  title: string;
  description: string;
  category: string;
  link: string;
  image: string;

  metadata: string;
  progress?: number;

  participants: IPostParticipant[];
}

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent {

  @Input()
  public details: IPostCardDetails;

  constructor() { }

}
