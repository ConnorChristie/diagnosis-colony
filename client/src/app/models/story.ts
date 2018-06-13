import { IConditionDetails, IFundingDetails, IStoryDetails } from '../services/new-story/new-story.service';

export interface IStory
  extends IStoryDetails,
    IConditionDetails,
    IFundingDetails {}
