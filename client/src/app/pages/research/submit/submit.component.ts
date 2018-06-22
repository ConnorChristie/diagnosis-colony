import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IResearch } from '../../../models/research';
import { IStoryTask } from '../../../models/story';
import { ColonyService } from '../../../services/colony/colony.service';

@Component({
  selector: 'app-research-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.scss']
})
export class SubmitComponent implements OnInit {
  @Input() public story: IStoryTask;

  public researchForm = new FormGroup({
    causes: new FormControl(null, Validators.required),
    treatments: new FormControl(null, Validators.required),
    symptoms: new FormControl(null, Validators.required),
    references: new FormControl(null, Validators.required)
  });

  constructor(private colonyService: ColonyService) { }

  ngOnInit() {
  }

  onSubmit() {
    const details = this.researchForm.value as IResearch;
    const valid = this.researchForm.valid && this.story;

    // TODO: Save intermittent research data
    if (valid) {
      this.colonyService.submitResearch(this.story.id, details).subscribe(() => {
        alert('Successfully submitted research.');
      });
    }
  }
}
