import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialRequestApproveComponent } from './edit-material-request-approve.component';

describe('EditMaterialRequestApproveComponent', () => {
  let component: EditMaterialRequestApproveComponent;
  let fixture: ComponentFixture<EditMaterialRequestApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMaterialRequestApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaterialRequestApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
