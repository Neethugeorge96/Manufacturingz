import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPowerViewComponent } from './man-power-view.component';

describe('ManPowerViewComponent', () => {
  let component: ManPowerViewComponent;
  let fixture: ComponentFixture<ManPowerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManPowerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManPowerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
