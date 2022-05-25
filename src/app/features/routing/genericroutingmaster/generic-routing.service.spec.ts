import { TestBed } from '@angular/core/testing';

import { GenericRoutingService } from './generic-routing.service';

describe('GenericRoutingService', () => {
  let service: GenericRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
