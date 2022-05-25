import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManPowerCategoryListComponent } from './man-power-category-list.component';

describe('ManPowerCategoryListComponent', () => {
  let component: ManPowerCategoryListComponent;
  let fixture: ComponentFixture<ManPowerCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManPowerCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManPowerCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
