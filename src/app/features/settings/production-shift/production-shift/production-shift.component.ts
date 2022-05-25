import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { enableRipple } from '@syncfusion/ej2-base';
import { ProductionShiftService } from '../production-shift.service';
import { enumSelector } from '@shared/utils/common.functions';
import { Days } from 'src/app/models/common/types/days';
import { DatePipe } from '@angular/common';
import { ProductionShift } from '../production-shift.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';
import { TimePickerComponent } from '@syncfusion/ej2-angular-calendars';

enableRipple(true);
@Component({
  selector: 'app-production-shift',
  templateUrl: './production-shift.component.html' 
})

export class ProductionShiftComponent implements OnInit {
  addForm: FormGroup;
  productionShift: ProductionShift[];
  shiftStartDays = enumSelector(Days);
  @ViewChild('content') modelPopup: any;
  @ViewChild('startTime') public startTimePicker: TimePickerComponent;
  @ViewChild('endTime') public endTimePicker: TimePickerComponent;
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };

  formprodlineCode : number;
  public startDate;
  public endDate;
  shiftCodeView: string;
  shiftNameView: string;
  shiftDurationInDaysView: number;
  shiftStartDayView: string;
  noOfBreaksView: number;
  breakDurationInMinuteView: number;
  startTimeView: string;
  endTimeView: string;
  shiftTotalTimeView: number;
  isOverTimeRequiredView: string;
  minimumOverTimeHourView: number;
  timeBeyondShiftHourView: number;
  remarksView: string;
  closeResult: string;

  submitClicked: boolean;
  get shiftName() { return this.addForm.get('shiftName'); }
  get shiftDurationInDays() { return this.addForm.get('shiftDurationInDays'); }
  get shiftStartDay() { return this.addForm.get('shiftStartDay'); }
  get noOfBreaks() { return this.addForm.get('noOfBreaks'); }
  get breakDurationInMinute() { return this.addForm.get('breakDurationInMinute'); }
  get startTimePick() { return this.addForm.get('startTime'); }
   get endTimePick() { return this.addForm.get('endTime'); }
  // get shiftTotalTime() { return this.addForm.get('shiftTotalTime'); }
  get isOverTimeRequired() { return this.addForm.get('isOverTimeRequired'); }
  get minimumOverTimeHour() { return this.addForm.get('minimumOverTimeHour'); }
  get timeBeyondShiftHour() { return this.addForm.get('timeBeyondShiftHour'); }
  get remarks() { return this.addForm.get('remarks'); }

  constructor(
    private productionShiftService: ProductionShiftService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private splitByUpperCasePipe: SplitByUpperCasePipe
  ) { }

  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];

  ngOnInit(): void {
    this.getAllProduction();
    this.shiftStartDays = enumSelector(Days);
  }

  queryCellInfo(args) {
    if (args.cell.classList.contains("e-unboundcell") && args.data.isAssigned === true) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }


  public getshiftduration = (field: string, data: Object, column: Object) => {
    let qctype = Days;
    return this.splitByUpperCasePipe.transform(qctype[data[field]]);
  }

  getAllProduction() {
    this.productionShiftService.getAll().subscribe(result => {
      this.productionShift = result;
      this.alreadyUsed = {
        names: result.map(data => data.shiftName.toLowerCase()),
        codes: result.map(data => data.shiftCode.toLowerCase())
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the production shift details');
      });
  }

  getLastProductionShiftId() {
    this.productionShiftService.getLastPrductionshiftId().subscribe(result => {
      this.formprodlineCode = result + 1;
      this.addForm.controls['shiftCode'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the id');
      });
  }

  createFormGroup(prodshift: any): FormGroup {
    
    if(prodshift){
      this.formprodlineCode = prodshift.shiftCode;
    }
    return this.formBuilder.group({
      id: [prodshift.id == null ? 0 : prodshift.id],
      shiftCode: [{value:prodshift.shiftCode, disabled:true}, [
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]],
      shiftName: [prodshift.shiftName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (prodshift.shiftName || '').toLowerCase()))
      ]],
      shiftDurationInDays: [prodshift.shiftDurationInDays, [
        Validators.required,
        Validators.max(100),
        Validators.min(0)
      ]],
      shiftStartDay: [prodshift.shiftStartDay, [
        Validators.required,
      ]],
      noOfBreaks: [prodshift.noOfBreaks, [
        Validators.required,
        Validators.max(10)
      ]],
      breakDurationInMinute: [prodshift.breakDurationInMinute, [
        Validators.required,
        Validators.min(1),
        Validators.max(60)
      ]],
      startTime: [prodshift.startTime, [
        Validators.required
      ]],
      endTime: [prodshift.endTime, [
        // Validators.required
      ]],
      shiftTotalTime: [prodshift.shiftTotalTime, [
        Validators.required
      ]],
      isOverTimeRequired: [prodshift.isOverTimeRequired == null ? false : prodshift.isOverTimeRequired, [
        Validators.required
      ]],
      minimumOverTimeHour: [prodshift.minimumOverTimeHour, [
        Validators.max(12)
      ]],
      timeBeyondShiftHour: [prodshift.timeBeyondShiftHour, [
        Validators.max(12)

      ]], 
      remarks: [prodshift.remarks, [
        Validators.maxLength(128),
       
      ]],
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
    let durationtype = this.splitByUpperCasePipe.transform(Days[args.rowData["shiftStartDay"]]);
    if (args.commandColumn.buttonOption.content == 'View') {
      this.shiftCodeView = args.rowData["shiftCode"];
      this.shiftNameView = args.rowData["shiftName"];
      this.shiftDurationInDaysView = args.rowData["shiftDurationInDays"];
      this.shiftStartDayView = durationtype;
      this.noOfBreaksView = args.rowData["noOfBreaks"];
      this.breakDurationInMinuteView = args.rowData["breakDurationInMinute"];
      this.startTimeView = args.rowData["startTime"];
      this.endTimeView = args.rowData["endTime"];
      this.shiftTotalTimeView = args.rowData["shiftTotalTime"];
      this.isOverTimeRequiredView = args.rowData["isOverTimeRequired"] == true ? "Yes" : "No";
      this.minimumOverTimeHourView = args.rowData["minimumOverTimeHour"];
      this.timeBeyondShiftHourView = args.rowData["timeBeyondShiftHour"];
      this.remarksView = args.rowData["remarks"];
      this.open(this.modelPopup);
    }
  }
 
  public getStartDate(args) {
    let value: Date;
    value = new Date(args.value);
    this.endTimePicker.enabled = true;
    // value.setMinutes(value.getMinutes() + this.endTimePicker.step);
    // this.endTimePicker.min = value;
    if(this.addForm.controls['endTime'].value){
      this.addForm.controls['endTime'].setValue(null);
    }
  }

  public onendChange(args) {
    this.startDate = this.addForm.get('startTime').value;
    this.endDate = args.value;
    if (this.startDate && this.endDate && +this.endDate > +this.startDate) {
      var difference = (this.endDate.getTime() - this.startDate.getTime()) / 3600000;
      this.addForm.controls['shiftTotalTime'].setValue(difference);
    }
    if(this.startDate){
      if(this.startDate >= this.endDate){
        this.addForm.controls['endTime'].setErrors({'invalidDate' : true});
        this.toastr.showErrorMessage('End Time should be greater than  Start Time.');
        //  this.addForm.controls['endTime'].setValue(null)      
      }
    }

  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      const shiftName = args.rowData['shiftName'];
      dialog.header = args.requestType === 'beginEdit' ? 'Edit ' + shiftName : 'Add Production shift';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      if (args.requestType === 'add') {
        this.submitClicked = false;
        this.getLastProductionShiftId();
      }
      this.addForm = this.createFormGroup(args.rowData);

    }
    if (args.requestType === 'save') {
      this.submitClicked =  true;

      if(this.addForm.valid){
        let _insertdata = this.addForm.value;
        _insertdata.shiftCode = this.formprodlineCode,
        _insertdata.startTime = this.datePipe.transform(_insertdata.startTime, 'h:mm a');
        _insertdata.endTime = this.datePipe.transform(_insertdata.endTime, 'h:mm a');
        if (!(_insertdata["id"])) {
          this.productionShiftService.add(_insertdata)
            .subscribe(res => {
              if (res) {
                this.getAllProduction();
                this.toastr.showSuccessMessage('Production shift added successfully!');
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the production shift details');
              }
            );
        }
        else {
          this.productionShiftService.update(_insertdata)
            .subscribe(res => {
              if (res) {
                this.getAllProduction();
                this.toastr.showSuccessMessage('Production shift updated successfully!');
  
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the production shift details');
              }
            );
        }
      }
      else{
        args.cancel = true;
      }
      
    }
    else if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        if (row.data[0].isAssigned === false) {
          this.productionShiftService.delete(id).subscribe(res => {
            if (res) {
              this.getAllProduction();
              this.toastr.showSuccessMessage('Production shift deleted successfully!');
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to delete the production shift details');
            }
          );
        }
      }
    }
  }
}
