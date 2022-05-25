import { TestBed } from '@angular/core/testing';

import { POBillOfMaterialService } from './po-bill-of-material.service';

describe('POBillOfMaterialService', () => {
  let service: POBillOfMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POBillOfMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
