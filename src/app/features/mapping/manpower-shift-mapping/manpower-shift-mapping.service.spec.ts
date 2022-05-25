import { TestBed } from '@angular/core/testing';

import { ManpowerShiftMappingService } from './manpower-shift-mapping.service';

describe('ManpowerShiftMappingService', () => {
  let service: ManpowerShiftMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManpowerShiftMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
