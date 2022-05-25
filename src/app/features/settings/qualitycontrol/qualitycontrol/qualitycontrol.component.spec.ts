import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualitycontrolComponent } from './qualitycontrol.component';

describe('QualitycontrolComponent', () => {
  let component: QualitycontrolComponent;
  let fixture: ComponentFixture<QualitycontrolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualitycontrolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualitycontrolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
