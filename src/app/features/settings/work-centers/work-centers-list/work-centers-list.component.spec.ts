import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCentersListComponent } from './work-centers-list.component';

describe('WorkCentersListComponent', () => {
  let component: WorkCentersListComponent;
  let fixture: ComponentFixture<WorkCentersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkCentersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkCentersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
