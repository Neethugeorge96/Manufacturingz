import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseToProductionContainerComponent } from './release-to-production-container.component';

describe('ReleaseToProductionContainerComponent', () => {
  let component: ReleaseToProductionContainerComponent;
  let fixture: ComponentFixture<ReleaseToProductionContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseToProductionContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseToProductionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
