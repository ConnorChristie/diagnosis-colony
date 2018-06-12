import { inject, TestBed } from '@angular/core/testing';

import { IpfsNetworkService } from './ipfs-network.service';

describe('IpfsNetworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IpfsNetworkService]
    });
  });

  it('should be created', inject(
    [IpfsNetworkService],
    (service: IpfsNetworkService) => {
      expect(service).toBeTruthy();
    }
  ));
});
