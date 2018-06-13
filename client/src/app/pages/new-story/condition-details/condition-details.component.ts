import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { IConditionDetails, NewStoryService, Step } from '../../../services/new-story/new-story.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IOption } from '../../../components/select/select.component';

@Component({
  selector: 'app-condition-details',
  templateUrl: './condition-details.component.html',
  styleUrls: ['./condition-details.component.scss']
})
export class ConditionDetailsComponent implements OnInit {
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
      });
  }

  onSubmit() {
    const details = this.detailsForm.value as IConditionDetails;
    const isValid = this.detailsForm.valid;

    this.newStoryService
      .setDetails(Step.STEP2, details, isValid)
      .subscribe(success => {
        if (success && isValid) {
          this.router.navigate(NewStoryService.ROUTES[Step.STEP3]);
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
      const imageControl = this.detailsForm.controls.images as FormArray;

      content.forEach(file => {
        imageControl.push(new FormControl(file));
      });

      this.cd.markForCheck();
    }
  }
}
