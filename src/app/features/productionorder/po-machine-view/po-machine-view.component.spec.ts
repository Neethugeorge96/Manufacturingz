import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POMachineViewComponent } from './po-machine-view.component';

describe('POMachineViewComponent', () => {
  let component: POMachineViewComponent;
  let fixture: ComponentFixture<POMachineViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POMachineViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POMachineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
