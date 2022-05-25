import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetUploadComponent } from './time-sheet-upload.component';

describe('TimeSheetUploadComponent', () => {
  let component: TimeSheetUploadComponent;
  let fixture: ComponentFixture<TimeSheetUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSheetUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSheetUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
