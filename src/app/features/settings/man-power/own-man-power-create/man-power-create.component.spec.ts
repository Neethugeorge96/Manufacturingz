import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPowerCreateComponent } from './man-power-create.component';

describe('ManPowerCreateComponent', () => {
  let component: ManPowerCreateComponent;
  let fixture: ComponentFixture<ManPowerCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManPowerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManPowerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
