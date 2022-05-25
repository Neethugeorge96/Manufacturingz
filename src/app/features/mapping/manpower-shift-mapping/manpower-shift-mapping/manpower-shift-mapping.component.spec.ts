import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerShiftMappingComponent } from './manpower-shift-mapping.component';

describe('ManpowerShiftMappingComponent', () => {
  let component: ManpowerShiftMappingComponent;
  let fixture: ComponentFixture<ManpowerShiftMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManpowerShiftMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManpowerShiftMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
