import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnManPowerListComponent } from './man-power-list.component';

describe('OwnManPowerListComponent', () => {
  let component: OwnManPowerListComponent;
  let fixture: ComponentFixture<OwnManPowerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnManPowerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnManPowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
