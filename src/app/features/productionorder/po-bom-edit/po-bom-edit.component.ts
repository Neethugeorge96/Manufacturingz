import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Query, Predicate } from '@syncfusion/ej2-data';

import { BomService } from '@features/bom/bom.service';
import { CostPriceComponet } from '@settings/cost-price/cost-price.model';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { EditSettingsModel, ToolbarItems, CommandModel, SaveEventArgs, GridComponent, DialogEditEventArgs, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { forkJoin } from 'rxjs';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { POBillOfMaterialService } from '../po-bill-of-material.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-po-bom-edit',
  templateUrl: './po-bom-edit.component.html',
  styles: [
  ]
})
export class POBomEditComponent implements OnInit {
  batches = [];
  batch = null;
  boms: any[] = [];
  bomSelected: any;
  @Input() productionOrder;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  mappedList = [];
  defaultBomList = [];
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('content') modelPopup: any;
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  costPrices: CostPriceComponet[];
  workCenters: WorkCenter[];
  products: any[];
  uoms: any[];
  bomForm: FormGroup;
  bomForBatch: any;
  productsInList: any[];
  bomItemForView: any;

  submitClicked: boolean;
  workCenterIdReq: boolean;
  workCenterName: WorkCenter;

  get itemCode() { return this.bomForm.get('itemCode'); }
  get uomCode() { return this.bomForm.get('uomCode'); }
  get quantity() { return this.bomForm.get('quantity'); }
  get movingWeightedAverageCostPerUnit() { return this.bomForm.get('movingWeightedAverageCostPerUnit'); }
  get latestPurchaseCostPerUnit() { return this.bomForm.get('latestPurchaseCostPerUnit'); }
  get standardCostPerUnitForCostEstimation() { return this.bomForm.get('standardCostPerUnitForCostEstimation'); }
  get priceVarianceProvision() { return this.bomForm.get('priceVarianceProvision'); }
  get cpcCode() { return this.bomForm.get('cpcCode'); }
  get workcenterId() { return this.bomForm.get('workcenterId'); }

  constructor(
    private bomService: BomService,
    private toastr: ToasterDisplayService,
    public costPriceService: CostPriceService,
    private workCentersService: WorkCentersService,
    private pOBillOfMaterialService: POBillOfMaterialService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getDropDownLists();
    this.bomService.getByItemCode(this.productionOrder.productionCode).subscribe(res => {
      this.boms = res;
      if (this.boms.length) {

        this.bomSelected = this.boms[0];
        this.defaultBomList = this.bomSelected.bomItems;
      }

      // this.bomSelected = this.boms.find(bom => bom.manufacturedProductCode === this.productionOrder.productionItem);
    });
    for (let step = 1; step <= this.productionOrder.batchSize; step++) {
      this.batches = [...this.batches, { text: `Batch ${step}`, value: step }];
    }
  }
  getDropDownLists() {
    forkJoin([
      this.costPriceService.getAll(),
      this.workCentersService.getAll(),
      this.bomService.getAllItem(),
      this.bomService.getAllUOM()
    ]).subscribe(([costPrices, workCenters, products, uoms]) => {
      this.costPrices = costPrices.filter(x => x.cpcType === 2);
      this.workCenters = workCenters;
      this.products = this.productsInList = products;
      this.uoms = uoms;
    });
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
      uomCode: [bom.uomCode, [
        Validators.required
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
        Validators.max(100000)
      ]],
      manufacturedProductCode: [this.productionOrder.productionCode],
      movingWeightedAverageCostPerUnit: [bom.movingWeightedAverageCostPerUnit, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      latestPurchaseCostPerUnit: [bom.latestPurchaseCostPerUnit, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      standardCostPerUnitForCostEstimation: [bom.standardCostPerUnitForCostEstimation, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      priceVarianceProvision: [bom.priceVarianceProvision, [
        Validators.required,
        Validators.max(100)
      ]],
      isMaterialIssueLinkToWorkcenter: [bom.isMaterialIssueLinkToWorkcenter || false],
      workcenterId: [{ value: bom.workcenterId, disabled: bom.isMaterialIssueLinkToWorkcenter ? false : true }],
      workcenterCode: [bom.workcenterCode],
      workcenterName: [bom.workcenterName],
      isLotTrackingRequired: [bom.isLotTrackingRequired || false],
      isMaterialIssueByBackflushing: [bom.isMaterialIssueByBackflushing || false],
    });
  }
  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'save') {
      // this.grid.updateRow(args.rowIndex, this.bomForm.value);
    }
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit BOM ' : 'Add BOM';
    }

  }
  previous() {
    this.completed.emit(1);
  }
  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
        const closeResult = `Closed with: ${result}`;
      }, () => { });
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content === 'View') {
      this.bomItemForView = args.rowData;
      console.log(this.bomItemForView)
      this.open(this.modelPopup);
    }
  }
  onItemSelection(e: FilteringEventArgs) {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('itemName', 'contains', e.text, true).or('itemCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.productsInList, query);
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.bomForm = this.createFormGroup(args.rowData);

      this.bomForm.valueChanges.subscribe(res => {
        const item = this.products.find(product => product.itemCode === res.itemCode);
        const uomSelected = this.uoms.find(uom => uom.uomCode === res.uomCode);
        const cpc = this.costPrices.find(costPrice => costPrice.cpcCode === res.cpcCode);
        const workCenter = this.workCenters.find(center => center.id === res.workcenterId);
        if (res.isMaterialIssueLinkToWorkcenter) {
          this.bomForm.get('workcenterId').enable({ emitEvent: false });
          this.bomForm.get('workcenterId').setValidators(Validators.required);
          this.bomForm.get('workcenterId').updateValueAndValidity({ emitEvent: false });
        } else {
          this.bomForm.get('workcenterId').disable({ emitEvent: false });
          this.bomForm.get('workcenterId').clearValidators();
          this.bomForm.get('workcenterId').updateValueAndValidity({ emitEvent: false });
        }
        this.bomForm.patchValue({
          itemName: item ? item.itemName : '',
          itemCode: item ? item.itemCode : '',
          uomName: uomSelected ? uomSelected.uomName : '',
          cpcName: cpc ? cpc.cpcName : '',
          workcenterName: workCenter ? workCenter.workCenterName : '',
          workcenterCode: workCenter ? workCenter.workCenterCode : '',
        }, { emitEvent: false });
      });
    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.bomForm.valid) {
        if (args.action === 'add') {
          this.mappedList = [...this.grid.getCurrentViewRecords(), {
            ...this.bomForm.value,
            // uomName: this.bomForm.value.uOMName
          }];
        }
        if (args.action === 'edit') {
          this.mappedList = this.mappedList.map(row => {
            if (row.itemCode === this.bomForm.value.itemCode) { return this.bomForm.value; }
            return row;
          });
        }
      } else {
        args.cancel = true;
      }
    }
  }
  batchChanged(e) {
    this.pOBillOfMaterialService.getByProductionOrderBatch(this.productionOrder.id, e.value).subscribe(res => {
      if (res.length) {
        this.bomForBatch = res[0];
        this.mappedList = this.bomForBatch.plannedPOBillOfMaterialItem;

      } else {
        this.mappedList = this.defaultBomList;
      }
    });
  }

  submit() {
    const bomItems = this.grid.getCurrentViewRecords().map((row: any) => {
      return {
        itemCode: row.itemCode,
        itemName: row.itemName,
        uomCode: row.uomCode,
        uomName: row.uomName,
        cpcCode: row.cpcCode,
        cpcName: row.cpcName,
        quantity: row.quantity,
        plannedPOBillOfMaterialId: row.plannedPOBillOfMaterialId,
        manufacturedProductCode: row.manufacturedProductCode,
        movingWeightedAverageCostPerUnit: row.movingWeightedAverageCostPerUnit,
        latestPurchaseCostPerUnit: row.latestPurchaseCostPerUnit,
        standardCostPerUnitForCostEstimation: row.standardCostPerUnitForCostEstimation,
        priceVarianceProvision: row.priceVarianceProvision,
        isMaterialIssueLinkToWorkcenter: row.isMaterialIssueLinkToWorkcenter,
        isLotTrackingRequired: row.isLotTrackingRequired,
        isMaterialIssueByBackflushing: row.isMaterialIssueByBackflushing
      };
    });
    const bomData = {
      productionOrderId: this.productionOrder.id,
      maintainProductionId: this.bomForBatch.maintainProductionId,
      id: this.bomForBatch.id,
      plannedPOBillOfMaterialItem: bomItems.map(row => {
        return {
          ...row,
          // plannedPOBillOfMaterialId: 0,
          batchNumber: this.batch,
        };
      })
    };
    this.pOBillOfMaterialService.update(bomData).subscribe(res => {
      this.toastr.showSuccessMessage('Bill of materials added to production order successfully');
    });

  }
}
