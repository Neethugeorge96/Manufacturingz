import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMaterialIssueComponent } from './edit-material-issue.component';

describe('EditMaterialIssueComponent', () => {
  let component: EditMaterialIssueComponent;
  let fixture: ComponentFixture<EditMaterialIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMaterialIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMaterialIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
