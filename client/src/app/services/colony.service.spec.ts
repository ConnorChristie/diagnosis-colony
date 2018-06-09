import { inject, TestBed } from '@angular/core/testing';

import { ColonyService } from './colony.service';

describe('ColonyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColonyService]
    });
  });

  it('should be created', inject([ColonyService], (service: ColonyService) => {
    expect(service).toBeTruthy();
  }));
});
