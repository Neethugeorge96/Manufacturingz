import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EditSettingsModel, SaveEventArgs, ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

import { ProductionShift } from '@settings/production-shift/production-shift.model';
import { ProductionShiftService } from '@settings/production-shift/production-shift.service';
import { ManPowerCategory } from '@settings/man-power-category/man-power-category.model';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { OwnManPowerService } from '@settings/man-power/own-man-power.service';
import { HiredManPowerService } from '@settings/man-power/hired-man-power.service';
import { ManpowerToShift } from '../manpower-shift-mapping.model';
import { ManpowerShiftMappingService } from '../manpower-shift-mapping.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { MappingEditComponent } from '../mapping-edit/mapping-edit.component';
import { MappingCreateComponent } from '../mapping-create/mapping-create.component';
import { MappingViewComponent } from '../mapping-view/mapping-view.component';
@Component({
  selector: 'app-manpower-shift-mapping',
  templateUrl: './manpower-shift-mapping.component.html'
})
export class ManpowerShiftMappingComponent implements OnInit {

  manpowerToShift: ManpowerToShift[] = [];
  manPowerCategories: ManPowerCategory[] = [];
  manPower: any[];

  toBeDeleted = null;

  @ViewChild('grid')
  public grid: GridComponent;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar = ['Search', { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-add', id: 'add' }];
  public toolbarView: ToolbarItems[] = ['Search'];

  productionShifts: ProductionShift[];
  constructor(
    private toastr: ToasterDisplayService,
    private ownManPowerService: OwnManPowerService,
    private hiredManPowerService: HiredManPowerService,
    public modalService: NgbModal,
    private productionShiftService: ProductionShiftService,
    private manpowerShiftMappingService: ManpowerShiftMappingService,
    private manPowerCategoryService: ManPowerCategoryService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllManpowerShifts();
    forkJoin([
      this.manPowerCategoryService.getAll(),
      this.ownManPowerService.getAll(),
      this.hiredManPowerService.getAll(),
      this.productionShiftService.getAll()
    ])
      .subscribe(([category, ownManpower, hiredManpower, productionShifts]) => {
        this.manPower = [...ownManpower, ...hiredManpower];
        this.manPowerCategories = category.filter(cat => this.manPower.some(man => man.manpowerCategoryId === cat.id));
        this.productionShifts = productionShifts;
      });
  }

  getAllManpowerShifts() {
    this.manpowerShiftMappingService.GetAllShiftCode().subscribe(result => {
      this.manpowerToShift = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the manpower shift Details');
      });
  }

  createFormGroup(production: any): FormGroup {
    return this.formBuilder.group({
      id: [production.id == null ? 0 : production.id],
      categoryId: [production.categoryId, [
        Validators.required
      ]],
      manpowerId: [production.manpowerId, [
        Validators.required
      ]],

    });
  }

  rowView(shiftDetails) {

    const modalRef = this.modalService.open(MappingViewComponent,
      { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.manPowerCategories = this.manPowerCategories;
    modalRef.componentInstance.manPower = this.manPower;
    modalRef.componentInstance.shiftDetails = shiftDetails;
    modalRef.componentInstance.productionShifts = this.productionShifts;
    modalRef.result.then((result) => {
    }, () => { });
  }
  rowEdit(shiftDetails) {
    // this.grid.selectRow(parseInt(d.index, 10));
    // this.grid.editModule.startEdit();
    const modalRef = this.modalService.open(MappingEditComponent,
      { size: 'lg', centered: true, backdrop: 'static' });
    modalRef.componentInstance.manPowerCategories = this.manPowerCategories;
    modalRef.componentInstance.manPower = this.manPower;
    modalRef.componentInstance.shiftDetails = shiftDetails;
    modalRef.componentInstance.productionShifts = this.productionShifts;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.getAllManpowerShifts();
      }
    }, () => { });
  }
  rowDelete(d) {
    this.grid.selectRow(Number(d.index));
    this.toBeDeleted = d;
    this.grid.deleteRecord();
  }
  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === 'add') {
      const modalRef = this.modalService.open(MappingCreateComponent,
        { size: 'lg', centered: true, backdrop: 'static' });
      modalRef.componentInstance.manPowerCategories = this.manPowerCategories;
      modalRef.componentInstance.manPower = this.manPower;
      modalRef.componentInstance.productionShifts = this.productionShifts
        .filter(shift => !this.manpowerToShift.length ||
          !this.manpowerToShift.find(mappedShift => mappedShift.shiftCode === shift.shiftCode));
      modalRef.result.then((result) => {
        if (result === 'submit') {
          this.getAllManpowerShifts();
        }
      }, () => { });
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'delete') {
      const row: any = args;
      if (this.toBeDeleted.shiftCode) {
        this.manpowerShiftMappingService.DeleteByShiftCode(this.toBeDeleted.shiftCode).subscribe(res => {
          // if (res ) {
          this.toastr.showSuccessMessage('Manpower mapping to shift deleted successfully!');
          this.getAllManpowerShifts();
          this.toBeDeleted = null;
          // }
        });
      }
    }
  }
}
