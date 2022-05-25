import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingEditComponent } from './mapping-edit.component';

describe('MappingEditComponent', () => {
  let component: MappingEditComponent;
  let fixture: ComponentFixture<MappingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
