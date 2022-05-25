import { TestBed } from '@angular/core/testing';

import { ManPowerCategoryService } from './man-power-category.service';

describe('ManPowerCategoryService', () => {
  let service: ManPowerCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManPowerCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
