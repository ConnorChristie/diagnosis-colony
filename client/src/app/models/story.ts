interface IImage {
  raw: string;
}

export interface IStoryDetails {
  title: string;
  details: string;
  mainImage: IImage;
}

export interface IConditionDetails {
  category: string;
  symptoms: string;
  details: string;
  images: IImage[];
}

export interface IStory {
  storyDetails: IStoryDetails;
  conditionDetails: IConditionDetails;

  version: number;
}

export interface IStoryTask {
  id: number;
  story: IStory;
  potId: number;
  dueDate: number;
  delivered: boolean;
}
