import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EocRoutingComponent } from './eoc-routing.component';

describe('EocRoutingComponent', () => {
  let component: EocRoutingComponent;
  let fixture: ComponentFixture<EocRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EocRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EocRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
