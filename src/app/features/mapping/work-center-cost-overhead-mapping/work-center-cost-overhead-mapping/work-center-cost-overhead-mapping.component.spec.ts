import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterCostOverheadMappingComponent } from './work-center-cost-overhead-mapping.component';

describe('WorkCenterCostOverheadMappingComponent', () => {
  let component: WorkCenterCostOverheadMappingComponent;
  let fixture: ComponentFixture<WorkCenterCostOverheadMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCenterCostOverheadMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCenterCostOverheadMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
