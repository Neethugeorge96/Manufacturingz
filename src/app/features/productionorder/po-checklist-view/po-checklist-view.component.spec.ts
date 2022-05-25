import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POChecklistViewComponent } from './po-checklist-view.component';

describe('POChecklistViewComponent', () => {
  let component: POChecklistViewComponent;
  let fixture: ComponentFixture<POChecklistViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POChecklistViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POChecklistViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
