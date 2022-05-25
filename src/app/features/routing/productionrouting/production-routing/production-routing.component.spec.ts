import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionRoutingComponent } from './production-routing.component';

describe('ProductionRoutingComponent', () => {
  let component: ProductionRoutingComponent;
  let fixture: ComponentFixture<ProductionRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
