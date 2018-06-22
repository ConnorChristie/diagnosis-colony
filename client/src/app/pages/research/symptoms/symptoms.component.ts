import { Component, Input, OnInit } from '@angular/core';
import { IConditionDetails } from '../../../services/new-story/new-story.service';

@Component({
  selector: 'app-research-symptoms',
  templateUrl: './symptoms.component.html',
  styleUrls: ['./symptoms.component.scss']
})
export class SymptomsComponent implements OnInit {
  @Input() public details: IConditionDetails;

  constructor() { }

  ngOnInit() {
  }

}
