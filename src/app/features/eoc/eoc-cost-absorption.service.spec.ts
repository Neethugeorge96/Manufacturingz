import { TestBed } from '@angular/core/testing';

import { EocCostAbsorptionService } from './eoc-cost-absorption.service';

describe('EocCostAbsorptionService', () => {
  let service: EocCostAbsorptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EocCostAbsorptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
