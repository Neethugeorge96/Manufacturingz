import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialIssueContainerComponent } from './material-issue-container.component';

describe('MaterialIssueContainerComponent', () => {
  let component: MaterialIssueContainerComponent;
  let fixture: ComponentFixture<MaterialIssueContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialIssueContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialIssueContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
