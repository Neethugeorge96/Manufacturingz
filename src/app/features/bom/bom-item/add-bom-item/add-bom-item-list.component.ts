import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BOMItem, MaintainProduction } from '@features/bom/bom.model';
import { BomService } from '@features/bom/bom.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CostPriceComponet } from '@settings/cost-price/cost-price.model';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { enumSelector } from '@shared/utils/common.functions';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ProductionUnit } from 'src/app/models/common/types/productionunit';
@Component({
  selector: 'app-bom-item-list',
  templateUrl: './add-bom-item-list.component.html'
})
export class AddBomItemListComponent implements OnInit {
  bomForm: FormGroup;
  bomHeaderForm: FormGroup;
  bomItem: BOMItem[] = [];
  manufactureditems: any[];
  items: any[];
  uom: any[];
  productUom: any[];
  bOMItemDeletedIds: any[];
  workCenter: WorkCenter[] = [];
  costPriceComponet: CostPriceComponet[] = [];
  maintainProduction: MaintainProduction;
  @ViewChild('Grid') public Grid: GridComponent;
  productionUnitList = enumSelector(ProductionUnit);
  bom: MaintainProduction[] = [];
  closeResult: string;
  @ViewChild('content') modelPopup: any;
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

  
  headerSubmitClicked = false;
  get manufacturedProductCode() { return this.bomHeaderForm.get('manufacturedProductCode'); }
  get productUOMCode() { return this.bomHeaderForm.get('productUOMCode'); }
  get bOMQuantity() { return this.bomHeaderForm.get('bOMQuantity'); }

  workCenterIdReq: boolean;
  submitClicked = false;
  get itemName() { return this.bomForm.get('itemName'); }
  get uOMName() { return this.bomForm.get('uOMName'); }
  get quantity() { return this.bomForm.get('quantity'); }
  get movingWeightedAverageCostPerUnit() { return this.bomForm.get('movingWeightedAverageCostPerUnit'); }
  get latestPurchaseCostPerUnit() { return this.bomForm.get('latestPurchaseCostPerUnit'); }
  get standardCostPerUnitForCostEstimation() { return this.bomForm.get('standardCostPerUnitForCostEstimation'); }
  get priceVarianceProvision() { return this.bomForm.get('priceVarianceProvision'); }
  get cPCName() { return this.bomForm.get('cPCName'); }
  get workcenterName() { return this.bomForm.get('workcenterName'); }
  
  constructor(private bomService: BomService, private toastr: ToasterDisplayService, public costPriceService: CostPriceService,
    private workCentersService: WorkCentersService, private formBuilder: FormBuilder, private router: Router,
    private modalService: NgbModal) { }
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
    this.bomHeaderForm = this.createbomHeaderFormGroup();
    this.getAllBOM();
    this.getAllItem();
    this.getAllUOM();
    this.getAllCostPriceComponent();
    this.getAllWorkCenter();
  }
  createFormGroup(bom: any): FormGroup {
    return this.formBuilder.group({
      id: [bom.id == null ? 0 : bom.id],
      itemCode: [bom.itemCode, [
        Validators.required
      ]],
      itemName: [bom.itemName, [
        Validators.required
      ]],
      uOMCode: [bom.uOMCode, [
        Validators.required
      ]],
      uOMName: [bom.uOMName, [
        Validators.required
      ]],
      cPCCode: [bom.cPCCode, [
        Validators.required
      ]],
      cPCName: [bom.cPCName, [
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
       // Validators.pattern(/^\d+\.\d{2}$/)
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
      isLotTrackingRequired: [bom.isLotTrackingRequired ],
      isMaterialIssueByBackflushing: [bom.isMaterialIssueByBackflushing],
      manufacturedProductCode: [this.bomHeaderForm.value.manufacturedProductCode]
    });
  }
  createbomHeaderFormGroup(): FormGroup {
    return this.formBuilder.group({
      manufacturedProductCode: ['', [
        Validators.required,
      ]],
      manufacturedProduct: ['', []],
      productUOMCode: ['', [
        Validators.required
      ]],
      ProductUOMName: ['', []],
      bOMQuantity: [null, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999)
      ]],
    });
  }
  getAllBOM() {
    this.bomService.getAll().subscribe(result => {
      this.bom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the BOM details');
      });
  }
  getAllCostPriceComponent() {
    this.costPriceService.getAll().subscribe(result => {
      this.costPriceComponet = result;
      this.costPriceComponet = result.filter(x => x.cpcType === 2);
      // console.log("cpc", this.costPriceComponet);
      
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the cost price component details');
      });
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
  Change(evt) {
    if (evt.checked) {
      this.bomForm.controls.workcenterName.enable();
      this.workCenterIdReq = true;
    } else {
      this.bomForm.controls.workcenterName.disable();
      this.workCenterIdReq = false;
      this.bomForm.controls.workcenterName.setValue(null);

    }
  }

  onChangeProductUnit(evt) {
    this.bomHeaderForm.patchValue({ ProductUOMName: evt.itemData.uomName });
  }
  onChangeProductCode(evt) {
    if (evt.itemData !== null) {
      const itemcode = this.bom.find((x) => x.manufacturedProductCode === evt.itemData.itemCode);
      if (itemcode) {
        this.bomHeaderForm.patchValue({ manufacturedProductCode: null });
        this.toastr.showErrorMessage('Duplicate Product Name is not allowed');
      } else {
        this.bomHeaderForm.patchValue({ manufacturedProduct: evt.itemData.itemName });
      }
    }
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
  saveBOM() {
    this.headerSubmitClicked = true;
    if (this.bomHeaderForm.valid && this.bomItem.length) {
      this.maintainProduction = new MaintainProduction();
      this.maintainProduction.manufacturedProductCode = this.bomHeaderForm.value.manufacturedProductCode;
      this.maintainProduction.manufacturedProduct = this.bomHeaderForm.value.manufacturedProduct;
      this.maintainProduction.productUOMCode = this.bomHeaderForm.value.productUOMCode;
      this.maintainProduction.ProductUOMName = this.bomHeaderForm.value.ProductUOMName;
      this.maintainProduction.bOMQuantity = this.bomHeaderForm.value.bOMQuantity;
      if (this.bomItem.length != 0) {
        this.maintainProduction.bOMItems =this.Grid.getCurrentViewRecords();
      }
      this.maintainProduction.bOMItemDeletedList = [];   
      let cpcIds = [];
      this.bomItem.forEach(x => {
        cpcIds.push(this.costPriceComponet.filter(y => y.cpcCode === x.cPCCode)[0].id)
      })
      
        this.bomService.add(this.maintainProduction)
        .subscribe(res => {
          if (res) {
            this.headerSubmitClicked = false;
            this.toastr.showSuccessMessage('BOM Item added successfully!');
            this.router.navigate(['/bom/maintain-bom-list']);
            this.costPriceService.updateCpcIsAssigned(cpcIds).subscribe(res => {
            },error => console.error("updateCpcIsAssigned API error",error))
         }
        });
    
     
    }
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit BOM Item' : 'Add BOM Item';
       if (args.dialog) {
        let btnObj = (args.dialog as any).btnObj[0];
  
        btnObj.disabled = !this.bomForm.valid;
        // console.log( btnObj.disabled);
        
        this.bomForm.statusChanges.subscribe((e) => {
          e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true;
        });
       }
      

    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.bomForm = this.createFormGroup(args.rowData);
      this.bomForm.controls.workcenterName.disable();
      this.workCenterIdReq = false;
    }
  
    if (args.requestType === 'save') {
      //this.submitClicked = true;
      // console.log( this.submitClicked);
      // console.log(this.materialItemDetailsForm.value);
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
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content == 'View') {
      this.itemNameView = args.rowData['itemName'];
      this.uOMNameView = args.rowData['uOMName'];
      this.cPCNameView = args.rowData['cPCName'];
      this.quantityView = args.rowData['quantity'];
      this.latestPurchaseCostPerUnitView = args.rowData['latestPurchaseCostPerUnit'];
      this.movingWeightedAverageCostPerUnitView = args.rowData['movingWeightedAverageCostPerUnit'];
      this.standardCostPerUnitForCostEstimationView = args.rowData['standardCostPerUnitForCostEstimation'];
      this.priceVarianceProvisionView = args.rowData['priceVarianceProvision'];
      this.isMaterialIssueLinkToWorkcenter = args.rowData['isMaterialIssueLinkToWorkcenter'] == true ? 'Yes' : 'No';
      this.workCenterName = args.rowData['workcenterName'];
      this.isLotTrackingRequired = args.rowData['isLotTrackingRequired'] == true ? 'Yes' : 'No';
      this.isMaterialIssueByBackflushing = args.rowData['isMaterialIssueByBackflushing'] == true ? 'Yes' : 'No';
      this.open(this.modelPopup);
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
    this.bomForm.patchValue({ uOMCode: evt.itemData.uomCode });
  }
  onChangeCPC(evt) {
    this.bomForm.patchValue({ cPCCode: evt.itemData.cpcCode });
  }
  onChangeWorkCenter(evt) {
    this.bomForm.patchValue({ workcenterCode: evt.itemData.workcenterCode });
  }

}


