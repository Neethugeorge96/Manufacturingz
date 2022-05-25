import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BOMItem, MaintainProduction } from '@features/bom/bom.model';
import { BomService } from '@features/bom/bom.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostPriceComponet } from '@settings/cost-price/cost-price.model';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';

@Component({
  selector: 'app-edit-bom-item',
  templateUrl: './edit-bom-item.component.html'
})
export class EditBomItemComponent implements OnInit {
  bomForm: FormGroup;
  bomHeaderForm: FormGroup;
  bomItem: BOMItem[] = [];
  manufactureditems: any[];
  items: any[];
  uom: any[];
  productUom: any[];
  bOMItemDeletedIds: any[] = [];
  workCenter: WorkCenter[];
  costPriceComponet: CostPriceComponet[];
  maintainProduction: MaintainProduction;
  manufacturedProductId: string;
  @ViewChild('Grid') public Grid: GridComponent;
  bomId: number;
  bomeditData: any;
  itemNameView: string;
  uOMNameView: string;
  cPCNameView: string;
  quantityView: number;
  movingWeightedAverageCostPerUnitView: number;
  latestPurchaseCostPerUnitView: number;
  standardCostPerUnitForCostEstimationView: number;
  priceVarianceProvisionView: number;
  isMaterialIssueLinkToWorkcenter: string;
  workCenterName: string;
  isLotTrackingRequired: string;
  isMaterialIssueByBackflushing: string;
  closeResult: string;
  @ViewChild('content') modelPopup: any;

 
  headerSubmitClicked = false;
  get manufacturedProductCode() { return this.bomHeaderForm.get('manufacturedProductCode'); }
  get productUOMCode() { return this.bomHeaderForm.get('productUOMCode'); }
  get bOMQuantity() { return this.bomHeaderForm.get('bOMQuantity'); }
  workCenterIdReq: boolean;
  submitClicked = false; 
  get itemName() { return this.bomForm.get('itemName'); }
  get uOMName() { return this.bomForm.get('uomName'); }
  get quantity() { return this.bomForm.get('quantity'); }
  get movingWeightedAverageCostPerUnit() { return this.bomForm.get('movingWeightedAverageCostPerUnit'); }
  get latestPurchaseCostPerUnit() { return this.bomForm.get('latestPurchaseCostPerUnit'); }
  get standardCostPerUnitForCostEstimation() { return this.bomForm.get('standardCostPerUnitForCostEstimation'); }
  get priceVarianceProvision() { return this.bomForm.get('priceVarianceProvision'); }
  get cPCName() { return this.bomForm.get('cpcName'); }
  get workcenterName() { return this.bomForm.get('workcenterName'); }

  constructor(private bomService: BomService, private toastr: ToasterDisplayService, public costPriceService: CostPriceService,
              private workCentersService: WorkCentersService, private formBuilder: FormBuilder, private router: Router,
              private modalService: NgbModal, private route: ActivatedRoute) {
    this.bomId = this.route.snapshot.params.id;
  }

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
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];


  ngOnInit(): void {
    this.toolbar = ['Add', 'Search'];
    this.getAllItem();
    this.getAllUOM();
    this.getAllCostPriceComponent();
    this.getAllWorkCenter();
    this.bomHeaderForm = this.createbomHeaderFormGroup();
    if (this.bomId != null && this.bomId != undefined) {
      this.bomService.GetBOMItems(this.bomId).subscribe(result => {
        this.bomeditData = result;
        this.bomHeaderForm.patchValue({ bOMQuantity: this.bomeditData[0].bomQuantity });
        if (result[0].bomItems.length != 0) {
          if (result[0].bomItems[0] == null) {
            this.bomItem = [];
          } else {
            this.bomItem = result[0].bomItems;
          }
        }

      },
        error => {
          console.error(error);
          this.toastr.showErrorMessage('Unable to fetch the BOM item details');
        });
    }

  }
  dataBoundProduct() {
    if (this.bomeditData != undefined) {
      this.bomHeaderForm.patchValue({ manufacturedProductCode: this.bomeditData[0].manufacturedProductCode });
    }
  }
  dataBoundUOM() {
    if (this.bomeditData != undefined) {
      this.bomHeaderForm.patchValue({ productUOMCode: this.bomeditData[0].productUOMCode });
    }
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
  createbomHeaderFormGroup(): FormGroup {
    return this.formBuilder.group({
      manufacturedProductCode: ['', [
        Validators.required
      ]],
      manufacturedProduct: ['', [
        Validators.required
      ]],
      productUOMCode: ['', [
        Validators.required
      ]],
      ProductUOMName: ['', [
        Validators.required
      ]],
      bOMQuantity: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999)
      ]],
    });
  }
  createFormGroup(bom: any): FormGroup {
    return this.formBuilder.group({
      id: [bom.id == null ? 0 : bom.id],
      itemCode: [bom.itemCode],
      itemName: [bom.itemName, [
        Validators.required
      ]],
      uomCode: [bom.uomCode, [
        // Validators.required
      ]],
      uomName: [bom.uomName, [
        Validators.required
      ]],
      cpcCode: [bom.cpcCode, [
        Validators.required
      ]],
      cpcName: [bom.cpcName, [
        Validators.required
      ]],
      quantity: [bom.quantity, [
        Validators.required,
         Validators.min(1),
         Validators.max(999999)
      ]],
      movingWeightedAverageCostPerUnit: [bom.movingWeightedAverageCostPerUnit, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999)
      ]],
      latestPurchaseCostPerUnit: [bom.latestPurchaseCostPerUnit, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999)
      ]],
      standardCostPerUnitForCostEstimation: [bom.standardCostPerUnitForCostEstimation, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999)
      ]],
      priceVarianceProvision: [bom.priceVarianceProvision, [
        Validators.required,
        Validators.max(100)
      ]],
      isMaterialIssueLinkToWorkcenter: [bom.isMaterialIssueLinkToWorkcenter],
      workcenterCode: [bom.workcenterCode, [
      
      ]],
      workcenterName: [bom.workcenterName, [
       
      ]],
      isLotTrackingRequired: [bom.isLotTrackingRequired],
      isMaterialIssueByBackflushing: [bom.isMaterialIssueByBackflushing],
      manufacturedProductCode: [this.bomHeaderForm.value.manufacturedProductCode]
    });
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.type == 'Delete') {
      this.bOMItemDeletedIds.push(args.rowData['id']);
    }
    if (args.commandColumn.buttonOption.content == 'View') {
      this.itemNameView = args.rowData["itemName"];
      this.uOMNameView = args.rowData["uomName"];
      this.cPCNameView = args.rowData["cpcName"];
      this.quantityView = args.rowData["quantity"];
      this.latestPurchaseCostPerUnitView = args.rowData["latestPurchaseCostPerUnit"];
      this.movingWeightedAverageCostPerUnitView = args.rowData["movingWeightedAverageCostPerUnit"];
      this.standardCostPerUnitForCostEstimationView = args.rowData["standardCostPerUnitForCostEstimation"];
      this.priceVarianceProvisionView = args.rowData["priceVarianceProvision"];
      this.isMaterialIssueLinkToWorkcenter = args.rowData["isMaterialIssueLinkToWorkcenter"] == true ? "Yes" : "No";
      this.workCenterName = args.rowData["workcenterName"];
      this.isLotTrackingRequired = args.rowData["isLotTrackingRequired"] == true ? "Yes" : "No";
      this.isMaterialIssueByBackflushing = args.rowData["isMaterialIssueByBackflushing"] == true ? "Yes" : "No";
      this.open(this.modelPopup);
    }
  }
  getAllCostPriceComponent() {
    this.costPriceService.getAll().subscribe(result => {
      this.costPriceComponet = result;
      this.costPriceComponet = result.filter(x => x.cpcType === 2);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the cost price component details');
      });
  }
  onChangeProductUnit(evt) {
    this.bomHeaderForm.controls.ProductUOMName.setValue(evt.itemData.uomName);
  }
  onChangeProductCode(evt) {
    this.bomHeaderForm.controls.manufacturedProduct.setValue(evt.itemData.itemName);
  }
  getAllWorkCenter() {
    this.workCentersService.getAll().subscribe(result => {
      this.workCenter = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the workcenter details');
      });
  }
  getAllItem() {
    this.bomService.getAllItem().subscribe(result => {
      if (result.length != 0) {
        this.manufactureditems = result.filter(x => x.itemType == 'Manufactured');
        this.items = result.filter(x => x.itemType != 'Manufactured');
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the item details');
      });
  }
  getAllUOM() {
    this.bomService.getAllUOM().subscribe(result => {
      this.uom = this.productUom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }
  updateBOM() {
    this.headerSubmitClicked = true;
    if (this.bomHeaderForm.valid && this.bomItem.length) {
      this.maintainProduction = new MaintainProduction();
      this.maintainProduction.id = this.bomId;
      this.maintainProduction.manufacturedProductCode = this.bomHeaderForm.value.manufacturedProductCode;
      this.maintainProduction.manufacturedProduct = this.bomHeaderForm.value.manufacturedProduct;
      this.maintainProduction.productUOMCode = this.bomHeaderForm.value.productUOMCode;
      this.maintainProduction.ProductUOMName = this.bomHeaderForm.value.ProductUOMName;
      this.maintainProduction.bOMQuantity = this.bomHeaderForm.value.bOMQuantity;
      if (this.bomItem.length != 0) {
        this.maintainProduction.bOMItems = this.Grid.getCurrentViewRecords();
      }
      if (this.bOMItemDeletedIds.length != 0) {
        this.maintainProduction.bOMItemDeletedList = this.bOMItemDeletedIds;
      }
      

      let cpcIds = [];
      this.bomItem.forEach(x => {
        cpcIds.push(this.costPriceComponet.filter(y => y.cpcCode === x['cpcCode'])[0].id)
      })
     
      this.bomService.update(this.maintainProduction)
        .subscribe(res => {
          if (res) {
            this.headerSubmitClicked = false;
            this.toastr.showSuccessMessage('BOM Item updated successfully!');
            this.router.navigate(['/bom/maintain-bom-list']);
            this.costPriceService.updateCpcIsAssigned(cpcIds).subscribe(res => {
            },error => console.error("updateCpcIsAssigned API error",error))
          }
        });
    }
  }
  Change(evt) {
    if (evt.checked) {
      this.bomForm.controls['workcenterName'].enable();
      this.workCenterIdReq = true;
    }
    else {
      this.bomForm.controls['workcenterName'].disable();
      this.workCenterIdReq = false;
      this.bomForm.controls.workcenterName.setValue(null);
    }
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit  BOM Item' : 'Add BOM Item';
    }
    if (args.dialog) {
      let btnObj = (args.dialog as any).btnObj[0];

      btnObj.disabled = !this.bomForm.valid;
      // console.log( btnObj.disabled);
      
      this.bomForm.statusChanges.subscribe((e) => {
        e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true;
      });
     }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.bomForm = this.createFormGroup(args.rowData);
      if(args.requestType === 'add'){
        this.bomForm.controls['workcenterName'].disable();
        this.workCenterIdReq = false;
      }
      if(args.requestType === 'beginEdit'){
        if(this.bomForm.controls['isMaterialIssueLinkToWorkcenter'].value){
          this.bomForm.controls['workcenterName'].enable();
          this.workCenterIdReq = true;
        }else{
          this.bomForm.controls['workcenterName'].disable();
          this.workCenterIdReq = false;
        }
      }
    }
   
  }

  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({ content: toolcontent });
    tooltip.appendTo(args.node);
  }
  onChangeItem(evt) {
    this.bomForm.patchValue({ itemCode: evt.itemData.itemCode });
  }
  onChangeUOM(evt) {
    this.bomForm.patchValue({ uomCode: evt.itemData.uomCode });
  }
  onChangeCPC(evt) {
    this.bomForm.patchValue({ cpcCode: evt.itemData.cpcCode });
  }
  onChangeWorkCenter(evt) {
    this.bomForm.patchValue({ workcenterCode: evt.itemData.workcenterCode });
  }

}


