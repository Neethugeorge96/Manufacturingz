import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetUpdationComponent } from './time-sheet-updation.component';

describe('TimeSheetUpdationComponent', () => {
  let component: TimeSheetUpdationComponent;
  let fixture: ComponentFixture<TimeSheetUpdationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetUpdationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
