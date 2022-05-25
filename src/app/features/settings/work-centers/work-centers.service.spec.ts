import { TestBed } from '@angular/core/testing';

import { WorkCentersService } from './work-centers.service';

describe('WorkCentersService', () => {
  let service: WorkCentersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkCentersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
