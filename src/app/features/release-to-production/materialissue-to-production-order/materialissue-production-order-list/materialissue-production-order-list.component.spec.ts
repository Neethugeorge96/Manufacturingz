import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialissueProductionOrderListComponent } from './materialissue-production-order-list.component';


describe('MaterialissueProductionOrderListComponent', () => {
  let component: MaterialissueProductionOrderListComponent;
  let fixture: ComponentFixture<MaterialissueProductionOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialissueProductionOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialissueProductionOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
