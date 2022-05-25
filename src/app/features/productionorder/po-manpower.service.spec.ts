import { TestBed } from '@angular/core/testing';

import { POManpowerService } from './po-manpower.service';

describe('POManpowerService', () => {
  let service: POManpowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POManpowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
