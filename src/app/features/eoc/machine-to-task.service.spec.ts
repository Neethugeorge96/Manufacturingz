import { TestBed } from '@angular/core/testing';

import { MachineToTaskService } from './machine-to-task.service';

describe('MachineToTaskService', () => {
  let service: MachineToTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineToTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
