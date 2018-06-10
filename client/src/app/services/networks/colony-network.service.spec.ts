import { inject, TestBed } from '@angular/core/testing';

import { ColonyNetworkService } from './colony-network.service';

describe('ColonyNetworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColonyNetworkService]
    });
  });

  it('should be created', inject(
    [ColonyNetworkService],
    (service: ColonyNetworkService) => {
      expect(service).toBeTruthy();
    }
  ));
});
