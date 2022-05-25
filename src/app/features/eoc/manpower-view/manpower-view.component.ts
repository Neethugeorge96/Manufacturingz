import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EOCManpowerToTaskService } from '../manpower-to-task.service';
import { EOCManpower } from '../manpower-to-task.model';
import { ManPowerCategory } from '@settings/man-power-category/man-power-category.model';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { disableDebugTools } from '@angular/platform-browser';


@Component({
  selector: 'app-manpower-view',
  templateUrl: './manpower-view.component.html'
})
export class ManpowerViewComponent implements OnInit {

  eocManpower: EOCManpower[] = [];
  manPowerCategories: ManPowerCategory[] = [];

  @Input() task: any;
  manpowerRoute: any;
  taskId: number;
  taskCode: string;
  taskName: string;
  manpowerCategoryCode: string;
  manpowerCategory: string;
  manpowerName: string;
  noOfResources: number;
  operationHour: number;
  manpowerCostPerHour: number;
  manpowerCostPerCategory: number;
  idleHours: number;
  idleHourCost: number;
  currencyCode: string;

  closeResult: string;
  @ViewChild('content') modelPopup: any;

  public orderForm: FormGroup;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Search'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    // { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ]
  submitClicked: boolean;

  get noOfResourcesCtrl() { return this.orderForm.get('noOfResources'); }
  get operationHourCtrl() { return this.orderForm.get('operationHour'); }
  get idleHoursCtrl() { return this.orderForm.get('idleHours'); }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eocManpowerToTaskService: EOCManpowerToTaskService,
    private manPowerCategoryService: ManPowerCategoryService
  ) { }

  ngOnInit(): void {
    this.getEocManPowerToTask();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      // this.routingId = Number(this.route.snapshot.paramMap.get('id'));
      this.getEocManPowerToTask();
      }
  }

  getEocManPowerToTask() {
    this.eocManpowerToTaskService.getAllEOCManpowerByTaskId(this.task.id).subscribe(result => {
      this.manpowerRoute = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Eoc Manpower To Task  Details');
      });
  }

  open(content: any) {
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
    console.log(args.rowData);
    if (args.commandColumn.buttonOption.content == 'View') {
      this.taskName = args.rowData["taskName"];
      this.manpowerCategory = args.rowData["manpowerCategory"];
      this.noOfResources = args.rowData["noOfResources"];
      this.manpowerCostPerHour = args.rowData["manpowerCostPerHour"];
      this.manpowerCostPerCategory = args.rowData["manpowerCostPerCategory"];
      this.idleHours = args.rowData["idleHours"];
      this.idleHourCost = args.rowData["idleHourCost"];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(manpower: any): FormGroup {
    return this.formBuilder.group({
      id: [manpower.id == null ? 0 : manpower.id],
      taskId: [manpower.taskId, [
        Validators.required
      ]],
      taskCode: [manpower.taskCode, [
        Validators.required
      ]],
      taskName: [manpower.taskName, [
        Validators.required
      ]],
      manpowerCategoryCode: [{ value: manpower.manpowerCategoryCode, disabled: true }, [
        Validators.required
      ]],
      manpowerCategory: [{ value: manpower.manpowerCategory, disabled: true }, [
        Validators.required
      ]],
      noOfResources: [manpower.noOfResources, [
        Validators.required,
        Validators.max(999999)
      ]],
      operationHour: [manpower.operationHour, [
        Validators.required,
        Validators.max(999999)
      ]],
      manpowerCostPerHour: [{ value: manpower.manpowerCostPerHour, disabled: true }, , [
        Validators.required
      ]],
      manpowerCostPerCategory: [{ value: manpower.manpowerCostPerCategory, disabled: true }, , [
        Validators.required
      ]],
      idleHours: [manpower.idleHours, [
        Validators.required,
        Validators.max(999999)
      ]],
      idleHourCost: [{ value: manpower.idleHourCost, disabled: true }, , [
        Validators.required
      ]],
      currencyCode: [manpower.currencyCode, [
        Validators.required
      ]]
    })
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Manpower' : 'Add Manpower';
    }
    if (args.dialog) {
      let btnObj = (args.dialog as any).btnObj[0];

      btnObj.disabled = !this.orderForm.valid;
      this.orderForm.statusChanges.subscribe((e) => {
        e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true;
      });
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.orderForm = this.createFormGroup(args.rowData);
      this.orderForm.valueChanges.subscribe(res => {
        this.orderForm.patchValue({
          manpowerCostPerCategory: res.operationHour * this.orderForm.getRawValue().manpowerCostPerHour,
          idleHourCost: res.idleHours * this.orderForm.getRawValue().manpowerCostPerHour,
        }, {
          emitEvent: false
        })
      })
    }
    if (args.requestType === 'save') {
      let orderFormData;
      if(this.orderForm.valid){
        orderFormData = this.orderForm.getRawValue();
      console.log("orderFormData", orderFormData)
      orderFormData = {
        ...orderFormData,
      };
      if (orderFormData.id) {
        this.eocManpowerToTaskService.update(orderFormData)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Eoc Manpower To Task  updated successfully!');
              console.log("res", res);
              this.manpowerRoute = this.getEocManPowerToTask();
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to update the Eoc Manpower To Task  Details');
            }
          );
      }
      else {
        let { ...addFormData } = orderFormData;
        orderFormData = {
          ...orderFormData,
        };
        console.log(orderFormData);
        this.eocManpowerToTaskService.add(orderFormData)
          .subscribe(res => {
            this.toastr.showSuccessMessage('Eoc Manpower To Task  added successfully!');
            this.manpowerRoute = this.getEocManPowerToTask();
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the Eoc Manpower To Task  Details');
            });
      }
      }
      else{
        args.cancel = true;
      }
      
    }
    if (args.requestType === 'beginEdit') {
      let editMappingData: any = args.rowData;
      editMappingData = {
        ...editMappingData,
      };
      this.orderForm = this.createFormGroup(editMappingData);
      this.orderForm.valueChanges.subscribe(res => {
        this.orderForm.patchValue({
          manpowerCostPerCategory: res.operationHour * this.orderForm.getRawValue().manpowerCostPerHour,
          idleHourCost: res.idleHours * this.orderForm.getRawValue().manpowerCostPerHour,
        }, {
          emitEvent: false
        })
      })
    }
  }

}
