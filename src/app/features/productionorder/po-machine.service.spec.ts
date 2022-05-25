import { TestBed } from '@angular/core/testing';

import { POMachineService } from './po-machine.service';

describe('POMachineService', () => {
  let service: POMachineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POMachineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
