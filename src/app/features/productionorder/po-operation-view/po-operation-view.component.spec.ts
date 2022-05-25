import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POOperationViewComponent } from './po-operation-view.component';

describe('POOperationViewComponent', () => {
  let component: POOperationViewComponent;
  let fixture: ComponentFixture<POOperationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POOperationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POOperationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
