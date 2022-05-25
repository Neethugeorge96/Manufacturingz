import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskClosingCreateComponent } from './task-closing-create.component';

describe('TaskClosingCreateComponent', () => {
  let component: TaskClosingCreateComponent;
  let fixture: ComponentFixture<TaskClosingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskClosingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskClosingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
