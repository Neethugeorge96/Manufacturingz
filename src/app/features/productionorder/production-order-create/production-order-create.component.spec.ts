import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderCreateComponent } from './production-order-create.component';

describe('ProductionOrderCreateComponent', () => {
  let component: ProductionOrderCreateComponent;
  let fixture: ComponentFixture<ProductionOrderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
