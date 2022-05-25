import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionClosingComponent } from './production-closing.component';

describe('ProductionClosingComponent', () => {
  let component: ProductionClosingComponent;
  let fixture: ComponentFixture<ProductionClosingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionClosingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
