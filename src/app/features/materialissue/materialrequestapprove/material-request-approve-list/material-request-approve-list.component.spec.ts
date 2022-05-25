import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequestApproveListComponent } from './material-request-approve-list.component';

describe('MaterialRequestApproveListComponent', () => {
  let component: MaterialRequestApproveListComponent;
  let fixture: ComponentFixture<MaterialRequestApproveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialRequestApproveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialRequestApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
