import { Component, Input, OnInit } from '@angular/core';
import { IConditionDetails } from '../../../models/story';

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
