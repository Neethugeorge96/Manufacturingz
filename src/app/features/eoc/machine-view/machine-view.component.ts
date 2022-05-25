import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ManPowerCategory } from '@settings/man-power-category/man-power-category.model';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { EOCMachineToTaskService } from '../machine-to-task.service';
import { EOCMachine } from '../machine-to-task.model';

@Component({
  selector: 'app-machine-view',
  templateUrl: './machine-view.component.html'
})
export class MachineViewComponent implements OnInit {

  eocMachine: EOCMachine[] = [];
  closeResult: string;
  @ViewChild('content') modelPopup: any;

  @Input() task: any;
  machineRoute: any;
  taskId: number;
  taskCode: string;
  taskName: string;
  machineCode: string;
  machineName: string;
  costRatePerHour: number;
  machineHour: number;
  machineCost: number;
  idleHours: number;
  idleHourCost: number;
  currencyCode: string;

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
  get machineHourCtrl() { return this.orderForm.get('machineHour'); }
  get idleHoursCtrl() { return this.orderForm.get('idleHours'); }
  get costRatePerHr() { return this.orderForm.get('costRatePerHour'); }
  get machineCostCtrl() { return this.orderForm.get('machineCost'); }
  get idleHourCostCtrl() { return this.orderForm.get('idleHourCost'); }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eocMachineToTaskService: EOCMachineToTaskService,
    private manPowerCategoryService: ManPowerCategoryService
  ) { }

  ngOnInit(): void {
    this.getEocMachineToTask();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      // this.routingId = Number(this.route.snapshot.paramMap.get('id'));
      this.getEocMachineToTask();
    }
  }

  getEocMachineToTask() {
    this.eocMachineToTaskService.getAllEOCMachineByTaskId(this.task.id).subscribe(result => {
      this.machineRoute = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Eoc Machine To Task  Details');
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
      this.machineName = args.rowData["machineName"];
      this.costRatePerHour = args.rowData["costRatePerHour"];
      this.machineHour = args.rowData["machineHour"];
      this.machineCost = args.rowData["machineCost"];
      this.idleHours = args.rowData["idleHours"];
      this.idleHourCost = args.rowData["idleHourCost"];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(machine: any): FormGroup {
    return this.formBuilder.group({
      id: [machine.id == null ? 0 : machine.id],
      taskId: [machine.taskId, [
        Validators.required
      ]],
      taskCode: [machine.taskCode, [
        Validators.required
      ]],
      taskName: [machine.taskName, [
        Validators.required
      ]],
      machineCode: [{ value: machine.machineCode, disabled: true }, [
        Validators.required
      ]],
      machineName: [{ value: machine.machineName, disabled: true }, [
        Validators.required
      ]],
      costRatePerHour: [{ value: machine.costRatePerHour, disabled: true }, , [
        Validators.required
      ]],
      machineHour: [machine.machineHour, [
        Validators.required,
        Validators.max(999999)
      ]],
      machineCost: [{ value: machine.machineCost, disabled: true }, , [
        Validators.required
      ]],
      idleHours: [machine.idleHours, [
        Validators.required,
        Validators.max(999999)
      ]],
      idleHourCost: [{ value: machine.idleHourCost, disabled: true }, , [
        Validators.required
      ]],
      currencyCode: [machine.currencyCode, [
        Validators.required
      ]]
    })
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Machine' : 'Add Machine';
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
          machineCost: res.machineHour * this.orderForm.getRawValue().costRatePerHour,
          idleHourCost: res.idleHours * this.orderForm.getRawValue().costRatePerHour,
        }, {
          emitEvent: false
        })
      })
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.orderForm.valid){
        let orderFormData;
        orderFormData = this.orderForm.getRawValue();
        this.submitClicked = true;
        orderFormData = {
          ...orderFormData,
        };
        if (orderFormData.id) {
          this.eocMachineToTaskService.update(orderFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('EOC Machine To Task  updated successfully!');
                console.log("res", res);
                this.machineRoute = this.getEocMachineToTask();
  
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to update the EOC Machine To Task  Details');
              }
            );
        }
        else {
          let { ...addFormData } = orderFormData;
          orderFormData = {
            ...orderFormData,
          };
          console.log(orderFormData);
          this.eocMachineToTaskService.add(orderFormData)
            .subscribe(res => {
              this.toastr.showSuccessMessage('EOC Machine To Task  added successfully!');
              this.machineRoute = this.getEocMachineToTask();
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the EOC Machine To Task  Details');
              }
            );
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
          machineCost: res.machineHour * this.orderForm.getRawValue().costRatePerHour,
          idleHourCost: res.idleHours * this.orderForm.getRawValue().costRatePerHour,
        }, {
          emitEvent: false
        })
      })
    }
  }

}
