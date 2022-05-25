import { TestBed } from '@angular/core/testing';

import { ManpowerWorkcenterMappingService } from './manpower-workcenter-mapping.service';

describe('ManpowerWorkcenterMappingService', () => {
  let service: ManpowerWorkcenterMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManpowerWorkcenterMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
