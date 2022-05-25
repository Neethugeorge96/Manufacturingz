import { TestBed } from '@angular/core/testing';

import { MaterialissuetoproductionorderService } from './materialissue-to-production-order.service';

describe('MaterialissuetoproductionorderService', () => {
  let service: MaterialissuetoproductionorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialissuetoproductionorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
