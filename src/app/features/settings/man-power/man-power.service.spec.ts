import { TestBed } from '@angular/core/testing';

import { OwnManPowerService } from './own-man-power.service';

describe('OwnManPowerService', () => {
  let service: OwnManPowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnManPowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
