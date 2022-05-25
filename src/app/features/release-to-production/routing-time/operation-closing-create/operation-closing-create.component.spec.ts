import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationClosingCreateComponent } from './operation-closing-create.component';

describe('OperationClosingCreateComponent', () => {
  let component: OperationClosingCreateComponent;
  let fixture: ComponentFixture<OperationClosingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationClosingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationClosingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
