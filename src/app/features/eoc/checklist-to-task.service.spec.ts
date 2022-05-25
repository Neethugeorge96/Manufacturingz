import { TestBed } from '@angular/core/testing';

import { ChecklistToTaskService } from './checklist-to-task.service';

describe('ChecklistToTaskService', () => {
  let service: ChecklistToTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChecklistToTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
