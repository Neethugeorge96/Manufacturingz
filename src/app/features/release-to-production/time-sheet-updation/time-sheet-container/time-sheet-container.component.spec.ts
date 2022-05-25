import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetContainerComponent } from './time-sheet-container.component';

describe('TimeSheetContainerComponent', () => {
  let component: TimeSheetContainerComponent;
  let fixture: ComponentFixture<TimeSheetContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
