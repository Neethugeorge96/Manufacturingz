import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EocContainerComponent } from './eoc-container.component';

describe('EocContainerComponent', () => {
  let component: EocContainerComponent;
  let fixture: ComponentFixture<EocContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EocContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EocContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
