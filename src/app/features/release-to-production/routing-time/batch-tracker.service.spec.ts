import { TestBed } from '@angular/core/testing';

import { BatchTrackerService } from './batch-tracker.service';

describe('BatchTrackerService', () => {
  let service: BatchTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
