import { TestBed } from '@angular/core/testing';

import { CostPriceService } from './cost-price.service';

describe('CostPriceService', () => {
  let service: CostPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
