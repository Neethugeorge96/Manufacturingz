import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POBomEditComponent } from './po-bom-edit.component';

describe('POBomEditComponent', () => {
  let component: POBomEditComponent;
  let fixture: ComponentFixture<POBomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POBomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POBomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
