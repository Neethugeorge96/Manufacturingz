import { TestBed } from '@angular/core/testing';

import { ProductionShiftService } from './production-shift.service';

describe('ProductionShiftService', () => {
  let service: ProductionShiftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionShiftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
