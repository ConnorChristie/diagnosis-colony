import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';

import { IStoryDetails } from '../../../models/story';
import {
  NewStoryService,
  Step
} from '../../../services/new-story/new-story.service';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {
  public faTimes = faTimes;

  public detailsForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    details: new FormControl(null, Validators.required),
    mainImage: new FormGroup({
      raw: new FormControl(null, Validators.required)
    })
  });

  constructor(
    private newStoryService: NewStoryService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.newStoryService
      .getDetails<IStoryDetails>(Step.STEP1)
      .pipe(filter(x => !!x))
      .subscribe(details => {
        this.detailsForm.patchValue(details);
      });
  }

  onSave() {
    const details = this.detailsForm.value as IStoryDetails;

    this.newStoryService
      .setDetails(Step.STEP1, details, false)
      .subscribe(async () => alert('Successfully saved your story.'));
  }

  onSubmit() {
    const details = this.detailsForm.value as IStoryDetails;
    const isValid = this.detailsForm.valid;

    this.newStoryService
      .setDetails(Step.STEP1, details, isValid)
      .subscribe(async success => {
        if (success && isValid) {
          await this.router.navigate(NewStoryService.ROUTES[Step.STEP2]);
        }
      });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.detailsForm.patchValue({
          mainImage: { raw: reader.result }
        });

        event.target.value = '';
        this.cd.markForCheck();
      };
    }
  }

  deleteImage() {
    this.detailsForm.get('mainImage').reset();
  }

  isInvalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }
}
