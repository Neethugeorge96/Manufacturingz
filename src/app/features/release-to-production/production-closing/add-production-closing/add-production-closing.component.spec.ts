import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionClosingComponent } from './add-production-closing.component';

describe('AddProductionClosingComponent', () => {
  let component: AddProductionClosingComponent;
  let fixture: ComponentFixture<AddProductionClosingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductionClosingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductionClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
