import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { POManpowerService } from '../po-manpower.service';
import { ProductionorderService } from '../productionorder.service';

@Component({
  selector: 'app-po-manpower-view',
  templateUrl: './po-manpower-view.component.html',
  styles: [
  ]
})
export class POManpowerViewComponent implements OnInit, OnChanges {
  @Input() routeData;
  @Input() operation;
  @Input() task;
  manpowers: any[] = [];
  mappedList: any[] = [];
  fields: object = { text: 'categoryName', value: 'categoryCode' };
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [{ type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
  { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
  { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
  { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  manpowerForm: FormGroup;
  submitClicked: boolean;
  get manpowerCategory() { return this.manpowerForm.get('manpowerCategoryCode'); }
  get noOfResources() { return this.manpowerForm.get('noOfResources'); }
  constructor(
    private productionorderService: ProductionorderService,
    private pOManpowerService: POManpowerService,
    private manPowerCategoryService: ManPowerCategoryService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllManpowerCategories();
    // this.getManpowersForTask();
    this.mappedList = this.routeData;
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.routeData.previousValue && changes.task.routeData.id !== changes.task.previousValue.id) {
    //   this.getManpowersForTask();
    // }
  }
  getManpowersForTask() {
    this.productionorderService.getTaskDetails(this.task.id).subscribe(res => {
      this.mappedList = res.plannedPOManpowerCollection;
    });
  }
  getAllManpowerCategories() {
    this.manPowerCategoryService.getAll()
      .subscribe(res => {
        this.manpowers = res;
      });
  }
  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Manpower' : 'Add Manpower';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.manpowerForm = this.createFormGroup(args.rowData);
      this.manpowerForm.valueChanges.subscribe(res => {
        const selectedManpower = this.manpowers.find(manpower => manpower.categoryCode == res.manpowerCategoryCode);
        this.manpowerForm.patchValue({
          manpowerCategory: selectedManpower.categoryName,
          costPerHour: selectedManpower.costRatePerHour,
          currencyCode: selectedManpower.currencyCode
        }, { emitEvent: false });
      });

    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.manpowerForm.valid){
        const manpower: any = this.manpowerForm.getRawValue();
      if (manpower.id) {
        this.pOManpowerService.update(manpower).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Manpower updated Successfully');
            this.getManpowersForTask();
          }
        });
      } else {
        const { id, ...manpowerData } = manpower;
        this.pOManpowerService.add(manpowerData)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Manpower added to Task Successfully');
              this.getManpowersForTask();
            }
          });
      }
      }
      else{
        args.cancel=true;
      }
      
    } else if (args.requestType === 'delete') {
      const manpower: any = args.data[0];
      const { id, ...manpowerData } = manpower;
      this.pOManpowerService.delete(id).subscribe(res => {
        if (res) {
          this.getManpowersForTask();
          this.toastr.showSuccessMessage('Manpower deleted Successfully');
        }
      });
    }
  }
  createFormGroup(row: any): FormGroup {
    return this.formBuilder.group({
      id: [row.id],
      plannedPOTaskId: [this.task.id, [
        Validators.required,
        // duplicateNameValidator(this.leaveComponentNames)
      ]],
      batchNumber: [this.task.batchNumber, [
        Validators.required,
      ]],
      manpowerCategoryCode: [row.manpowerCategoryCode, [
        Validators.required
      ]],
      manpowerCategory: [row.manpowerCategory],
      noOfResources: [row.noOfResources, [Validators.required,Validators.max(999999),Validators.min(1)]],
      manpowerName: [ 'a', [Validators.required]],
      costPerHour: [{ value: row.costPerHour, disabled: true }, [Validators.required]],
      currencyCode: [{ value: row.currencyCode, disabled: true }, [Validators.required]]

    });
  }

  checkDuplication(event){
    if(event){
      let categoryCode = event.itemData.categoryCode;
      this.mappedList.filter(x => {
        if(x.manpowerCategoryCode === categoryCode){
          this.toastr.showErrorMessage('Cannot able to add duplicate Category.');
          this.manpowerForm.controls['manpowerCategoryCode'].setValue(null);
        }
      })

      
    }
  }

}
