import { TestBed } from '@angular/core/testing';

import { ProductionorderService } from './productionorder.service';

describe('ProductionorderService', () => {
  let service: ProductionorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
