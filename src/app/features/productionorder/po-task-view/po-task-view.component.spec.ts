import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POTaskViewComponent } from './po-task-view.component';

describe('POTaskViewComponent', () => {
  let component: POTaskViewComponent;
  let fixture: ComponentFixture<POTaskViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POTaskViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
