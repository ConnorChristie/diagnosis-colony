import { Component, OnInit } from '@angular/core';
import { IAuthor } from '../../components/author-list/author-list.component';
import { ColonyService } from '../../services/colony/colony.service';
import { ActivatedRoute } from '@angular/router';
import { filter, flatMap, map } from 'rxjs/operators';
import { IStory, IStoryTask } from '../../models/story';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EthersNetworkService } from '../../services/networks/ethers-network/ethers-network.service';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss']
})
export class StoryComponent implements OnInit {
  public authors: IAuthor[] = [];
  public story: IStoryTask;

  public fundingForm = new FormGroup({
    diagAmount: new FormControl(null, Validators.required),
    currencyAmount: new FormControl({ value: null, disabled: true })
  });

  constructor(
    private colonyService: ColonyService,
    private ethersNetworkService: EthersNetworkService,
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

    // TODO: create txn to send funds to colony
  }

  async onStartResearch() {
    const address = await this.ethersNetworkService.getUserAddress();

    this.colonyService.setWorker(this.story.id, address).subscribe();
  }

  private loadStory() {
    this.route.paramMap
      .pipe(
        filter(x => x.has('id')),
        map(x => +x.get('id'))
      )
      .subscribe(id => {
        this.colonyService
          .getStory(id)
          .subscribe(story => (this.story = story));

        this.loadWorkers(id);
      });
  }

  private loadWorkers(storyId: number) {
    this.colonyService.getTaskRoles(storyId).subscribe(roles => {
      const authors = [];

      if (roles.manager.address) {
        this.authors.push({
          name: roles.manager.address,
          subtitle: 'Story Manager',
          description: 'Doctor at Yale Medical College',
          image: '//www.gravatar.com/avatar/f95828f4e92f1befebabfb7f65cdc8f2?s=250&amp;d=mm&amp;r=x',
          link: '/'
        });
      }

      if (roles.evaluator.address) {
        this.authors.push({
          name: roles.evaluator.address,
          subtitle: 'Story Evaluator',
          description: 'Doctor at Yale Medical College',
          image: 'https://www.gravatar.com/avatar/85a47a60d579572601ff74b72fe8b32d?s=250&d=mm&r=x',
          link: '/'
        });
      }

      if (roles.worker.address) {
        this.authors.push({
          name: roles.worker.address,
          subtitle: 'Primary Researcher',
          description: 'Doctor at Yale Medical College',
          image: 'https://www.gravatar.com/avatar/49ebcbbe9bb3ed1f5d5de91483de383c?s=250&d=mm&r=x',
          link: '/'
        });
      }

      this.authors = authors;
    });
  }
}
