import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems, CommandClickEventArgs, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { TimeSheetUpdationService } from '../time-sheet-updation.service';
import { ReleaseTimesheet } from '../time-sheet-updation.model';
import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { ManPowerCategory } from '@settings/man-power-category/man-power-category.model';
import { OwnManPowerService } from '@settings/man-power/own-man-power.service';
import { ProductionShift } from '@settings/production-shift/production-shift.model';
import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { ProductionorderService } from '@features/productionorder/productionorder.service';
import { DatePipe } from '@angular/common';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ManpowerShiftMappingService } from '@features/mapping/manpower-shift-mapping/manpower-shift-mapping.service';

@Component({
  selector: 'app-time-sheet-updation',
  templateUrl: './time-sheet-updation.component.html'
})
export class TimeSheetUpdationComponent implements OnInit {

  productionOrderId: number;
  manpowerCategoryId: number;
  manpowerCategory: string;
  employeeId: number;
  employeeNameView: string;
  shiftIdView: number;
  shiftName: string;
  batchNumberView: string;
  operationIdView: number;
  operationName: string;
  taskId: number;
  taskName: string;
  inTimeView: string;
  outTimeView: string;
  closeResult: string;
  manpowerToShift: any;
  public startDate;
  public endDate;
  manPowerCategory: ManPowerCategory[] = [];
  manpowerName: any[] = [];
  productionShift: ProductionShift[];
  timeSheet: ReleaseTimesheet[] = [];
  batchData: any;
  operation: any;
  productionOrderNumber: number;
  batch: any[] = [];
  employeeNameFilterList: any;
  employeeShiftFilterList: any;
  timeSheetEditData: any;

  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('content') modelPopup: any;
  @ViewChild('startTime') public startTimePicker: TimePickerComponent;
  @ViewChild('endTime') public endTimePicker: TimePickerComponent;

  public orderForm: FormGroup;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search', 'ExcelExport'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];
  submitClicked: boolean;
  get manpowerCategoryName() { return this.orderForm.get('manpowerCategoryId'); }
  get employeeName() { return this.orderForm.get('employeeId'); }
  get shiftId() { return this.orderForm.get('shiftId'); }
  get batchNumber() { return this.orderForm.get('batchNumber'); }
  get operationId() { return this.orderForm.get('operationId'); }
  get enterInTime() { return this.orderForm.get('inTime'); }
  get enterOutTime() { return this.orderForm.get('outTime'); }

  constructor(
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private timeSheetUpdationService: TimeSheetUpdationService,
    private manPowerCategoryService: ManPowerCategoryService,
    private manPowerService: OwnManPowerService,
    private manpowerShiftMappingService: ManpowerShiftMappingService,
    private productionorderService: ProductionorderService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.productionOrderId = Number(this.route.snapshot.paramMap.get('id'));
    this.getAllManPowerCategory();
    this.getTimeSheets();
    this.getAllEmployee();
    this.getAllShift();
    this.getAllBatchList();
  }

  toolbarClick(args: ClickEventArgs): void {
    // console.log("click", args.item.id)
    if (args.item.id === 'grid_1177377541_0_excelexport') { // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }

  //time sheet All

  getTimeSheets() {
    this.timeSheetUpdationService.get(this.productionOrderId).subscribe(result => {
      this.timeSheet = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Time Sheet Details');
      });
  }

  getAllManPowerCategory() {
    this.manPowerCategoryService.getAll().subscribe(result => {
      this.manPowerCategory = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the ManPower Category Details');
      });
  }

  getCategoryName(event) {
    this.orderForm.patchValue({ manpowerCategory: event.itemData.categoryName });
    this.employeeNameFilterList = this.manpowerName.filter(x => x.manpowerCategoryId == event.itemData.id);
  }

  getAllEmployee() {
    this.manPowerService.getAll().subscribe(res => {
      this.manpowerName = res;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Employee Details');
      });
  }

  getEmployeeShift(event) {
    this.orderForm.patchValue({ employeeName: event.itemData.manpowerName });
    this.employeeShiftFilterList = this.manpowerToShift.filter(x => x.manpowerCode == event.itemData.manpowerCode);
  }

  getAllShift() {
    this.manpowerShiftMappingService.getAll().subscribe(result => {
      this.manpowerToShift = result;
      // console.log('resultmapped', this.manpowerToShift);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the manpower shift Details');
      });
  }

  getShiftName(event) {
    this.orderForm.patchValue({ shiftName: event.itemData.shiftName });
  }

  getAllBatchList() {
    this.productionorderService.get(this.productionOrderId).subscribe(result => {
      this.batchData = result;
      for (let index = 0; index < result.batchSize; index++) {
        const element = index + 1;
        this.batch.push(element)
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Batch details');
      });
  }

  getOperationRoutes(event) {
    this.productionorderService.getPlannedPORoutingDetails(this.productionOrderId, event.value).subscribe((result: any) => {
      this.operation = result.operationCollection;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Operation details');
      });
  }

  getOperationName(event) {
    this.orderForm.patchValue({ operationName: event.itemData.operationName });
    this.orderForm.patchValue({ taskId: event.itemData.taskCollection[0].id });
    this.orderForm.patchValue({ taskName: event.itemData.taskCollection[0].taskName });
  }

  // public inTimeChange(args){
  //   let value : Date;
  //   value = new  Date(args.value);
  //   // this.endTimePicker.enabled = true;
  //   value.setMinutes(value.getMinutes() + this.endTimePicker.step);
  //   this.endTimePicker.min = value;
  // }

  // public outTimeChange(args) {
  //   this.inTime = this.orderForm.get('inTime').value;
  //   this.outTime = args.value;
  //   // if (this.startDate && this.endDate && +this.endDate > +this.startDate) {
  //   //   var difference = (this.endDate.getTime() - this.startDate.getTime()) / 3600000;
  //   //   this.orderForm.controls['shiftTotalTime'].setValue(difference);
  //   // }
  // }

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
    if (args.commandColumn.buttonOption.content == 'View') {
      this.manpowerCategory = args.rowData["manpowerCategory"];
      this.employeeNameView = args.rowData["employeeName"];
      this.shiftName = args.rowData["shiftName"];
      this.batchNumberView = args.rowData["batchNumber"];
      this.operationName = args.rowData["operationName"];
      this.taskName = args.rowData["taskName"];
      this.inTimeView = args.rowData["inTime"];
      this.outTimeView = args.rowData["outTime"];
      this.open(this.modelPopup);
    }
    if (args.commandColumn.type == 'Edit') {
      this.timeSheetEditData = args.rowData;
      // console.log("timeSheetEditData", this.timeSheetEditData);
      this.employeeNameFilterList = this.manpowerName.filter(x => x.manpowerCategoryId == this.timeSheetEditData.manpowerCategoryId);
      this.employeeShiftFilterList = this.manpowerToShift.filter(x => x.shiftId == this.timeSheetEditData.shiftId);
      // this.employeeShiftFilterList = this.manpowerToShift.filter(x => x.manpowerCode == this.timeSheetEditData.manpowerCode);
      this.productionorderService.getPlannedPORoutingDetails(this.timeSheetEditData.productionOrderId, this.timeSheetEditData.batchNumber).subscribe((result: any) => {
        this.operation = result.operationCollection;
      },
        error => {
          console.error(error);
          this.toastr.showErrorMessage('Unable to Bind the Operation details');
        });
    }
  }

  // dataBound() {
  //   this.orderForm.patchValue({ employeeId: this.timeSheetEditData.employeeId });
  //   this.orderForm.patchValue({ shiftId: this.timeSheetEditData.shiftId });
  //   this.orderForm.patchValue({ operationId: this.timeSheetEditData.operationId });
  // }

  createFormGroup(time: any): FormGroup {
    return this.formBuilder.group({
      id: [time.id == null ? 0 : time.id],
      productionOrderId: this.productionOrderId,
      manpowerCategoryId: [time.manpowerCategoryId,
      [Validators.required
      ]],
      manpowerCategory: [time.manpowerCategory,
      []],
      employeeId: [time.employeeId,
      [Validators.required
      ]],
      employeeName: [time.employeeName, 
        []],
      shiftId: [time.shiftId, [
        Validators.required,
        Validators.maxLength(4),
      ]],
      shiftName: [time.shiftName, [
      ]],
      batchNumber: [time.batchNumber, [
        Validators.required,
        Validators.maxLength(4),
      ]],
      operationId: [time.operationId, [
        Validators.required,
        Validators.maxLength(32),
      ]],
      operationName: [time.operationName, [
      ]],
      taskId: [time.taskId || 0, [
        // Validators.required,
        // Validators.maxLength(32),
      ]],
      taskName: [time.taskName || '', [
        // Validators.required,
        // Validators.maxLength(32),
      ]],
      inTime: [time.inTime, [
        Validators.required
      ]],
      outTime: [time.outTime, [
        Validators.required
      ]]
    });
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Time Sheet Updation' : 'Add Time Sheet Updation';
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
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      if (args.requestType === 'add') {
      }
      this.submitClicked = false;
      this.orderForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      let addFormData = this.orderForm.value;
      // console.log("addFormData", addFormData);

      addFormData.inTime = this.datePipe.transform(addFormData.inTime, 'yyyy/MM/dd h:mm a');
      addFormData.outTime = this.datePipe.transform(addFormData.outTime, 'yyyy/MM/dd  h:mm a');
      if (!(addFormData["id"])) {
        if (this.orderForm.valid) {
          this.timeSheetUpdationService.add(addFormData)
            .subscribe(res => {
              this.toastr.showSuccessMessage('Time Sheet added successfully!');
              // console.log("res", res);
              this.getTimeSheets();
            }, error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the Time Sheets Details');
            });
        }
      }
      else {
        if (this.orderForm.valid) {
          this.timeSheetUpdationService.update(addFormData)
            .subscribe(res => {
              this.toastr.showSuccessMessage('Time Sheet updated successfully!');
              this.getTimeSheets();
            }, error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to update the Time Sheet Details');
            });
        }
      }
    }
    else if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        this.timeSheetUpdationService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Time Sheet deleted successfully!');
            this.getTimeSheets();
          }
        },
          error => {
            console.error("err", error);
            this.toastr.showErrorMessage('Unable to delete the Time Sheet Details');
          });
      }
    }
  }
}
