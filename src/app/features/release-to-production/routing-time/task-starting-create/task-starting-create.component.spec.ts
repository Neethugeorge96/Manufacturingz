import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStartingCreateComponent } from './task-starting-create.component';

describe('TaskStartingCreateComponent', () => {
  let component: TaskStartingCreateComponent;
  let fixture: ComponentFixture<TaskStartingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskStartingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskStartingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
