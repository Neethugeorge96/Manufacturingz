import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POManpowerViewComponent } from './po-manpower-view.component';

describe('POManpowerViewComponent', () => {
  let component: POManpowerViewComponent;
  let fixture: ComponentFixture<POManpowerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POManpowerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POManpowerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
