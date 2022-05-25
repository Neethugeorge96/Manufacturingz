import { TestBed } from '@angular/core/testing';

import { ReleaseToProductionListService } from './release-to-production-list.service';

describe('ReleaseToProductionListService', () => {
  let service: ReleaseToProductionListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseToProductionListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
