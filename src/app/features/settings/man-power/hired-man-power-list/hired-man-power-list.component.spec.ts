import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredManPowerListComponent } from './hired-man-power-list.component';

describe('HiredManPowerListComponent', () => {
  let component: HiredManPowerListComponent;
  let fixture: ComponentFixture<HiredManPowerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiredManPowerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiredManPowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
