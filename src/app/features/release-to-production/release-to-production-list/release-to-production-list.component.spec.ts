import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseToProductionListComponent } from './release-to-production-list.component';

describe('ReleaseToProductionListComponent', () => {
  let component: ReleaseToProductionListComponent;
  let fixture: ComponentFixture<ReleaseToProductionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseToProductionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseToProductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
