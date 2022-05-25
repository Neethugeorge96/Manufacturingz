import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderContainerComponent } from './production-order-container.component';

describe('ProductionOrderContainerComponent', () => {
  let component: ProductionOrderContainerComponent;
  let fixture: ComponentFixture<ProductionOrderContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
