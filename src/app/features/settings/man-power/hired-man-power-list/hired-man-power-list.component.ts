import { SlicePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Query } from '@syncfusion/ej2-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManPowerCategory } from '@settings/man-power-category/man-power-category.model';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { CommandClickEventArgs, CommandModel, DialogEditEventArgs, EditSettingsModel, IEditCell, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { forkJoin } from 'rxjs';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ManpowerType } from 'src/app/models/common/types/manpowertype';
import { HiredManPower } from '../hired-man-power';
import { HiredManPowerService } from '../hired-man-power.service';
import { DatePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { ManPowertoWorkCenterService } from '@features/mapping/manpower-workcenter-mapping/manpower-workcenter-mapping.service';

@Component({
  selector: 'app-hired-man-power-list',
  templateUrl: './hired-man-power-list.component.html',
  styles: [
  ]
})
export class HiredManPowerListComponent implements OnInit {

  manPowers: HiredManPower[] = [];
  manPowerCategories: ManPowerCategory[] = [];
  alreadyUsed: { names: string[]; } = {
    names: []
  };
  manpowerType = ManpowerType;
  manpowerTypeKeys: number[];
  mappedList: any[] = [];
  supplierList: any[] = [];
  assignedSuppliers: any[] = [];
  fields: object = { text: 'name', value: 'id' };
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };

  closeResult: string;
  mappedManpowerIds: any;
  @ViewChild('content') modelPopup: any;

  supplierSubmitClicked: boolean;
  get poReference() { return this.supplierForm.get('poReference'); }
  get supplierName() { return this.supplierForm.get('supplierName'); }
  get costRatePerHour() { return this.supplierForm.get('costRatePerHour'); }
  get startDate() { return this.supplierForm.get('startDate'); }
  get endDate() { return this.supplierForm.get('endDate'); }

  submitClicked: boolean;
  manpowerForView: object;
  get manpowerCode() { return this.addForm.get('manpowerCode'); }
  get manpowerName() { return this.addForm.get('manpowerName'); }
  get manpowerCategoryId() { return this.addForm.get('manpowerCategoryId'); }
  get emailCtrl() { return this.addForm.get('email'); }
  get phone() { return this.addForm.get('phone'); }
  get remarks() { return this.addForm.get('remarks'); }



  public modaleditSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };



  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public modalToolbar: ToolbarItems[] = ['Search', 'Cancel', 'Update', 'Delete', 'Edit', 'Add'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  public supplierCommands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  addForm: FormGroup;
  supplierForm: FormGroup;

  allSuppliers: {
    text: string;
    value: number;
  }[];
  pOList: {
    text: string;
    value: number;
  }[];

  viewSuppliers: any[] = [];
  constructor(
    public modalService: NgbModal,
    private manPowerService: HiredManPowerService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    private slicePipe: SlicePipe,
    private manPowerCategoryService: ManPowerCategoryService,
    private mappedManpowerService: ManPowertoWorkCenterService
  ) {

  }

  ngOnInit(): void {

    this.getPO();
    this.getSuppliers();
    forkJoin([this.manPowerCategoryService.getAll(), this.manPowerService.getAll(), this.mappedManpowerService.MappedManpower()])
      .subscribe(([category, manpower, mappedMapowers]) => {
        this.manPowerCategories = category;
        this.manPowers = this.mappedList = manpower.map(man => {
          return {
            ...man,
            // manpowerCategory: this.getCategoryName(man.id),
            phoneText: `+${this.slicePipe.transform(man.phone, 0, 3)}-${this.slicePipe.transform(man.phone, 3, 10)}`
          };
        });

        this.mappedManpowerIds = mappedMapowers.filter(x => x['manpowertype'] === 2);
        this.alreadyUsed = {
          names: manpower.map(man => man.manpowerName.toLowerCase())
        };
      });

  }

  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, () => { });
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content == 'View') {
      const rowArgs: any = args.rowData;
      this.manPowerService.getAssignedSuppliers(rowArgs.id).subscribe(res => {
        this.viewSuppliers = res;
      });
      this.manpowerForView = args.rowData;
      this.open(this.modelPopup);
    }
  }



  getPO() {
    this.manPowerService.getAllPoReference().subscribe(res => {
      this.pOList = res;
    });
  }
  getSuppliers() {
    this.manPowerService.getAllSuppliers().subscribe(res => {
      this.allSuppliers = res;
    });
  }
  getManpowers() {
    this.manPowerService.getAll()
      .subscribe(res => {
        this.manPowers = this.mappedList = res.map(man => {
          return {
            ...man,
            // manpowerCategory: this.getCategoryName(man.id),
            phoneText: `+${this.slicePipe.transform(man.phone, 0, 2)}-${this.slicePipe.transform(man.phone, 3, 9)}`
          };
        });
        this.alreadyUsed = {
          names: res.map(manpower => manpower.manpowerName)
        };
      });
  }
  getCategoryName(id: number) {
    return this.manPowerCategories.find(cat => cat.id === id) ? this.manPowerCategories.find(cat => cat.id === id).categoryName : '';
  }


  queryCellInfo(args) {
    if (args.cell.classList.contains('e-unboundcell') && this.mappedManpowerIds.find(x => x.manpowerid === (args.data.id))) {
      args.cell.querySelector('button[title=\'Edit\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Edit\']').classList.add('e-disabled');
      args.cell.querySelector('button[title=\'Delete\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Delete\']').classList.add('e-disabled');
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {

      const dialog = args.dialog;
      if (dialog) {
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Hired Manpower' : 'Add Hired Manpower';
      }
    }

    const actionArgs: any = args;
    if (actionArgs.rowData && Object.keys(actionArgs.rowData).includes('supplierName')) {
      if (args.requestType === 'save') {
        if (actionArgs.data.id) {
          this.manPowerService.editSupplier(actionArgs.data).subscribe(res => {

          });
        } else if (actionArgs.data.hiredManpowerId) {
          const supplier = {
            ...actionArgs.data,
            currencyCode: 'INR',
            manpowerName: this.addForm.value.manpowerName,
            supplierId: this.supplierList.find(sup => sup.value === actionArgs.data.supplierName)
          };
          this.manPowerService.addSupplier(supplier).subscribe(res => {

          });
        }
        // if (this.assignedSuppliers.find(supplier => supplier.id && actionArgs.data.id && supplier.id === actionArgs.data.id)) {
        //   this.assignedSuppliers.map(supplier => {
        //     if (supplier.id && actionArgs.data.id && supplier.id === actionArgs.data.id) {
        //       return {
        //         ...actionArgs.data,
        //         supplierName: this.supplierList.find(sup => sup.value === actionArgs.data.supplierId)
        //       };
        //     }
        //     return supplier;
        //   });
        // } else {
        // this.assignedSuppliers = this.assignedSuppliers.filter(sup => sup.text !== actionArgs.data.supplierName)
        // this.assignedSuppliers.push(actionArgs.data);
        // }
      }
    }
  }
  actionBegin(args: SaveEventArgs): void {

    const actionArgs: any = args;

    if ((actionArgs.rowData && Object.keys(actionArgs.rowData).includes('manpowerCategory')) ||
      (actionArgs.data && actionArgs.data.length === 1 && Object.keys(actionArgs.data[0]).includes('manpowerCode'))) {
      if (args.requestType === 'add' || args.requestType === 'beginEdit') {
        this.submitClicked = false;

        // this.assignedSuppliers = this.supplierList.filter(supplier => supplier.hiredManpowerId === actionArgs.rowData.id);
        this.addForm = this.createFormGroup(args.rowData);
        if (args.requestType === 'beginEdit') {
          this.manPowerService.getAssignedSuppliers(actionArgs.rowData.id).subscribe(res => {
            this.assignedSuppliers = res;
          });
        } else {
          this.assignedSuppliers = [];
        }


      } else if (args.requestType === 'save') {
        this.submitClicked = true;        
        if (this.addForm.valid) {
          const manpower: any = args.data;
          manpower.manpowerType = 2;
          if (manpower.id) {
            this.manPowerService.update(manpower).subscribe(res => {
              if (res) {
                const suppliers = this.assignedSuppliers.map(supplier => {
                  return {
                    ...supplier,
                    currencyCode: 'INR',
                    hiredManpowerId: manpower.id,
                    // poReference: parseInt(supplier.poReference, 10),
                    manpowerName: manpower.manpowerName,
                    // supplierName: supplier.supplierId,
                    // supplierId: this.supplierList.find(sup => sup.text === supplier.supplierName).value,
                  };
                });
                // this.manPowerService.assignSuppliers(suppliers).subscribe(res1 => {
                //   if (res1) {
                this.getManpowers();
                this.toastr.showSuccessMessage('Manpower Updated Successfully');
                //   }
                // });
              }
            });
          } else {
            const { id, ...manpowerData } = manpower;
            this.manPowerService.add(
              {
                ...manpowerData,
                manpowerCategory: this.getCategoryName(parseInt(manpowerData.manpowerCategoryId, 10)),
                manpowerCategoryId: parseInt(manpowerData.manpowerCategoryId, 10)
              })
              .subscribe((res: HiredManPower) => {
                const suppliers = this.assignedSuppliers.map(supplier => {
                  return {
                    ...supplier,
                    hiredManpowerId: res.id,
                    currencyCode: 'INR',
                    // pOReference: parseInt(supplier.pOReference, 10),
                    manpowerName: manpower.manpowerName,
                    // supplierName: supplier.supplierId,
                    supplierId: this.allSuppliers.find(sup => sup.text === supplier.supplierName).value,
                  };
                });
                forkJoin(
                  suppliers.map(p =>
                    this.manPowerService.addSupplier(p).pipe()
                  )
                ).subscribe(([res1]) => {
                  // flatten the multi-dimensional array
                  // const updatedProviders = [].concat(...p);

                  // this.updateProvidersInState(updatedProviders);
                });
                // this.manPowerService.assignSuppliers(suppliers).subscribe(res1 => {
                //   if (res1) {
                this.getManpowers();
                this.toastr.showSuccessMessage('Manpower Added Successfully');
                //   }
                // });

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
            this.toastr.showSuccessMessage('Manpower deleted Successfully');
          }
        },
          error => {
            console.error('err', error);
            this.toastr.showErrorMessage('Unable to delete the Manpower Details');
          }
        );
      }
    } else {
      if (args.requestType === 'add' || args.requestType === 'beginEdit') {
        this.supplierForm = this.createSupplierForm(args.rowData);
        this.supplierForm.valueChanges.subscribe(res => {
          if (new Date(res.startDate).getTime() > new Date(res.endDate).getTime()) {
            this.supplierForm.get('endDate').setErrors({ earlier: true }, { emitEvent: false });
          } else {
            this.supplierForm.get('endDate').setErrors(null, { emitEvent: false });
          }
          this.assignedSuppliers.forEach(supplier => {
            if (!this.supplierForm.get('startDate').errors) {
              if (new Date(supplier.startDate).getTime() <= new Date(res.startDate).getTime() &&
                new Date(supplier.endDate).getTime() >= new Date(res.startDate).getTime()) {
                this.supplierForm.get('startDate').setErrors({ taken: true }, { emitEvent: false });
              } else {
                this.supplierForm.get('startDate').setErrors(null, { emitEvent: false });
              }
            }
            if (!this.supplierForm.get('endDate').errors) {
              if (new Date(supplier.startDate).getTime() <= new Date(res.endDate).getTime() &&
                new Date(supplier.endDate).getTime() >= new Date(res.endDate).getTime()) {
                this.supplierForm.get('endDate').setErrors({ taken: true }, { emitEvent: false });
              } else {
                this.supplierForm.get('endDate').setErrors(null, { emitEvent: false });
              }
            }
            if (!this.supplierForm.get('endDate').errors && !this.supplierForm.get('startDate').errors) {
              if (new Date(res.startDate).getTime() <= new Date(supplier.startDate).getTime() &&
                new Date(res.endDate).getTime() >= new Date(supplier.startDate).getTime() &&
                new Date(res.startDate).getTime() <= new Date(supplier.endDate).getTime() &&
                new Date(res.endDate).getTime() >= new Date(supplier.endDate).getTime()) {
                this.supplierForm.get('endDate').setErrors({ taken: true }, { emitEvent: false });
                this.supplierForm.get('startDate').setErrors({ taken: true }, { emitEvent: false });
              } else {
                this.supplierForm.get('endDate').setErrors(null, { emitEvent: false });
                this.supplierForm.get('startDate').setErrors(null, { emitEvent: false });
              }
            }
          });

        });
        this.supplierSubmitClicked = false;

      } else if (args.requestType === 'delete') {
        const supplier: any = args.data[0];
        const { id, ...supplierData } = supplier;
        this.manPowerService.deleteSupplier(id).subscribe(res => {
          if (res) {
            // this.getManpowers();
            // this.toastr.showSuccessMessage('Manpower deleted Successfully');
          }
        });
      } else if (args.requestType === 'save') {
        this.supplierSubmitClicked = true;
        if (this.supplierForm.valid) {
          args.data = this.supplierForm.value;
          args.rowData = this.supplierForm.value;
        } else {
          args.cancel = true;
        }
      }
      // this.assignedSuppliers = this.assignedSuppliers.filter(supplier => supplier.supplierName !== actionArgs.data.supplierName);
    }
  }

  // }
  createFormGroup(manpower): FormGroup {
    return this.formBuilder.group({
      id: [manpower.id, [
        // Validators.required
      ]],
      manpowerCode: [{ value: manpower.manpowerCode || this.randomString(4, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), disabled: true }, [
        Validators.required,
        Validators.maxLength(4)
      ]],
      manpowerCategoryId: [manpower.manpowerCategoryId, [
        Validators.required,
      ]],
      manpowerType: [2],
      manpowerName: [manpower.manpowerName, [
        Validators.required,
        Validators.maxLength(32),
        // duplicateNameValidator(this.alreadyUsed.names)
      ]],
      // manpowerCode: [],
      email: [manpower.email, [
        Validators.required,
        // Validators.email,
        // Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      phone: [manpower.phone, [
        Validators.maxLength(15),
        Validators.required,
      ]],
      remarks: [manpower.remarks, [
        Validators.maxLength(128)
      ]],
      suppliers: this.formBuilder.array([])
      // createdBy: [this.currentUserId],
      // modifiedBy: [this.currentUserId]
    });
  }
  createSupplierForm(supplier) {
    return this.formBuilder.group({
      hiredManpowerId: [supplier.hiredManpowerId || this.addForm.value.id],
      manpowerName: [''],
      poReference: [supplier.poReference, [Validators.required]],
      supplierId: [supplier.supplierId],
      supplierName: [supplier.supplierName, [Validators.required]],
      costRatePerHour: [supplier.costRatePerHour, [Validators.required,Validators.max(999999)]],
      startDate: [supplier.startDate, [Validators.required]],
      endDate: [supplier.endDate, [Validators.required]]

    });
  }
  randomString(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) { result += chars[Math.floor(Math.random() * chars.length)]; }
    return result;
  }


}
