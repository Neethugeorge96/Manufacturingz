import { TestBed } from '@angular/core/testing';

import { MachineWorkCenterService } from './machine-work-center.service';

describe('MachineWorkCenterService', () => {
  let service: MachineWorkCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MachineWorkCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
