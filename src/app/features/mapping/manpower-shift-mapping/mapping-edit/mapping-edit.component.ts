import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimeSheetUpdationService } from '@features/release-to-production/time-sheet-updation/time-sheet-updation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  EditSettingsModel,
  ToolbarItems,
  CommandModel,
  SaveEventArgs,
  GridComponent,
  SearchSettingsModel,
  SearchService,
  ToolbarService
} from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ManpowerToShift } from '../manpower-shift-mapping.model';
import { ManpowerShiftMappingService } from '../manpower-shift-mapping.service';

@Component({
  selector: 'app-mapping-edit',
  templateUrl: './mapping-edit.component.html',
  providers: [ToolbarService, SearchService]
})
export class MappingEditComponent implements OnInit, OnDestroy {
  @Input() manPowerCategories;
  @Input() manPower;
  @Input() shiftDetails;
  @Input() productionShifts;
  @ViewChild('grid')
  public grid: GridComponent;
  manpowerToShift: ManpowerToShift[] = [];
  manpowerToShiftView: ManpowerToShift[] = [];
  shiftFields: object = { text: 'shiftName', value: 'shiftCode' };
  shift;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  public searchOptions: SearchSettingsModel = {
    fields: ['manpowerCategoryCode', 'manpowerCategoryName', 'manpowerCode', 'manpowerName'], key: ''
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public toolbarView: ToolbarItems[] = ['Search'];
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];
  addForm: FormGroup;
  subscribers: Subscription[] = [];
  manpowerByCategory: any = [];
  mappedEmployees: string[];
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private manpowerShiftMappingService: ManpowerShiftMappingService,
    private timeSheetUpdationService: TimeSheetUpdationService,
    private toastr: ToasterDisplayService

  ) { }

  ngOnInit(): void {
    this.timeSheetUpdationService.getEmployees().subscribe(res => {
      this.mappedEmployees = res.map(emp => emp.employeename);
    });
    if (this.shiftDetails) {
      this.shift = this.shiftDetails.shiftCode;
      this.manpowerShiftMappingService.GetAllByShiftCode(this.shiftDetails.shiftCode).subscribe(res => {
        this.manpowerToShift = res;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });
  }
  queryCellInfo(args) {
    if (args.cell.classList.contains('e-unboundcell') && this.mappedEmployees.includes(args.data.manpowerName)) {
      args.cell.querySelector('button[title=\'Edit\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Edit\']').classList.add('e-disabled');
      args.cell.querySelector('button[title=\'Delete\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Delete\']').classList.add('e-disabled');
    }
  }
  public getCategory = (field: string, data: object, column: object) => {
    const category = this.manPowerCategories.find(cat => cat.id === Number(data[field]));
    return category ? `${category.categoryName}-${category.categoryCode}` : '';
  }

  public getManpower = (field: string, data: object, column: object) => {
    const manpower = this.manPower.find(man => man.manpowerCode === data[field]);
    return manpower ? `${manpower.manpowerName}-${manpower.manpowerCode}` : '';
  }
  rowSave() {
    this.grid.endEdit();

  }
  rowEditCancel() {
    this.grid.closeEdit();
  }
  actionBegin(args: SaveEventArgs): void {
    const row: any = args;
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.addForm = this.createFormGroup(args.rowData);
      this.subscribers.push(this.addForm.valueChanges.subscribe(res => {
        const category = this.manPowerCategories.find(cat => cat.id === Number(res.manpowerCategoryCode));
        this.manpowerByCategory = this.manPower
          .filter(manpower =>
            manpower.manpowerCategoryId === category.id
            && !this.grid.getCurrentViewRecords().find((record: any) => record.manpowerCode === manpower.manpowerCode));
      }));
      this.subscribers.push(this.addForm.get('manpowerCategoryCode').valueChanges.subscribe(res => {
        this.addForm.patchValue({ manpowerCode: null }, { emitEvent: false });
      }));

      if (args.requestType === 'beginEdit') {

        const category = this.manPowerCategories.find(cat => cat.id === Number(row.rowData.manpowerCategoryCode));
        this.manpowerByCategory = this.manPower.filter(res => res.manpowerCategoryId === category.id);
        
      }


    } else if (args.requestType === 'delete') {
      const rowToDelete: any = args.data[0];
      this.manpowerShiftMappingService.delete(rowToDelete.id).subscribe(res => {
        // this.toastr.showSuccessMessage('Mapping Deleted Successfully')
        // this.manpowerShiftMappingService.GetAllByShiftCode(this.shiftDetails.shiftCode).subscribe(res => {
        //   this.manpowerToShift = res;
        // });
      });
    }
  }
  createFormGroup(mapping: any): FormGroup {
    return this.formBuilder.group({
      id: [mapping.id == null ? 0 : mapping.id],
      manpowerCategoryCode: [mapping ? Number(mapping.manpowerCategoryCode) : 0, [
        Validators.required
      ]],
      manpowerCode: [mapping.manpowerCode || null, [
        Validators.required
      ]],

    });
  }
  submit() {
    this.searchOptions.key = '';
    const mapping = this.grid.getCurrentViewRecords().map((record: any) => {
      const manpower = this.manPower.find(man => man.manpowerCode === record.manpowerCode);
      const category = this.manPowerCategories.find(man => man.id === Number(record.manpowerCategoryCode));
      const shift = this.productionShifts.find(shif => this.shift === shif.shiftCode);
      return {
        ...record,
        shiftName: shift.shiftName,
        shiftId: shift.id,
        shiftCode: this.shift,
        manpowerType: manpower.manpowerType,
        manpowerName: manpower.manpowerName,
        manpowerCategoryName: category.categoryName,
        remarks: ''
      };
    });
    this.manpowerShiftMappingService.upsertMapping(mapping).subscribe(res => {
      // if (res) {
      this.activeModal.close('submit');
      // }
    });
  }


}
