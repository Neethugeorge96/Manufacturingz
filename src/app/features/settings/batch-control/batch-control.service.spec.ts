import { TestBed } from '@angular/core/testing';

import { BatchControlService } from './batch-control.service';

describe('BatchControlService', () => {
  let service: BatchControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
