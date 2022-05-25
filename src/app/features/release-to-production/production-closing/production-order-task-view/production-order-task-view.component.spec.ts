import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderTaskViewComponent } from './production-order-task-view.component';

describe('ProductionOrderTaskViewComponent', () => {
  let component: ProductionOrderTaskViewComponent;
  let fixture: ComponentFixture<ProductionOrderTaskViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionOrderTaskViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionOrderTaskViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
