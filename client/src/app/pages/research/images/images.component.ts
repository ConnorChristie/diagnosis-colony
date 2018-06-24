import { Component, Input, OnInit } from '@angular/core';
import { IConditionDetails } from '../../../models/story';

@Component({
  selector: 'app-research-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  @Input() public details: IConditionDetails;

  constructor() {}

  ngOnInit() {}
}
