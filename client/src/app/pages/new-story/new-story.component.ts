import { Component, OnInit } from '@angular/core';
import { IStep } from '../../components/stepper/stepper.component';

@Component({
  selector: 'app-new-story',
  templateUrl: './new-story.component.html',
  styleUrls: ['./new-story.component.scss']
})
export class NewStoryComponent implements OnInit {

  public steps: IStep[] = [
    {
      name: 'Step 1: Story Details',
      link: ['/story', 'details'],
      isActive: true
    },
    {
      name: 'Step 2: Condition Details',
      link: ['/story', 'condition'],
      isActive: false
    },
    {
      name: 'Step 3: Funding',
      link: ['/story', 'funding'],
      isActive: false
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
