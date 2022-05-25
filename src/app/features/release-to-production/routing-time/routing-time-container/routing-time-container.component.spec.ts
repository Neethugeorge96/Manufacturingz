import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingTimeContainerComponent } from './routing-time-container.component';

describe('RoutingTimeContainerComponent', () => {
  let component: RoutingTimeContainerComponent;
  let fixture: ComponentFixture<RoutingTimeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoutingTimeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingTimeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
