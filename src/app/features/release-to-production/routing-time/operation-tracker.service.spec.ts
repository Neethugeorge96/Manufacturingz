import { TestBed } from '@angular/core/testing';

import { OperationTrackerService } from './operation-tracker.service';

describe('OperationTrackerService', () => {
  let service: OperationTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
