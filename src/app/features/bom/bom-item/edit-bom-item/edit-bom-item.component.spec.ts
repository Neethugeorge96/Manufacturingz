import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBomItemComponent } from './edit-bom-item.component';

describe('EditBomItemComponent', () => {
  let component: EditBomItemComponent;
  let fixture: ComponentFixture<EditBomItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBomItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBomItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
