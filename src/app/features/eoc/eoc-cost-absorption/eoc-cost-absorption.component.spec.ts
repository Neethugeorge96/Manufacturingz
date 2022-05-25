import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EocCostAbsorptionComponent } from './eoc-cost-absorption.component';

describe('EocCostAbsorptionComponent', () => {
  let component: EocCostAbsorptionComponent;
  let fixture: ComponentFixture<EocCostAbsorptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EocCostAbsorptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EocCostAbsorptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
