import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { filter, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ColonyService } from '../colony/colony.service';
import { IStory } from '../../models/story';

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

export interface IFundingDetails {
  duration: number;
  initialFunds: number;
}

type StoryDetails = IStoryDetails | IConditionDetails | IFundingDetails;

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

  private static DETAILS_KEY = 'new-story';
  private static PROGRESS_KEY = 'new-story/progress';

  constructor(
    private colonyService: ColonyService,
    private localStorage: LocalStorage,
    private route: ActivatedRoute
  ) {}

  static getSteps(): Step[] {
    return [Step.STEP1, Step.STEP2, Step.STEP3];
  }

  static getStepKey(step: Step) {
    return `${NewStoryService.DETAILS_KEY}/${step}`;
  }

  /**
   * Saves the story
   * @returns {Observable<number>} The generated id
   */
  saveStory() {
    return forkJoin(
      this.getDetails<IStoryDetails>(Step.STEP1),
      this.getDetails<IConditionDetails>(Step.STEP2),
      this.getDetails<IFundingDetails>(Step.STEP3)
    ).pipe(
      map(
        ([details, condition, funding]): IStory => ({
          storyDetails: details,
          conditionDetails: condition,
          fundingDetails: funding,
          version: 1
        })
      ),
      flatMap(story => this.colonyService.createStory(story)),
      tap(() => this.clearAllDetails().subscribe())
    );
  }

  /**
   * Gets the overall step progress
   * @returns {Observable<IStoryProgress | null>} The step progress
   */
  getProgress() {
    return this.localStorage.getItem<IStoryProgress>(
      NewStoryService.PROGRESS_KEY
    );
  }

  /**
   * Sets the details for the specified step
   * @param {Step} step The step
   * @param {StoryDetails} details The details
   * @param {boolean} completed Whether it has been completed
   * @returns {Observable<boolean>} Whether the details were successfully saved
   */
  setDetails(step: Step, details: StoryDetails, completed: boolean) {
    return this.localStorage
      .setItem(NewStoryService.getStepKey(step), details)
      .pipe(flatMap(() => this.setProgress(step, completed)));
  }

  /**
   * Gets the details for the specified step
   * @param {Step} step The step
   * @returns {Observable<T extends StoryDetails>} The details for the step
   */
  getDetails<T extends StoryDetails>(step: Step): Observable<T> {
    return this.localStorage.getItem(NewStoryService.getStepKey(step));
  }

  /**
   * Gets the active step
   * @returns {Observable<Step>} The active step
   */
  getActiveStep(): Observable<Step> {
    return this.route.paramMap.pipe(
      filter(x => x.has('step')),
      map(x => x.get('step').toLowerCase()),
      map(stepName => {
        return NewStoryService.getSteps().find(
          step => NewStoryService.ROUTES[step][1] === stepName
        );
      })
    );
  }

  /**
   * Clears all of the details saved between steps
   * @returns {Observable<boolean[]>} Whether the details were removed successfully or not
   */
  clearAllDetails() {
    const stepClear$ = NewStoryService.getSteps().map(step =>
      this.localStorage.removeItem(NewStoryService.getStepKey(step))
    );

    return forkJoin<boolean>([
      ...stepClear$,
      this.localStorage.removeItem(NewStoryService.PROGRESS_KEY)
    ]);
  }

  /**
   * Sets whether the specified step is completed or not
   * @param {Step} step The step to update
   * @param {boolean} completed Whether it has been completed
   * @returns {Observable<boolean>} If the update was successful
   */
  private setProgress(step: Step, completed: boolean) {
    return this.localStorage
      .getItem<IStoryProgress>(NewStoryService.PROGRESS_KEY)
      .pipe(
        map((progress: IStoryProgress) => {
          if (!progress) {
            return NewStoryService.getSteps().reduce<IStoryProgress>(
              (prev, current) => {
                prev[current] = false;
                return prev;
              },
              {}
            );
          }

          return progress;
        }),
        tap((progress: IStoryProgress) => {
          progress[step] = completed;
        }),
        switchMap(progress => {
          return this.localStorage.setItem(
            NewStoryService.PROGRESS_KEY,
            progress
          );
        })
      );
  }
}
