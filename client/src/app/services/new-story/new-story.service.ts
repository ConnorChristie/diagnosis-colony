import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { filter, map, switchMap } from 'rxjs/operators';
import { concat, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface IStoryDetails {
  title: string;
  details: string;
  fundingDuration: number;
}

export interface IConditionDetails {}

export interface IFundingDetails {}

export enum Step {
  STEP1 = 1,
  STEP2 = 2,
  STEP3 = 3
}

interface IStoryProgress {
  [step: number]: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewStoryService {
  public static ROUTES = {
    [Step.STEP1]: ['/story', 'details'],
    [Step.STEP2]: ['/story', 'condition'],
    [Step.STEP3]: ['/story', 'funding']
  };

  private static PROGRESS_KEY = 'new-story/progress';

  constructor(
    private localStorage: LocalStorage,
    private route: ActivatedRoute
  ) {}

  getProgress() {
    return this.localStorage.getItem<IStoryProgress>(NewStoryService.PROGRESS_KEY);
  }

  setDetails(
    step: Step,
    details: IStoryDetails | IConditionDetails | IFundingDetails,
    completed: boolean
  ) {
    return concat(
      this.localStorage.setItem(`new-story/${step}`, details),
      this.setProgress(step, completed)
    );
  }

  getDetails(step: Step) {
    return this.localStorage.getItem(`new-story/${step}`);
  }

  getActiveStep(): Observable<Step> {
    const values = Object.values(Step).filter(x => !isNaN(x));

    return this.route.paramMap
      .pipe(
        filter(x => x.has('step')),
        map(x => x.get('step').toLowerCase()),
        map(stepName => {
          for (let step of values) {
            if (NewStoryService.ROUTES[step][1] === stepName) {
              return step;
            }
          }
        })
      );
  }

  private setProgress(step: Step, completed: boolean) {
    return this.localStorage.getItem<IStoryProgress>(NewStoryService.PROGRESS_KEY).pipe(
      map((progress: IStoryProgress) => {
        if (!progress) {
          progress = {
            [Step.STEP1]: false,
            [Step.STEP2]: false,
            [Step.STEP3]: false
          };
        }

        progress[step] = completed;

        return progress;
      }),
      switchMap(progress => {
        return this.localStorage.setItem(NewStoryService.PROGRESS_KEY, progress);
      })
    );
  }
}
