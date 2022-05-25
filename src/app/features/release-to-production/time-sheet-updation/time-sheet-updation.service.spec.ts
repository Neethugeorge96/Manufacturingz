import { TestBed } from '@angular/core/testing';

import { TimeSheetUpdationService } from './time-sheet-updation.service';

describe('TimeSheetUpdationService', () => {
  let service: TimeSheetUpdationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeSheetUpdationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
