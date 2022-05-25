import { TestBed } from '@angular/core/testing';

import { MaterialissueService } from './materialissue.service';

describe('MaterialissueService', () => {
  let service: MaterialissueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialissueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
