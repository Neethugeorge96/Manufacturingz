import { TestBed } from '@angular/core/testing';

import { ManpowerToTaskService } from './manpower-to-task.service';

describe('ManpowerToTaskService', () => {
  let service: ManpowerToTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManpowerToTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
