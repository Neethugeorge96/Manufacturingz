import { TestBed } from '@angular/core/testing';

import { WorkCenterCostOverheadMappingService } from './work-center-cost-overhead-mapping.service';

describe('WorkCenterCostOverheadMappingService', () => {
  let service: WorkCenterCostOverheadMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkCenterCostOverheadMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
