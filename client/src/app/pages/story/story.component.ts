import { Component, OnInit } from '@angular/core';
import { IAuthor } from '../../components/author-list/author-list.component';
import { ColonyService } from '../../services/colony/colony.service';
import { ActivatedRoute } from '@angular/router';
import { filter, flatMap, map } from 'rxjs/operators';
import { IStory } from '../../models/story';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  public authors: IAuthor[] = [
    {
      name: 'Dr. O\'Neil',
      image:
        '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
      link: '/'
    },
    {
      name: 'Hannah Wolfe',
      image:
        '//www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&amp;d=mm&amp;r=x',
      link: '/'
    }
  ];

  public story: IStory;

  public fundingForm = new FormGroup({
    diagAmount: new FormControl(null, Validators.required),
    currencyAmount: new FormControl({ value: null, disabled: true })
  });

  constructor(
    private colonyService: ColonyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadStory();

    this.fundingForm.controls.diagAmount.valueChanges.subscribe(value => {
      this.fundingForm.controls.currencyAmount.setValue(value / 10);
    });
  }

  onSubmitContribution() {
    const valid = this.fundingForm.valid;

    if (valid) {

    }
  }

  private loadStory() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id')),
        flatMap(id => this.colonyService.getStory(id))
      )
      .subscribe(story => {
        this.story = story;
      });
  }
}
