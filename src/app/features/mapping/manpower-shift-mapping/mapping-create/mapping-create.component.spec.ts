import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingCreateComponent } from './mapping-create.component';

describe('MappingCreateComponent', () => {
  let component: MappingCreateComponent;
  let fixture: ComponentFixture<MappingCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
