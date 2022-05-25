import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerWorkcenterMappingCreateComponent } from './manpower-workcenter-mapping-create.component';

describe('ManpowerWorkcenterMappingCreateComponent', () => {
  let component: ManpowerWorkcenterMappingCreateComponent;
  let fixture: ComponentFixture<ManpowerWorkcenterMappingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManpowerWorkcenterMappingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManpowerWorkcenterMappingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
