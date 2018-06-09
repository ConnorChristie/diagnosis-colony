import { Component, Input } from '@angular/core';

export interface ICardDetails {
  title: string;
  description: string;
  category: string;
  author: string;
  link: string;
  image: string;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input()
  public details: ICardDetails;

  constructor() { }

}
