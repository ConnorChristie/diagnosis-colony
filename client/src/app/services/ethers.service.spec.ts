import { TestBed, inject } from '@angular/core/testing';

import { EthersService } from './ethers.service';

describe('EthersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthersService]
    });
  });

  it('should be created', inject([EthersService], (service: EthersService) => {
    expect(service).toBeTruthy();
  }));
});
