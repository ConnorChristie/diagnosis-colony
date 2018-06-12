import { inject, TestBed } from '@angular/core/testing';

import { NewStoryService } from './new-story.service';

describe('NewStoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewStoryService]
    });
  });

  it('should be created', inject(
    [NewStoryService],
    (service: NewStoryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
