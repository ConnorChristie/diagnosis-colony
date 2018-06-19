import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IResearch } from '../../../models/research';
import { ColonyService } from '../../../services/colony/colony.service';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})
export class ResearchComponent implements OnInit {
  @Input() public storyId: number;

  public researchForm = new FormGroup({
    causes: new FormControl(null, Validators.required),
    treatments: new FormControl(null, Validators.required),
    symptoms: new FormControl(null, Validators.required),
    references: new FormControl(null, Validators.required)
  });

  constructor(private colonyService: ColonyService) {}

  ngOnInit() {}

  onSubmit() {
    const details = this.researchForm.value as IResearch;
    const valid = this.researchForm.valid;

    // TODO: Save intermittent research data
    if (valid) {
      this.colonyService.submitResearch(this.storyId, details).subscribe(() => {
        alert('Successfully submitted research.');
      });
    }
  }
}
