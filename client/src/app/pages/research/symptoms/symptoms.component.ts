import { Component, Input, OnInit } from '@angular/core';
import { IConditionDetails } from '../../../models/story';

@Component({
  selector: 'app-research-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.scss']
})
export class SymptomsComponent implements OnInit {
  @Input() public details: IConditionDetails;

  constructor() {}

  ngOnInit() {}
}
