import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QualitycontrolService } from '../qualitycontrol.service';
import { QualityControl } from '../qualitycontrol.model';
import { QCType } from 'src/app/models/common/qualitycontrol';
import { enumSelector } from '@shared/utils/common.functions';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';

@Component({
  selector: 'app-qualitycontrol',
  templateUrl: './qualitycontrol.component.html',
})

export class QualitycontrolComponent implements OnInit {
  qualityControlForm: FormGroup;
  qcData: QualityControl[] = [];
  qcTypes = enumSelector(QCType);
  frequencyData: Array<any> = [];
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };

  formQCCode : number;
  QcCode: string;
  QcName: string;
  QcType: string;
  Frequency: number;
  Required: string;
  Remarks: string;
  closeResult: string;
  @ViewChild('content') modelPopup: any;

  submitClicked: boolean;
  get qcName() { return this.qualityControlForm.get('qcName'); }
  get qcType() { return this.qualityControlForm.get('qcType'); }
  get frequency() { return this.qualityControlForm.get('frequency'); }
  get remarks() { return this.qualityControlForm.get('remarks'); }

  constructor(
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private qualityControlService: QualitycontrolService,
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
    {type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];

  ngOnInit(): void {
    this.getAllQCList();
    for (let i = 1; i <= 10; i++) {
      this.frequencyData.push(
        { id: i, value: i }
      )
    }
    this.qcTypes = enumSelector(QCType);
    // console.log(this.qcTypes);
  }

  queryCellInfo(args) { //queryCellInfo event of Grid 
    if (args.cell.classList.contains("e-unboundcell") && args.data.isAssigned === true) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }
  
  public getQCTypeName = (field: string, data: Object, column: Object) => {
    let qctype = QCType;
    return this.splitByUpperCasePipe.transform(qctype[data[field]]);
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

  getAllQCList() {
    this.qualityControlService.getAll().subscribe(result => {
      this.qcData = result;
      // console.log(result);
      this.alreadyUsed = {
        names: result.map(data => data.qcName.toLowerCase()),
        codes: result.map(data => data['qcnUmber'].toLowerCase()) 
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Quality Control details');
      });
  }

  getLastQualityControlId() {
    this.qualityControlService.getLastQualityId().subscribe(result => {
      this.formQCCode = result + 1;
      this.qualityControlForm.controls['qcnUmber'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Quality Code');
      });
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.rowData["isCheckListRequired"] == true) { 
      this.Required = "yes"
    }
    else {
      this.Required = "No"
    }

    let qualitytype = this.splitByUpperCasePipe.transform(QCType[args.rowData["qcType"]]);
    if (args.commandColumn.buttonOption.content == 'View') {
      this.QcCode = args.rowData["qcnUmber"];
      this.QcName = args.rowData["qcName"];
      this.QcType = qualitytype;
      this.Frequency = args.rowData["frequency"];
      this.Required;
      this.Remarks = args.rowData["remarks"];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(qualityControl: any): FormGroup {
    if(qualityControl){
      this.formQCCode = qualityControl.qcnUmber;
    }
    return this.formBuilder.group({
      id: [qualityControl.id == null ? 0 : qualityControl.id],
      qcnUmber: [{value:qualityControl.qcnUmber, disabled:true}, [ 
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]],
      qcName: [qualityControl.qcName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (qualityControl.qcName || '').toLowerCase()))
      ]],
      qcType: [qualityControl.qcType, [
        Validators.required,
      ]],
      frequency: [qualityControl.frequency, [
        Validators.required,
      ]],
      isCheckListRequired: [qualityControl.isCheckListRequired, [
        //Validators.required
      ]],
      remarks: [qualityControl.remarks, [
        Validators.maxLength(128)
      ]]
    });
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
    
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Quality Control'  : 'Add Quality Control';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.qualityControlForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.getLastQualityControlId();
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.qualityControlForm.valid){
        let insertdata = this.qualityControlForm.value;
        if (insertdata.isCheckListRequired === null) {
          insertdata.isCheckListRequired = false;
        }
        insertdata = {
          ...insertdata,
          qcnUmber : this.formQCCode,
          qcType: this.qcTypes.find(y => y.value == insertdata.qcType).value
        };
        if (!(insertdata["id"])) {
          this.qualityControlService.add(insertdata)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Quality Control Master added successfully!');
                this.getAllQCList();
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the Quality Control Master Details');
              }
            );
        }
        else {
          this.qualityControlService.update(insertdata)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Quality Control Master updated successfully!');
                this.getAllQCList();
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the Quality Control Master Details');
              }
            );
        }
      }
      else{
        args.cancel = true;
      }
      
    }
    else if (args.requestType === 'delete' && !args.data[0].isAssigned) {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        this.qualityControlService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Quality Control Master deleted successfully!');
          }
        },
          error => {
            console.error("err", error);
            this.toastr.showErrorMessage('Unable to delete the Quality Control Master Details');
          }
        );
      }
    }
  }
}
