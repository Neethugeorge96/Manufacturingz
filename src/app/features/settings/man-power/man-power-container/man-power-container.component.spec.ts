import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPowerContainerComponent } from './man-power-container.component';

describe('ManPowerContainerComponent', () => {
  let component: ManPowerContainerComponent;
  let fixture: ComponentFixture<ManPowerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManPowerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManPowerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
