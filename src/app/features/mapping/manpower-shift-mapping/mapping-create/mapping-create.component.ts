import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductionShiftService } from '@settings/production-shift/production-shift.service';
import { GridComponent, EditSettingsModel, ToolbarItems, CommandModel, SaveEventArgs, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';

import { ManpowerToShift } from '../manpower-shift-mapping.model';
import { ManpowerShiftMappingService } from '../manpower-shift-mapping.service';

@Component({
  selector: 'app-mapping-create',
  templateUrl: './mapping-create.component.html',
})
export class MappingCreateComponent implements OnInit, OnDestroy {

  @Input() manPowerCategories;
  @Input() manPower;
  @Input() productionShifts;
  @Input() manpowerToShiftDataS;
  @ViewChild('grid') public grid: GridComponent;
 
  showErrorMsg :boolean = false;
  manpowerByCategory = [];
  manpowerToShift: ManpowerToShift[] = [];
  shiftFields: object = { text: 'shiftName', value: 'shiftCode' };
  shift;
  addForm: FormGroup;
  subscribers: Subscription[] = [];
  public searchOptions: SearchSettingsModel = {
    fields: ['manpowerCategoryCode', 'manpowerCategoryName', 'manpowerCode', 'manpowerName'], key: ''
  };
  // productionShifts: any;

  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: false,
    allowDeleting: true,
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public toolbarView: ToolbarItems[] = ['Search'];
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];
  submitClicked: boolean;
  get manpowerCategoryCode() { return this.addForm.get('manpowerCategoryCode'); }
  get manpowerCode() { return this.addForm.get('manpowerCode'); }
  
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private manpowerShiftMappingService: ManpowerShiftMappingService,
    private toastr: ToasterDisplayService,
    private productionShiftService: ProductionShiftService,

  ) { }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();

    });
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
  onChange(){
    this.grid.editSettings.allowAdding = true;
 
  }
 
  actionBegin(args: SaveEventArgs): void {
    const row: any = args;
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.addForm = this.createFormGroup(args.rowData);
      this.subscribers.push(this.addForm.valueChanges.subscribe(res => {
        const category = this.manPowerCategories.find(cat => cat.id === Number(res.manpowerCategoryCode));
        this.manpowerByCategory = this.manPower
          .filter(manpower =>
            manpower.manpowerCategoryId === category.id
            && !this.grid.getCurrentViewRecords().find((record: any) => record.manpowerCode === manpower.manpowerCode)
          );
      }));
      this.subscribers.push(this.addForm.get('manpowerCategoryCode').valueChanges.subscribe(res => {
        this.addForm.patchValue({ manpowerCode: null }, { emitEvent: false });
      }));
    }

  }
  createFormGroup(mapping: any): FormGroup {
    return this.formBuilder.group({
      id: [mapping.id == null ? 0 : mapping.id],
      manpowerCategoryCode: [mapping.manpowerCategoryCode, [
        Validators.required
      ]],
      manpowerCode: [mapping.manpowerCode, [
        Validators.required
      ]],

    });
  }

  submit() {
    this.submitClicked = true;
    if(this.addForm.valid){
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
        if (res) {
          this.activeModal.close('submit');
          this.toastr.showSuccessMessage('Manpower To shift  added successfully!');
  
          const proShift = this.productionShifts.find(x => x.id === mapping[0].shiftId);
          proShift.isAssigned = true;
          this.productionShiftService.update(proShift).subscribe(res => {
          });
  
        }
      });
    }
   
  }

}
