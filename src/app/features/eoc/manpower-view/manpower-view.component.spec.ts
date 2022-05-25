import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManpowerViewComponent } from './manpower-view.component';

describe('ManpowerViewComponent', () => {
  let component: ManpowerViewComponent;
  let fixture: ComponentFixture<ManpowerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManpowerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManpowerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
