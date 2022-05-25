import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { BatchControlService } from '../batch-control.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { ColumnModel } from '@syncfusion/ej2-angular-grids';
import { BatchSize } from '../batch-control.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductionLineService } from '@settings/production-line/production-line.service';
import { ProductionLine } from '@settings/production-line/production-line.model';

@Component({
  selector: 'app-batch-control',
  templateUrl: './batch-control.component.html',

})
export class BatchControlComponent implements OnInit {

  batchControlForm: FormGroup;
  batchData: BatchSize[] = [];
  batchItemList: any[];
  batchSizeUnit: any[];
  public batchSizeMin: ColumnModel[];
  public batchSizeMax: ColumnModel[];
  batchCode: string;
  itemName: string;
  SizeMin: number;
  SizeMax: number;
  uom: string;
  productName: string;
  Remarks: string;
  closeResult: string;
  productionLines: ProductionLine[] = [];
 // productionLineCode: string;
  fieldDisable: boolean;
  batchOutputrequired: string;

  formBatchConyrolCode: number;

  @ViewChild('content') modelPopup: any;

  alreadyUsed: { codes: string[]; } = {

    codes: []
  };

  submitClicked: boolean;
  get itemCode() { return this.batchControlForm.get('itemCode'); }
  get batchSizeMinQuantity() { return this.batchControlForm.get('batchSizeMinQuantity'); }
  get batchSizeMaxQuantity() { return this.batchControlForm.get('batchSizeMaxQuantity'); }
  get productionLineCode() { return this.batchControlForm.get('productionLineCode'); }
  get remarks() { return this.batchControlForm.get('remarks'); }
  
  constructor(
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    private batchService: BatchControlService,
    private modalService: NgbModal,
    private productionLineService: ProductionLineService,
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
    this.getAllBatchList();
    this.getAllItem();
    this.getAllUOM();
    this.getProductionLines();

    this.batchSizeMin = [
      {
        field: 'uom',
        headerText: 'UOM',
        // width: 80,
        textAlign: 'Left',
        // minWidth: 10
      },
      {
        field: 'batchSizeMinQuantity',
        headerText: 'Qty',
        // width: 60,

        textAlign: 'Left',
        // minWidth: 10
      }
    ];
    this.batchSizeMax = [
      {
        field: 'uom',
        headerText: 'UOM',
        // width: 80,
        // minWidth: 10
      },
      {
        field: 'batchSizeMaxQuantity',
        headerText: 'Qty',
        // width: 60,
        // minWidth: 10
      }
    ];
  }

  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
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
    let viewData = args.rowData;
    let uomName = this.batchSizeUnit.find(x => x.uomCode === viewData['uom']).uomName
    if (args.rowData["isBatchOutputRequired"] == true) {
      this.batchOutputrequired = "Yes"
    }
    else {
      this.batchOutputrequired = "No"
    }
    if (args.commandColumn.buttonOption.content == 'View') {
      this.batchCode = args.rowData["batchCode"];
      this.itemName = args.rowData["itemName"];
      this.SizeMin = args.rowData["batchSizeMinQuantity"];
      this.SizeMax = args.rowData["batchSizeMaxQuantity"];
      this.uom = uomName
      this.batchOutputrequired;
      this.Remarks = args.rowData["remarks"];
      this.productName = args.rowData["productionLineName"];
      this.open(this.modelPopup);
    }
    if (args.commandColumn.type == 'Edit') {
      this.fieldDisable = true;
    }
  }

  getAllBatchList() {
    this.batchService.getAll().subscribe(result => {
      this.batchData = result;

      this.alreadyUsed = {
        codes: result.map(data => data.batchCode.toLowerCase())
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Batch details');
      });
  }

  getProductionLines() {
    this.productionLineService.getAll().subscribe(result => {
      this.productionLines = result;

    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Production Line Details');
      });
  }

  createFormGroup(batch: any): FormGroup {
    if (batch) {
      this.formBatchConyrolCode = batch.batchCode;
    }
    return this.formBuilder.group({
      id: [batch.id == null ? 0 : batch.id],
      batchCode: [{ value: batch.batchCode, disabled: true }, , [
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]],
      itemCode: [batch.itemCode, [
        Validators.required
      ]],
      productionLineCode: [batch.productionLineCode, [ 
        Validators.required,
       // Validators.maxLength(4)
      ]],
      uom: [batch.uom, [
        //Validators.required
      ]],
      uom2: [batch.uom, [
        //Validators.required
      ]],
      batchSizeMinQuantity: [batch.batchSizeMinQuantity, [
        Validators.pattern('^[0-9]{0,10}$'),
        Validators.required,
      ]],
      batchSizeMaxQuantity: [batch.batchSizeMaxQuantity, [
        Validators.pattern('^[0-9]{0,10}$'),
        Validators.required
      ]],
      isBatchOutputRequired: [batch.isBatchOutputRequired, [
       // Validators.required
      ]],
      remarks: [batch.remarks, [
        Validators.maxLength(128)
      ]]
    });
  }

  getAllItem() {
    this.batchService.getAllItem().subscribe(result => {
      this.batchItemList = result.filter(x => x.itemTypeName == "Manufactured");
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the item details');
      });
  }

  getAllUOM() {
    this.batchService.getAllUOM().subscribe(result => {
      this.batchSizeUnit = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }

  getLastBatchcontrolId() {
    this.batchService.getLastBatchId().subscribe(result => {
      this.formBatchConyrolCode = result + 1;
      this.batchControlForm.controls['batchCode'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }

  getUom(event) {
    this.checkDuplication(event, 'item');
    let itemNameId = event.itemData.id;
    this.batchService.getUom(itemNameId).subscribe((result: any) => {
      this.batchControlForm.controls['uom'].setValue(result.baseUomCode);
      this.batchControlForm.controls['uom2'].setValue(result.baseUomCode);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch UOM Details'); 
      });
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Batch Size' : 'Add Batch Size';
    }
  }


  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.batchControlForm = this.createFormGroup(args.rowData);
      if (args.requestType === 'add') {
        this.submitClicked= false;
        this.fieldDisable = false;
        this.getLastBatchcontrolId();
      }
      this.batchControlForm.get('uom').valueChanges.subscribe(res => {
        if (res) {
          this.batchControlForm.patchValue({ uom2: res }, { emitEvent: false })
        }
        if (res) {
          this.batchControlForm.patchValue({ uom: res }, { emitEvent: false })
        }
      })
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.batchControlForm.valid){
        let insertdata = this.batchControlForm.getRawValue();
      if (insertdata.isBatchOutputRequired === null) {
        insertdata.isBatchOutputRequired = false;
      }
      insertdata = {
        ...insertdata,
        batchCode: this.formBatchConyrolCode,
        // itemCode: this.batchItemList.find(x => x.id == insertdata.itemCode).itemCode,
        itemName: this.batchItemList.find(x => x.itemCode == insertdata.itemCode).itemName,
        uOM: this.batchSizeUnit.find(x => x.uomCode == insertdata.uom).uomCode,
        // uOMName: this.batchSizeUnit.find(x => x.uomCode == insertdata.uom).uomName,
        productionLineName: this.productionLines.find(x => x.productionLineCode === insertdata.productionLineCode).productionLineName,
        productionLineId: this.productionLines.find(x => x.productionLineCode === insertdata.productionLineCode).id
      };

      if (!(insertdata["id"])) {
        this.batchService.add(insertdata)
          .subscribe(res => {
            //const plant = this.plantId.find(x=>x.id == addWorkcenter.plantId)
            if (res) {
              this.toastr.showSuccessMessage('Batch Size Master added successfully!');
              this.getAllBatchList();

              let proLine = this.productionLines.find(x => x.id === insertdata.productionLineId)
              proLine.isAssigned = true;
              this.productionLineService.update(proLine).subscribe(res => {
              })
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the Batch Size Master Details');
            }
          );
      }
      else {
        this.batchService.update(insertdata)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Batch Size Master updated successfully!');
              this.getAllBatchList();
              let proLine = this.productionLines.find(x => x.id === insertdata.productionLineId)
              proLine.isAssigned = true;
              this.productionLineService.update(proLine).subscribe(res => {

              })
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the Batch Size Master Details');
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
        this.batchService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Batch Size Master deleted successfully!');
          }
        },
          error => {
            console.error("err", error);
            this.toastr.showErrorMessage('Unable to delete the Batch Size Master Details');
          }
        );

      }
    }
  }

  checkDuplication(event, source) {
    if (source === 'item') {
      if (this.batchControlForm.controls.productionLineCode.value) {
        let prodLineControl = this.batchControlForm.controls.productionLineCode.value;

        if (this.batchData.find(x => x.itemCode === event.itemData.itemCode && x.productionLineCode === prodLineControl)) {
          this.toastr.showErrorMessage('Duplicate Batch Control');
          this.batchControlForm.controls['itemCode'].setValue(null);
        }

      }
    }

    if (source === 'production') {
      if (this.batchControlForm.controls.itemCode.value) {
        let itemcontrol = this.batchControlForm.controls.itemCode.value;
        if (this.batchData.find(x => x.productionLineCode === event.itemData.productionLineCode && x.itemCode === itemcontrol)) {
          this.toastr.showErrorMessage('Duplicate batch Control');
          this.batchControlForm.controls['productionLineCode'].setValue(null);
        }
      }
    }
  }

  checkUOMQuantity(source) {
    let maxVal = this.batchControlForm.controls['batchSizeMaxQuantity'].value;
    let minVal = this.batchControlForm.controls['batchSizeMinQuantity'].value;
    if (source === 'minQuan') {
      if (maxVal) {
        if (minVal >= maxVal) {
          this.toastr.showErrorMessage('Minimun Quantity should be less than Maximum Quantity');
          this.batchControlForm.controls['batchSizeMinQuantity'].setValue(null);
        }
      }
    }
    if (source === 'maxQuan') {
      if (minVal) {
        if (maxVal <= minVal) {
          this.toastr.showErrorMessage('Maximum Quantity should be greater than Minimun Quantity');
          this.batchControlForm.controls['batchSizeMaxQuantity'].setValue(null);
        }
      }
    }
  }

}
