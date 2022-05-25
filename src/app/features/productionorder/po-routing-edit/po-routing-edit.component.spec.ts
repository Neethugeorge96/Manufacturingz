import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PORoutingEditComponent } from './po-routing-edit.component';

describe('PORoutingEditComponent', () => {
  let component: PORoutingEditComponent;
  let fixture: ComponentFixture<PORoutingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PORoutingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PORoutingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
