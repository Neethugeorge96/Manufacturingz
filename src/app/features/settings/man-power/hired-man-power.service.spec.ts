import { TestBed } from '@angular/core/testing';

import { HiredManPowerService } from './hired-man-power.service';

describe('HiredManPowerService', () => {
  let service: HiredManPowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HiredManPowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
