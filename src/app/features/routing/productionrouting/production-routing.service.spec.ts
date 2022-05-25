import { TestBed } from '@angular/core/testing';

import { ProductionRoutingService } from './production-routing.service';

describe('ProductionRoutingService', () => {
  let service: ProductionRoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
