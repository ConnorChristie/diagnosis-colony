import { inject, TestBed } from '@angular/core/testing';

import { EthersNetworkService } from './ethers-network.service';

describe('EthersServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthersNetworkService]
    });
  });

  it('should be created', inject(
    [EthersNetworkService],
    (service: EthersNetworkService) => {
      expect(service).toBeTruthy();
    }
  ));
});
