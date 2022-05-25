import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationStartingCreateComponent } from './operation-starting-create.component';

describe('OperationStartingCreateComponent', () => {
  let component: OperationStartingCreateComponent;
  let fixture: ComponentFixture<OperationStartingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationStartingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationStartingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
