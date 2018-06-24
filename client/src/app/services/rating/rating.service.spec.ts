import { inject, TestBed } from '@angular/core/testing';

import { RatingService } from './rating.service';

describe('ResearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatingService]
    });
  });

  it('should be created', inject([RatingService], (service: RatingService) => {
    expect(service).toBeTruthy();
  }));
});
