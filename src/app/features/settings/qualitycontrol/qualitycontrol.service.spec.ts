import { TestBed } from '@angular/core/testing';

import { QualitycontrolService } from './qualitycontrol.service';

describe('QualitycontrolService', () => {
  let service: QualitycontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualitycontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
