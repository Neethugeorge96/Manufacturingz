import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaterialIssueComponent } from './add-material-issue.component';

describe('AddMaterialIssueComponent', () => {
  let component: AddMaterialIssueComponent;
  let fixture: ComponentFixture<AddMaterialIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaterialIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaterialIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
