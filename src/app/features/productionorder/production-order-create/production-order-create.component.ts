import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { BatchControlService } from '@settings/batch-control/batch-control.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ProductionorderService } from '../productionorder.service';
import { ProductionLine } from '@settings/production-line/production-line.model';
import { ProductionLineService } from '@settings/production-line/production-line.service';
import { ProductionRoutingService } from '@features/routing/productionrouting/production-routing.service';
import { BatchSize } from '@settings/batch-control/batch-control.model';
import { GenericRoutingService } from '@features/routing/genericroutingmaster/generic-routing.service';
import { ProductionRouting } from '@features/routing/productionrouting/production-routing.model';
import { BomService } from '@features/bom/bom.service';
import { PORoutingService } from '../po-routing.service';
import { POBillOfMaterialService } from '../po-bill-of-material.service';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-production-order-create',
  templateUrl: './production-order-create.component.html'
})
export class ProductionOrderCreateComponent implements OnInit, OnChanges {

  @Input() productionOrder;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  public value = new Date();
  productionUnits: any[];
  batch: any[];
  productItems: any[] = [];
  productionorderForm: FormGroup;
  productionLines: any[] = [];
  batches: BatchSize[] = [];
  productionRoutes: ProductionRouting[];
  products: any[] = [];
  code: any;
  submitClicked: boolean;
  batchForItem: BatchSize;

  get productionOrderDate() { return this.productionorderForm.get('productionOrderDate'); }
  get productionCode() { return this.productionorderForm.get('productionCode'); }
  get productionLineCode() { return this.productionorderForm.get('productionLineCode'); }
  get productionQuantity() { return this.productionorderForm.get('productionQuantity'); }

  constructor(
    private toastr: ToasterDisplayService,
    private productionorderservice: ProductionorderService,
    private router: Router,
    private bomService: BomService,
    private genericRoutingService: GenericRoutingService,
    private poductionRoutingService: ProductionRoutingService,
    private productionLineService: ProductionLineService,
    private batchContolService: BatchControlService,
    private pORoutingService: PORoutingService,
    private pOBillOfMaterialService: POBillOfMaterialService,
    private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.getAllUomAndItems();
    this.productionorderservice.getLastNumber().subscribe(res => {
      this.productionorderForm.patchValue({ productionOrderNumber: res + 1 });

    });
    this.productionorderForm = this.createFormGroup({});
    this.productionorderForm.get('productionLineCode').valueChanges.subscribe(res => {
      this.productItems = this.products.filter(item => item.productionLineCode === res);
      this.productionorderForm.patchValue({
        productionItem: ''
      });
    });
    this.productionorderForm.valueChanges.subscribe(res => {
      this.batchForItem = this.batches.find(batch => batch.itemCode === res.productionCode);
      this.productionorderForm.patchValue(
        {
          uom: this.batchForItem ? this.batchForItem.uom : '',
          batchSize: res.productionQuantity ? Math.ceil(res.productionQuantity / (this.batchForItem ? this.batchForItem.batchSizeMaxQuantity : 1)) : null
        },
        { emitEvent: false });
      if (this.batchForItem) {
        this.productionorderForm.get('productionQuantity').setValidators(Validators.min(this.batchForItem.batchSizeMinQuantity));
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.productionOrder.currentValue !== changes.productionOrder.previousValue) {
      this.productionorderForm = this.createFormGroup({});
    }
  }

  getAllUomAndItems() {
    forkJoin(
      [
        this.batchContolService.getAll(),
        this.poductionRoutingService.getAll(),
        this.productionLineService.getAll(),
        this.bomService.getAll()
      ]
    ).subscribe(([batches, productionRoutes, productionLines, bomList]) => {
      this.productionLines = productionLines.filter(productionLine =>
        productionRoutes.find(route => route.productionLineId === productionLine.id));
      this.products = productionRoutes
        .filter(item => batches.find(batch => batch.itemCode === item.manufacturedProductCode)
          && bomList.find(bom => bom.manufacturedProductCode === item.manufacturedProductCode)
        );

      this.batches = batches;
      this.productionRoutes = productionRoutes;
      if (this.productionOrder) {
        this.productItems = this.products.filter(item => item.productionLineCode === this.productionOrder.productionLineCode);
        this.productionorderForm.get('productionCode').disable();
        this.productionorderForm.get('productionOrderNumber').disable();
        this.productionorderForm.get('productionLineCode').disable();
        this.productionorderForm.get('productionQuantity').disable();
        this.productionorderForm.patchValue(this.productionOrder);
      }

    });
  }


  createFormGroup(PO): FormGroup {
    return this.formBuilder.group({
      id: [PO.id || 0],
      productionOrderNumber: [{ value: PO.productionOrderNumber || this.code, disabled: true }, [
        // Validators.required,
        // Validators.maxLength(4)
      ]],
      productionOrderDate: [PO.productionOrderDate || new Date(), [
        Validators.required
      ]],
      productionItem: [PO.productionItem || null, []],
      productionCode: [PO.productionCode || null, [Validators.required]],
      productionLineCode: [PO.productionLineCode || null, [
        Validators.required,
        // Validators.maxLength(4)
      ]],
      uom: [{ value: PO.uom || null, disabled: true }, []],
      productionQuantity: [PO.productionQuantity || null, [
        Validators.required,
      ]],
      batchSize: [{ value: PO.batchSize || null, disabled: true }, []],
      status: [PO.status || 1],
    });
  }
  submit() {
    if (!this.productionOrder) {
      this.submitClicked = true;
      if (this.productionorderForm.valid) {
        const item = this.products.find(product => product.manufacturedProductCode === this.productionorderForm.value.productionCode);
        const productionOrder = {
          ...this.productionorderForm.getRawValue(),
          productionItem: item ? item.manufacturedProduct : '',
          productionLineName: this.productionLines
            .find(x => x.productionLineCode === this.productionorderForm.value.productionLineCode).productionLineName,
          productionLineId: this.productionLines.find(x => x.productionLineCode === this.productionorderForm.value.productionLineCode).id
        };
        const { id, ...productionOrderData } = productionOrder;
        this.productionorderservice.add(productionOrderData)
          .subscribe((res: any) => {
            this.submitClicked = false;
            const productionRoute = this.productionRoutes
              .find(mapping => mapping.manufacturedProductCode === productionOrder.productionCode);
            forkJoin([
              this.genericRoutingService.getAllRoutingDetails(productionRoute.routingId),
              this.bomService.getByItemCode(productionRoute.manufacturedProductCode)
            ]).subscribe(([routes, boms]) => {
              const routing = {
                productionOrderId: res.id,
                routingCode: routes.routingCode,
                routingName: routes.routingName,
                routingId: productionRoute.routingId,
                batchSize: productionOrder.batchSize,
                operationCollection: this.getOPerations(routes.operationsToRouting, productionOrder.batchSize)
              };
              const bom = boms[0];
              const billOfMaterials = {
                productionOrderId: res.id,
                maintainProductionId: bom.id,
                plannedPOBillOfMaterialItem: this.getBOMItems(bom.bomItems, productionOrder.batchSize)
              };
              forkJoin([
                this.pORoutingService.add(routing),
                this.pOBillOfMaterialService.add(billOfMaterials)
              ]).subscribe(() => {
                this.toastr.showSuccessMessage('Production Order added successfully!');
                this.router.navigate(['productionOrder/production-order-list/' + res.id]);
                this.completed.emit(1);
              });
            });
          });
      }

    } else {
      const item = this.products.find(product => product.manufacturedProductCode === this.productionorderForm.getRawValue().productionCode);
      const productionOrder = {
        ...this.productionorderForm.getRawValue(),
        productionItem: item ? item.manufacturedProduct : '',
        productionLineName: this.productionLines
          .find(x => x.productionLineCode === this.productionorderForm.getRawValue().productionLineCode).productionLineName,
        productionLineId: this.productionLines
          .find(x => x.productionLineCode === this.productionorderForm.getRawValue().productionLineCode).id
      };
      this.productionorderservice.update(productionOrder)
        .subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Production Order Upadated successfully!');
            this.completed.emit(1);
          }
        });
    }
  }
  getBOMItems(plannedPOBillOfMaterialItem: any, batchSize: any) {
    const bomItems = [];
    for (let index = 1; index <= batchSize; index++) {
      plannedPOBillOfMaterialItem.map(item => {
        if (item) {
          bomItems.push({
            plannedPOBillOfMaterialId: item.maintainProductionId,
            batchNumber: index,
            itemCode: item.itemCode,
            itemName: item.itemName,
            uomCode: item.uomCode,
            uomName: item.uomName,
            quantity: item.quantity,
            movingWeightedAverageCostPerUnit: item.movingWeightedAverageCostPerUnit,
            latestPurchaseCostPerUnit: item.LatestPurchaseCostPerUnit,
            standardCostPerUnitForCostEstimation: item.standardCostPerUnitForCostEstimation,
            priceVarianceProvision: item.priceVarianceProvision,
            cpcCode: item.cpcCode,
            cpcName: item.cpcName,
            isMaterialIssueLinkToWorkcenter: item.isMaterialIssueLinkToWorkcenter,
            workcenterId: item.workcenterId,
            isLotTrackingRequired: item.isLotTrackingRequired,
            isMaterialIssueByBackflushing: item.isMaterialIssueByBackflushing,
            manufacturedProductCode: item.manufacturedProductCode
          });
        }
      });
    }
    return bomItems;
  }
  getOPerations(plannedPOOperation: any[], batchSize: number) {
    const operations = [];
    for (let index = 1; index <= batchSize; index++) {
      plannedPOOperation.map(op => {
        operations.push({
          plannedPORoutingId: op.routingId,
          operationName: op.operationName,
          operationCode: op.operationNumber,
          batchNumber: index,
          workCenterId: op.workCenterId,
          taskCollection: this.getTasks(op.taskToOperation, index)
        });
      });

    }
    return operations;
  }
  getTasks(plannedPOTask: any[], index: number) {
    const tasks = [];
    // for (let index = 1; index <= batchSize; index++) {
    plannedPOTask.map(task => {
      tasks.push({
        taskName: task.taskName,
        taskCode: task.taskCode,
        batchNumber: index,
        plannedPOManpowerCollection: this.getManpower(task.manpowerList, index),
        plannedPOMachineCollection: this.getMachines(task.machineList, index),
        plannedPOChecklistCollection: this.getCheckList(task.checkList, index)
      });
    });
    return tasks;
    // }
  }
  getCheckList(plannedPOChecklist: any, index: number) {
    const checkLists = [];
    // for (let index = 1; index <= batchSize; index++) {
    plannedPOChecklist.map(checkList => {
      checkLists.push({
        plannedPOTaskId: checkList.taskId,
        batchNumber: index,
        checkListItem: checkList.checkListItem,
        description: checkList.description
      });
    });
    return checkLists;
    // }
  }
  getMachines(plannedPOMachine: any, index: number) {
    const machines = [];
    // for (let index = 1; index <= batchSize; index++) {
    plannedPOMachine.map(machine => {
      machines.push({
        plannedPOTaskId: machine.taskId,
        batchNumber: index,
        machineCode: machine.machineId,
        machineName: machine.machineName,
        costRatePerHour: machine.costRatePerHour,
        currencyCode: machine.currencyCode,
      });
    });
    return machines;
    // }
  }
  getManpower(plannedPOManpower: any, index: number) {
    const manPowers = [];
    // for (let index = 1; index <= batchSize; index++) {
    plannedPOManpower.map(manpower => {
      manPowers.push({
        plannedPOTaskId: manpower.taskId,
        batchNumber: index,
        manpowerCategoryCode: manpower.manpowerCategoryCode,
        manpowerCategory: manpower.manpowerCategory,
        manpowerName: 'a',
        costPerHour: manpower.costPerHour,
        currencyCode: manpower.currencyCode,
        noOfResources: manpower.noOfResources
      });
    });
    // }
    return manPowers;
  }
  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('productionLineName', 'contains', e.text, true).or('productionLineCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.productionLines, query);
  }

}
