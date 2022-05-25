import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderBatchViewComponent } from './production-order-batch-view.component';

describe('ProductionOrderBatchViewComponent', () => {
  let component: ProductionOrderBatchViewComponent;
  let fixture: ComponentFixture<ProductionOrderBatchViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderBatchViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderBatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
