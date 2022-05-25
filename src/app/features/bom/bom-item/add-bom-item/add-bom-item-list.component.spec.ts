import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BomItemListComponent } from './add-bom-item-list.component';

describe('BomItemListComponent', () => {
  let component: BomItemListComponent;
  let fixture: ComponentFixture<BomItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
