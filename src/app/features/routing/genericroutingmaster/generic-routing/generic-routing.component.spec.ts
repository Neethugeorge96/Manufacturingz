import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericRoutingComponent } from './generic-routing.component';

describe('GenericRoutingComponent', () => {
  let component: GenericRoutingComponent;
  let fixture: ComponentFixture<GenericRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
