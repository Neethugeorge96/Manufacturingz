import { TestBed } from '@angular/core/testing';

import { ToasterDisplayService } from './toaster-service.service';

describe('ToasterDisplayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToasterDisplayService = TestBed.get(ToasterDisplayService);
    expect(service).toBeTruthy();
  });
});