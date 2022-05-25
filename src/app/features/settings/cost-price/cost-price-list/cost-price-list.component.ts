import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { CPCType } from 'src/app/models/common/types/costpricecomponent';
import { CostPriceComponet } from '../cost-price.model';
import { CostPriceService } from '../cost-price.service';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { enumSelector } from '@shared/utils/common.functions';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';
import { trim } from 'lodash';

@Component({
  selector: 'app-cost-price-list',
  templateUrl: './cost-price-list.component.html',
})

export class CostPriceListComponent implements OnInit {

  costPriceComponet: CostPriceComponet[] = [];
  cpcTypes = enumSelector(CPCType);
  formCPCCode: number;
  cpcCode: string;
  cpcTypeName: string;
  description: string;
  isAssigned: boolean;
  @ViewChild('content') modelPopup: any;
  closeResult: string;
  cpcForm: FormGroup;
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };

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

  submitClicked: boolean;
  dataForView: any;
  get cpcName() { return this.cpcForm.get('cpcName'); }
  get cpcType() { return this.cpcForm.get('cpcType'); }


  constructor(
    public modalService: NgbModal,
    public costPriceService: CostPriceService,
    private toastr: ToasterDisplayService,
    public splitByUpperCasePipe: SplitByUpperCasePipe,
  ) { }

  ngOnInit(): void {
    this.getAllCostPriceComponent();
    this.cpcTypes = enumSelector(CPCType);
    // console.log(this.cpcTypes);

  }

  queryCellInfo(args) {
    if (args.cell.classList.contains("e-unboundcell") && args.data.isAssigned === true) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }

  public getCpcTypeName = (field: string, data: Object, column: Object) => {
    let cpctype = CPCType;
    // return cpctype[data[field]];

    return this.splitByUpperCasePipe.transform(cpctype[data[field]]);
  }

  getAllCostPriceComponent() {
    this.costPriceService.getAll().subscribe(result => {
      this.costPriceComponet = result;
      this.alreadyUsed = {
        names: result.map(data => data.cpcName.toLowerCase()),
        codes: result.map(data => data.cpcCode.toLowerCase())
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the cost price component details');
      });
  }

  getLastCPCId() {
    this.costPriceService.getLastCPCId().subscribe(result => {
      this.formCPCCode = result + 1;
      this.cpcForm.controls['cpcCode'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the CPC Code');
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
      this.cpcCode = args.rowData["cpcCode"];
      this.cpcTypeName = this.cpcTypes.find(x => x.value == args.rowData["cpcType"]).text;
      this.description = args.rowData["description"];
      this.dataForView = args.rowData;
      this.open(this.modelPopup);
    }
  }

  actionComplete(args) {
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Cost Price Component' : 'Add Cost Price Component';
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.cpcForm = this.createFormGroup(args.rowData);
      console.log(this.cpcTypes);
    }
    if (args.requestType === 'add') {
      this.getLastCPCId();
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.cpcForm.valid) {
        let _insertdata = this.cpcForm.value;
        _insertdata = {
          ..._insertdata,
          cpcCode: this.formCPCCode,
          cpcType: this.cpcTypes.find(y => y.value == _insertdata.cpcType).text
        };

        if (_insertdata.cpcType) {
          _insertdata.cpcType = _insertdata.cpcType.trim().split(' ').join('');
        }

        if (!(_insertdata["id"])) {
          this.costPriceService.add(_insertdata)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Cost price component updated successfully!');
                this.getAllCostPriceComponent();
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to update the Cost price component Details');
              }
            );
        }
        else {
          this.costPriceService.update(_insertdata)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Cost price component updated successfully!');
                this.getAllCostPriceComponent();

              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to update the Cost price component Details');
              }
            );
        }
      } else {
        args.cancel = true;
      }
    }
    else if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        if (row.data[0].isAssigned === false) {
          this.costPriceService.delete(id).subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Cost price component deleted successfully!');
              this.getAllCostPriceComponent();
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to update the Cost price component Details');
            }
          );
        }

      }
    }
  }

  createFormGroup(cost: any): FormGroup {
    if (cost) {
      this.formCPCCode = cost.cpcCode;
    }

    return new FormGroup({
      id: new FormControl(cost.id == null ? 0 : cost.id),
      cpcCode: new FormControl({ value: cost.cpcCode, disabled: true }, [
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]),
      cpcType: new FormControl(
        cost.cpcType, [
        Validators.required
      ]),
      cpcName: new FormControl(cost.cpcName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (cost.cpcName || '').toLowerCase()))
      ]),
      description: new FormControl(cost.description, [
        Validators.maxLength(125)
      ]),
      isAssigned: new FormControl(false)
    });
  }
}
