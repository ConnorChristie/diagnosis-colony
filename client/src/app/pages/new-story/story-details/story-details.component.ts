import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IStoryDetails, NewStoryService, Step } from '../../../services/new-story/new-story.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {
  public detailsForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    details: new FormControl(null, Validators.required),
    fundingDuration: new FormControl(30, Validators.required)
  });

  constructor(
    private newStoryService: NewStoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.newStoryService
      .getDetails(Step.STEP1)
      .pipe(
        filter(x => !!x)
      )
      .subscribe(details => {
        this.detailsForm.patchValue(details);
      });
  }

  onSubmit() {
    const details = this.detailsForm.value as IStoryDetails;
    const isValid = this.detailsForm.valid;

    this.newStoryService.setDetails(Step.STEP1, details, isValid)
      .subscribe(success => {
        if (success && isValid) {
          this.router.navigate(['/story', 'condition']);
        }
      });
  }
}
