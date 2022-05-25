import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionShiftComponent } from './production-shift.component';

describe('ProductionShiftComponent', () => {
  let component: ProductionShiftComponent;
  let fixture: ComponentFixture<ProductionShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
