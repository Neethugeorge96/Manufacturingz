import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORouteViewComponent } from './po-route-view.component';

describe('PORouteViewComponent', () => {
  let component: PORouteViewComponent;
  let fixture: ComponentFixture<PORouteViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PORouteViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORouteViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
