import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIssueListComponent } from './material-issue-list.component';

describe('MaterialIssueListComponent', () => {
  let component: MaterialIssueListComponent;
  let fixture: ComponentFixture<MaterialIssueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialIssueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialIssueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
