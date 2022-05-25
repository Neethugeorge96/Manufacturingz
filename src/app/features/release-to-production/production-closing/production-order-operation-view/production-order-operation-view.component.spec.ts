import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderOperationViewComponent } from './production-order-operation-view.component';

describe('ProductionOrderOperationViewComponent', () => {
  let component: ProductionOrderOperationViewComponent;
  let fixture: ComponentFixture<ProductionOrderOperationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderOperationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderOperationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
