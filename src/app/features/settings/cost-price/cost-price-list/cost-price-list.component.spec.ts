import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostPriceListComponent } from './cost-price-list.component';

describe('CostPriceListComponent', () => {
  let component: CostPriceListComponent;
  let fixture: ComponentFixture<CostPriceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostPriceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
