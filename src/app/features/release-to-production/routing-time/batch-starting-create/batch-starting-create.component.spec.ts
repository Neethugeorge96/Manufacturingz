import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchStartingCreateComponent } from './batch-starting-create.component';

describe('BatchStartingCreateComponent', () => {
  let component: BatchStartingCreateComponent;
  let fixture: ComponentFixture<BatchStartingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchStartingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchStartingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
