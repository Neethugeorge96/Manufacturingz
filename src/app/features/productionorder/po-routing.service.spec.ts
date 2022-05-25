import { TestBed } from '@angular/core/testing';

import { PORoutingService } from './po-routing.service';

describe('PORoutingService', () => {
  let service: PORoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PORoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
