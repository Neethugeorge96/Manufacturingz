import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs, CommandClickEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { forkJoin, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlicePipe } from '@angular/common';

import { OwnManPowerService } from '../own-man-power.service';
import { ManPowerCategory } from '@settings/man-power-category/man-power-category.model';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';

import { ManPowertoWorkCenterService } from '../../../mapping/manpower-workcenter-mapping/manpower-workcenter-mapping.service';
import { OwnManPower } from '../own-man-power';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';
import { getCompanyId } from '@shared/utils/utils.functions';
import { HiredManPower } from '../hired-man-power';
import { duplicateCodeValidator } from '@shared/utils/validators.functions';

@Component({
  selector: 'app-own-man-power-list',
  templateUrl: './man-power-list.component.html',
  styles: [
  ]
})
export class OwnManPowerListComponent implements OnInit, OnDestroy {
  manPowers: any[] = []; // OwnManPower[] = [];
  manPowerCategories: ManPowerCategory[] = [];
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };
  manpowerType = ManpowerType;
  manpowerTypeKeys: number[];
  companyId: number;
  employees: any[] = [];
  mappedManpowerIds: any;


  mappedList: any[] = [];
  fields: object = { text: 'name', value: 'id' };
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };

  manpowerCode: string;
  manpowerName: string;
  manpowerCategory: string;
  email: string;
  phone: number;
  remark: string;
  closeResult: string;
  empcode: any[] ;
  batchOutputrequired: string;
  @ViewChild('content') modelPopup: any;
  @ViewChild('grid') public grid: GridComponent;

  submitClicked: boolean;
  get manpowerId() { return this.addForm.get('manpowerId'); }
  get manpowerCategoryId() { return this.addForm.get('manpowerCategoryId'); }
  get remarks() { return this.addForm.get('remarks'); }


  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
  { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
  { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
  { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  addForm: FormGroup;
  subscribers: Subscription[] = [];
  constructor(
    public modalService: NgbModal,
    private manPowerService: OwnManPowerService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    private slicePipe: SlicePipe,
    private manPowerCategoryService: ManPowerCategoryService,
    private mappedManpowerService: ManPowertoWorkCenterService
  ) {
    this.companyId = getCompanyId();
  }

  ngOnInit(): void {
    // this.getManpowers();
   // this.getMappedManpower();
    forkJoin([this.manPowerCategoryService.getAll(), this.manPowerService.getAll(), this.mappedManpowerService.MappedManpower()])
      .subscribe(([category, manpower, mappedMapowers]) => {

        this.manPowerCategories = category;
        this.manPowers = this.mappedList = manpower.map(man => {
          return {
            ...man,
            // categoryName: this.getCategoryName(man.id),
            phoneText: `+${this.slicePipe.transform(man.phone, 0, 3)}-${this.slicePipe.transform(man.phone, 3, 10)}`
          };
        });

        this.mappedManpowerIds = mappedMapowers.filter(x => x['manpowertype'] === 1);
        // console.log(this.mappedManpowerIds);

        this.alreadyUsed = {
          names: manpower.map(data => data.manpowerName.toLowerCase()),
          codes: manpower.map(data => this.employees.find(x => x.employeeCode === data.manPowerId)) // .text
        };
        // console.log("manpwr",this.mappedList) 

      });

    this.manPowerService.getAllEmployeesByCompany(this.companyId).subscribe((res: any) => {
        this.employees = res;
        // console.log("employee",this.employees)

        //    var manfil  = this.manPowers.map(x=>x.manpowerCode)
        //   var empfil  = this.employees.map(x=>x.employeeCode)

        //  this.employees = empfil.filter(val =>val.employeeCode && !manfil.includes(val));

        //  console.log("empfilter",this.employees);
        // console.log(empfil.filter(val => !manfil.includes(val)));

      });

  }
  onChangeEmployee(evt){
    if (evt.itemData !== null) {
      const itemcode = this.mappedList.find((x) => x.manpowerCode === evt.itemData.employeeCode);
      if (itemcode) {
        this.addForm.patchValue({ manpowerId: null });
        this.toastr.showErrorMessage('Duplicate Code is not allowed');
      } 
    }
  }
  ngOnDestroy(): void {
    this.subscribers.forEach(subscriber => {
      subscriber.unsubscribe();

    });
  }

  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content == 'View') {
      this.manpowerCode = args.rowData['manpowerCode'];
      this.manpowerName = args.rowData['manpowerName'];
      this.manpowerCategory = args.rowData['manpowerCategory'];
      this.email = args.rowData['email'];
      this.phone = args.rowData['phone'];
      this.remark = args.rowData['remarks'];
      this.open(this.modelPopup);
    }
  }




  getManpowers() {
    this.manPowerService.getAll()
      .subscribe(res => {
        this.manPowers =  this.mappedList = res.map(man => {
          return {
            ...man,
            // categoryName: this.getCategoryName(man.id),
            phoneText: `+${this.slicePipe.transform(man.phone, 0, 3)}-${this.slicePipe.transform(man.phone, 3, 10)}`
          };
        });

      });
  }
  getCategoryName(id: number) {
    return this.manPowerCategories.find(cat => cat.id === id) ? this.manPowerCategories.find(cat => cat.id === id).categoryName : '';
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Own Manpower'  : 'Add Own Manpower';
    }
  }

  queryCellInfo(args) {
    
    // this.mappedManpowerIds.includes(args.data.id)
    if (args.cell.classList.contains('e-unboundcell') && this.mappedManpowerIds.find(x => x.manpowerid === (args.data.id))) {
      args.cell.querySelector('button[title=\'Edit\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Edit\']').classList.add('e-disabled');
      args.cell.querySelector('button[title=\'Delete\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Delete\']').classList.add('e-disabled');
    }
  }

  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add') {
      this.submitClicked = false;
    }
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {

      if (args.requestType === 'beginEdit') {
        this.addForm = this.createFormGroup(
          {
            ...args.rowData,
            manpowerId: this.employees.find(emp => emp.id === actionArgs.rowData.manpowerId).text,
          }
          );
      } else {
        this.addForm = this.createFormGroup(args.rowData);

      }

      this.subscribers.push(this.addForm.valueChanges.subscribe(res => {

        const employee = this.employees.find(emp => emp.text === res.manpowerId);

        if (!employee) {
            this.addForm.controls.manpowerId.setErrors(({ required: true }));
          } else {
            this.addForm.controls.manpowerId.setErrors((null));
          }
        this.addForm.patchValue({
            email: employee ? employee.email : '',
            phone: employee ? employee.phone : '',
            manpowerName: employee ? employee.name : '',
            manpowerCode: employee ? employee.employeeCode : ''
          }, { emitEvent: false });
      }));

    } else if (args.requestType === 'save') {
      this.submitClicked = true;

      if (this.addForm.valid) {
        const manpower: any = this.addForm.getRawValue();
        if (manpower.id) {
        this.manPowerService.update(
          {
            ...manpower,
            manpowerId: this.employees.find(emp => emp.text === this.addForm.getRawValue().manpowerId).id,
            manpowerCategory: this.getCategoryName(parseInt(manpower.manpowerCategoryId, 10)),
            manpowerCategoryId: parseInt(manpower.manpowerCategoryId, 10)
          }
        )
        .subscribe(res => {
          if (res) {
            this.getManpowers();
            this.toastr.showSuccessMessage('Own Manpower Updated Successfully');

            const manpowerCategory = this.manPowerCategories.find(x => x.id === manpower.manpowerCategoryId);
            manpowerCategory.isAssigned = true;
            this.manPowerCategoryService.update(manpowerCategory).subscribe(() => {

            });

          }
        });
      } else {
        const { id, ...manpowerData } = manpower;
        this.manPowerService.add(
          {
            ...manpowerData,
            manpowerId: this.employees.find(emp => emp.text === this.addForm.getRawValue().manpowerId).id,
            manpowerCategory: this.getCategoryName(parseInt(manpowerData.manpowerCategoryId, 10)),
            manpowerCategoryId: parseInt(manpowerData.manpowerCategoryId, 10)
          })
          .subscribe((res: HiredManPower) => {
            if (res) {
              this.getManpowers();
              this.toastr.showSuccessMessage('Own Manpower added Successfully');

              const manpowerCategory = this.manPowerCategories.find(x => x.id === manpower.manpowerCategoryId);
              manpowerCategory.isAssigned = true;
              this.manPowerCategoryService.update(manpowerCategory).subscribe(() => {

            });
            }
          });
       }
      } else {
        args.cancel = true;

      }

    } else if (args.requestType === 'delete') {
      const manpower: any = args.data[0];
      const { id, ...manpowerData } = manpower;
      this.manPowerService.delete(id).subscribe(res => {
        if (res) {
          this.getManpowers();
          this.toastr.showSuccessMessage('Own Manpower deleted Successfully');
        }
      });
    }


  }
  createFormGroup(manpower): FormGroup {
    return this.formBuilder.group({
      id: [manpower.id],
      manpowerId: [manpower.manpowerId, [
        Validators.required,
      ]],
      manpowerCategoryId: [manpower.manpowerCategoryId, [
       Validators.required,
      ]],
      manpowerType: [1],
      manpowerName: [{ value: manpower.manpowerName, disabled: true }],
      manpowerCode: [manpower.manpowerCode],
      email: [{ value: manpower.email, disabled: true }],
      phone: [{ value: manpower.phone, disabled: true }],

      remarks: [manpower.remarks, [
        Validators.maxLength(128)

      ]],
      // createdBy: [this.currentUserId],
      // modifiedBy: [this.currentUserId]
    });
  }
}
