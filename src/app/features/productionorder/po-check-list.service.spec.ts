import { TestBed } from '@angular/core/testing';

import { POCheckListService } from './po-check-list.service';

describe('POCheckListService', () => {
  let service: POCheckListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POCheckListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
