import { Component, Input, OnInit } from '@angular/core';
import { IConditionDetails } from '../../../services/new-story/new-story.service';

@Component({
  selector: 'app-research-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent implements OnInit {
  @Input() public details: IConditionDetails;

  constructor() {}

  ngOnInit() {}
}
