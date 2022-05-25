import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EocListComponent } from './eoc-list.component';

describe('EocListComponent', () => {
  let component: EocListComponent;
  let fixture: ComponentFixture<EocListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EocListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
