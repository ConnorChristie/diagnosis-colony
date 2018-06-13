import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { filter, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

export interface IStoryDetails {
  title: string;
  details: string;
  mainImage: string;
}

export interface IConditionDetails {
  category: string;
  symptoms: string;
  details: string;
  images: string[];
}

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

  static getSteps(): Step[] {
    return [Step.STEP1, Step.STEP2, Step.STEP3];
  }

  getProgress() {
    return this.localStorage.getItem<IStoryProgress>(NewStoryService.PROGRESS_KEY);
  }

  setDetails(
    step: Step,
    details: IStoryDetails | IConditionDetails | IFundingDetails,
    completed: boolean
  ) {
    return this.localStorage.setItem(`new-story/${step}`, details)
      .pipe(
        flatMap(() => this.setProgress(step, completed))
      );
  }

  getDetails(step: Step) {
    return this.localStorage.getItem(`new-story/${step}`);
  }

  getActiveStep(): Observable<Step> {
    return this.route.paramMap
      .pipe(
        filter(x => x.has('step')),
        map(x => x.get('step').toLowerCase()),
        map(stepName => {
          return NewStoryService.getSteps()
            .find(step => NewStoryService.ROUTES[step][1] === stepName);
        })
      );
  }

  private setProgress(step: Step, completed: boolean) {
    return this.localStorage.getItem<IStoryProgress>(NewStoryService.PROGRESS_KEY)
      .pipe(
        map((progress: IStoryProgress) => {
          if (!progress) {
            return NewStoryService.getSteps()
              .reduce<IStoryProgress>((prev, current) => {
                prev[current] = false;
                return prev;
              }, {});
          }

          return progress;
        }),
        tap((progress: IStoryProgress) => {
          progress[step] = completed;
        }),
        switchMap(progress => {
          return this.localStorage.setItem(NewStoryService.PROGRESS_KEY, progress);
        })
      );
  }
}
