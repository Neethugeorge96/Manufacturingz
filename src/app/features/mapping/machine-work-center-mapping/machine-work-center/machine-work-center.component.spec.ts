import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineWorkCenterComponent } from './machine-work-center.component';

describe('MachineWorkCenterComponent', () => {
  let component: MachineWorkCenterComponent;
  let fixture: ComponentFixture<MachineWorkCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineWorkCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineWorkCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
