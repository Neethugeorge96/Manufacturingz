import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPowerEditComponent } from './man-power-edit.component';

describe('ManPowerEditComponent', () => {
  let component: ManPowerEditComponent;
  let fixture: ComponentFixture<ManPowerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManPowerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManPowerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
