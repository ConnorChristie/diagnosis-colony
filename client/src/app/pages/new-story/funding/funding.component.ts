import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IFundingDetails,
  NewStoryService,
  Step
} from '../../../services/new-story/new-story.service';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.scss']
})
export class FundingComponent implements OnInit {
  public detailsForm = new FormGroup({
    duration: new FormControl(30, Validators.required),
    initialFunds: new FormControl(0, Validators.required)
  });

  constructor(
    private newStoryService: NewStoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.newStoryService
      .getDetails<IFundingDetails>(Step.STEP3)
      .pipe(filter(x => !!x))
      .subscribe(details => {
        this.detailsForm.patchValue(details);
      });
  }

  onSubmit() {
    const details = this.detailsForm.value as IFundingDetails;
    const isValid = this.detailsForm.valid;

    this.newStoryService
      .setDetails(Step.STEP3, details, isValid)
      .subscribe(success => {
        if (success && isValid) {
          this.newStoryService.saveStory().subscribe(id => {
            this.router.navigate(['/stories', id]);
          });
        }
      });
  }
}
