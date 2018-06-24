import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms/src/model';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs/operators';

import { IOption } from '../../../components/select/select.component';
import { IConditionDetails } from '../../../models/story';
import {
  NewStoryService,
  Step
} from '../../../services/new-story/new-story.service';

@Component({
  selector: 'app-condition-details',
  templateUrl: './condition-details.component.html',
  styleUrls: ['./condition-details.component.scss']
})
export class ConditionDetailsComponent implements OnInit {
  public faTimes = faTimes;

  public detailsForm = new FormGroup({
    category: new FormControl('physical', Validators.required),
    symptoms: new FormControl(null, Validators.required),
    details: new FormControl(null, Validators.required),
    images: new FormArray([])
  });

  public categories: IOption[] = [
    {
      name: 'Physical',
      value: 'physical'
    },
    {
      name: 'Physiological',
      value: 'physiological'
    }
  ];

  constructor(
    private newStoryService: NewStoryService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.newStoryService
      .getDetails<IConditionDetails>(Step.STEP2)
      .pipe(filter(x => !!x))
      .subscribe(details => {
        this.detailsForm.patchValue(details);

        details.images.forEach(image => {
          this.addImage(image.raw);
        });
      });
  }

  onSave() {
    const details = this.detailsForm.value as IConditionDetails;

    this.newStoryService
      .setDetails(Step.STEP2, details, false)
      .subscribe(async () => alert('Successfully saved your story.'));
  }

  onSubmit() {
    const details = this.detailsForm.value as IConditionDetails;
    const isValid = this.detailsForm.valid;

    this.newStoryService
      .setDetails(Step.STEP2, details, isValid)
      .subscribe(async success => {
        if (success && isValid) {
          await this.router.navigate(NewStoryService.ROUTES[Step.STEP3]);
        }
      });
  }

  async onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files: File[] = Array.from<File>(event.target.files);

      const contentPromises = files.map(file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise(res => {
          reader.onload = () => {
            res(reader.result);
          };
        });
      });

      // tslint:disable-next-line
      const content: any[] = await Promise.all(contentPromises);

      content.forEach(file => {
        this.addImage(file);
      });

      event.target.value = '';
      this.cd.markForCheck();
    }
  }

  deleteImage(index: number) {
    this.images.removeAt(index);
  }

  get images() {
    return this.detailsForm.controls.images as FormArray;
  }

  isInvalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  private addImage(image: string) {
    this.images.push(
      new FormGroup({
        raw: new FormControl(image)
      })
    );
  }
}
