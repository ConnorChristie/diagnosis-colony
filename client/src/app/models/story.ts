import { IConditionDetails, IFundingDetails, IStoryDetails } from '../services/new-story/new-story.service';

export interface IStory {
  storyDetails: IStoryDetails;
  conditionDetails: IConditionDetails;
  fundingDetails: IFundingDetails;

  version: number;
}
