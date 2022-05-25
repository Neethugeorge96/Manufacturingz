import { TestBed } from '@angular/core/testing';

import { ProductionClosingService } from './production-closing.service';

describe('ProductionClosingService', () => {
  let service: ProductionClosingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionClosingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
