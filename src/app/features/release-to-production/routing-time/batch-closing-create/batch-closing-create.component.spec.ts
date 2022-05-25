import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchClosingCreateComponent } from './batch-closing-create.component';

describe('BatchClosingCreateComponent', () => {
  let component: BatchClosingCreateComponent;
  let fixture: ComponentFixture<BatchClosingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchClosingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchClosingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
