import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EocService } from '../eoc.service';
import { EOCBasicModel } from '../eoc.model';
import { enumSelector } from '@shared/utils/common.functions';
import { RoutingType } from 'src/app/models/common/types/routingtype';
import { RoutingCostingBasis } from 'src/app/models/common/types/routingcostingbasis';
import { BomService } from '@features/bom/bom.service';
import { ProductionLine } from '@settings/production-line/production-line.model';
import { ProductionLineService } from '@settings/production-line/production-line.service';
import { ProductionRoutingService } from '@features/routing/productionrouting/production-routing.service';
import { GenericRoutingService } from '@features/routing/genericroutingmaster/generic-routing.service';

@Component({
  selector: 'app-routing-create',
  templateUrl: './routing-create.component.html'
})
export class RoutingCreateComponent implements OnInit {

  @Input() eocOrder;
  @Output() completed: EventEmitter<any> = new EventEmitter();

  public eocOrderForm: FormGroup;
  routingTypes = enumSelector(RoutingType);
  routingCostingBasis = enumSelector(RoutingCostingBasis);
  eoc: EOCBasicModel[] = [];
  uom: any[];
  eocData: any;
  productionRoutes: any[];
  manufacturingProduct: any[];
  productionLines: ProductionLine[] = [];
  products: any;
  submitClicked: boolean;

  get productionLineCode() { return this.eocOrderForm.get('productionLineCode'); }
  get manufacturedProductCode() { return this.eocOrderForm.get('manufacturedProductCode'); }
  get routingCosting() { return this.eocOrderForm.get('routingCostingBasis'); }
  get productionUOM() { return this.eocOrderForm.get('productionUOM'); }
  get productionQuantity() { return this.eocOrderForm.get('productionQuantity'); }

  constructor(
    private router: Router,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eocService: EocService,
    private bomService: BomService,
    private productionLineService: ProductionLineService,
    private poductionRoutingService: ProductionRoutingService,
    private genericRoutingService: GenericRoutingService
  ) { }

  ngOnInit(): void {
    this.getAllUomAndItems();
    this.getEocList();
    this.routingTypes = enumSelector(RoutingType);
    this.routingCostingBasis = enumSelector(RoutingCostingBasis);
    this.eocOrderForm = this.createFormGroup({});
    this.eocOrderForm.get('productionLineCode').valueChanges.subscribe(res => {
      this.manufacturingProduct = this.products.filter(item => item.productionLineCode === res)
      this.eocOrderForm.patchValue({
      },
        { emitEvent: false });
    })
    this.submitClicked = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("this.eocOrder",this.eocOrder);
    if (changes.eocOrder.currentValue !== changes.eocOrder.previousValue) {
      // this.eocOrderForm = this.createFormGroup(this.eocOrder);
      // this.eocOrderForm.patchValue(this.eocOrder);
    }
  }

  getAllUomAndItems() {
    forkJoin(
      [
        this.poductionRoutingService.getAll(),
        this.productionLineService.getAll(),
        this.bomService.getAllItem(),
        this.bomService.getAllUOM()
      ]
    ).subscribe(([productionRoutes, productionLines, items, uoms]) => {
      this.productionLines = productionLines.filter(productionLine => productionRoutes.find(route => route.productionLineId === productionLine.id))
      this.products = productionRoutes;
      this.uom = uoms;
      const res = this.eocOrder
      if (this.eocOrder) {
        this.eocOrderForm.patchValue(res);
      }
    });
  }

  getEocList() {
    this.eocService.getAll().subscribe(result => {
      this.eoc = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the EOC Details');
      });
  }

  getProductionLineName(event) {
    // console.log("event", event);
    this.eocOrderForm.patchValue({ productionLineName: event.itemData.productionLineName })
    this.eocOrderForm.patchValue({ productionLineId: event.itemData.id })
  }

  getRoutingCodebyProduct(event) {
    this.eocService.getRoutingcode(event.value).subscribe(result => {
      this.productionRoutes = result;
      if (result.length != 0) {
        this.eocOrderForm.controls.routingCode.setValue(result[0].routingCode);
        this.eocOrderForm.controls.routingName.setValue(result[0].routingName);
        this.eocOrderForm.controls.routingId.setValue(result[0].routingId);
        this.eocOrderForm.controls.manufacturedProduct.setValue(result[0].manufacturedProduct);
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Routing Code Details');
      });
  }

  createFormGroup(eoc): FormGroup {
    return this.formBuilder.group({
      id: [eoc.id || 0],
      manufacturedProductCode: [eoc.manufacturedProductCode || null, [
        Validators.required
      ]],
      manufacturedProduct: [eoc.manufacturedProduct || '', [
        // Validators.required
      ]],
      routingId: [eoc.routingId || null, []],
      routingCode: [{ value: eoc.routingCode, disabled: true } || null, [
      // routingCode: [eoc.routingCode || null, [
        // Validators.required,
        // Validators.maxLength(4)
      ]],
      routingName: [eoc.routingName || null, [
        // Validators.required,
      ]],
      routingCostingBasis: [eoc.routingCostingBasis || null, [
        Validators.required,
      ]],
      productionUOM: [eoc.productionUOM || null, [
        Validators.required,
      ]],
      productionQuantity: [eoc.productionQuantity || null, [
        Validators.required,
        Validators.max(999999)
      ]],
      productionLineId: [eoc.productionLineId || null, [
        // Validators.required,
      ]],
      productionLineName: [eoc.productionLineName || null, [
      ]],
      productionLineCode: [eoc.productionLineCode || null, [
        Validators.required,
      ]],
      eocOperationCollection: [eoc.eocOperationCollection || null, [
      ]],
    });
  }

  submit() {
    this.submitClicked = true;
    const eocFormValue = this.eocOrderForm.getRawValue();
    const eocOrder = {
      ...this.eocOrderForm.getRawValue(),
    }
    // console.log("id up",eocFormValue,eocOrder.id);
    if (eocOrder.id) {
      this.eocService.update(eocFormValue)
        .subscribe(res => {
          this.submitClicked = false;
          this.toastr.showSuccessMessage('EOC order update successfully!');
          this.completed.emit(1);
        });
    } else {
      const { id, ...eocOrderForm } = eocOrder;
      const eocRoute = eocOrder.routingId;
      this.genericRoutingService.getAllRoutingDetails(eocRoute).subscribe((routes) => {
        this.submitClicked = false;
        const routing = {
          manufacturedProductCode: eocOrder.manufacturedProductCode,
          manufacturedProduct: eocOrder.manufacturedProduct,
          routingId: eocOrder.routingId,
          routingCode: routes.routingCode,
          routingName: routes.routingName,
          routingCostingBasis: eocOrder.routingCostingBasis,
          productionUOM: eocOrder.productionUOM,
          productionQuantity: eocOrder.productionQuantity,
          productionLineId: eocOrder.productionLineId,
          productionLineName: eocOrder.productionLineName,
          productionLineCode: eocOrder.productionLineCode,
          eocOperationCollection: this.getOPerations(routes.operationsToRouting, eocOrder.manufacturedProductCode, eocOrder.manufacturedProduct)
        };
        const duplicateEoc = this.eoc.filter(x =>
          x.manufacturedProductCode === routing.manufacturedProductCode &&
          x.productionLineId === routing.productionLineId &&
          x.routingId === routing.routingId &&
          x.routingCostingBasis === routing.routingCostingBasis &&
          x.productionUOM == routing.productionUOM &&
          x.productionQuantity === routing.productionQuantity
        )
        if (duplicateEoc.length === 0) {
          this.eocService.add(routing).subscribe(result => {
            this.submitClicked = false;
            this.toastr.showSuccessMessage('EOC added successfully!');
            this.router.navigate(['eoc/eoc-list/' + result['id']]);
            this.completed.emit(1);
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the EOC Details');
            });
        }
        else {
          this.toastr.showErrorMessage('Connect add duplicate EOC Details');
        }
      });
    }
  }

  getOPerations(EOCOperation: any[], manufacturedProductCode, manufacturedProduct) {
    const operations = [];
    EOCOperation.map(op => {
      operations.push({
        routingName: op.routingName ? op.routingName : '',
        workCenterName: op.workCenterName ? op.workCenterName : '',
        yieldPercentage: op.yieldPercentage ? op.yieldPercentage : 0,
        isByproductGenerated: op.isByproductGenerated,
        byProductPercentage: op.byProductPercentage ? op.byProductPercentage : 0,
        manufacturedProductCode: manufacturedProductCode,
        manufacturedProduct: manufacturedProduct,
        backflushMaterial: op.backflushMaterial,
        batchControl: op.batchControl,
        id: op.id,
        operationName: op.operationName,
        operationNumber: op.operationNumber,
        qualityControlRequired: op.qualityControlRequired,
        routingCode: op.routingCode,
        routingId: op.routingId,
        workCenterId: op.workCenterId,
        eocTaskCollection: this.getTasks(op.taskToOperation)
      });
    });
    return operations;
  }

  getTasks(EOCTask: any[]) {
    const tasks = [];
    EOCTask.map(task => {
      tasks.push({
        taskName: task.taskName,
        taskCode: task.taskCode,
        operationId: task.operationId,
        operationNumber: task.operationNumber,
        qualityControlRequired: task.qualityControlRequired,
        relatedTaskId: task.relatedTaskId,
        costPerHour: task.costPerHour,
        description: task.description,
        id: task.id,
        isRelatedTask: task.isRelatedTask,
        eocManpowerCollection: this.getManpower(task.manpowerList, task.taskName),
        eocMachineCollection: this.getMachines(task.machineList, task.taskName),
      });
    });
    return tasks;
  }

  getMachines(EOCMachine: any, taskName) {
    const machines = [];
    EOCMachine.map(machine => {
      machines.push({
        taskName: taskName,
        machineCode: machine.machineId,
        machineHour: machine.machineHour ? machine.machineHour : 0,
        machineCost: machine.machineCost ? machine.machineCost : 0,
        costRatePerHour: machine.costRatePerHour,
        currencyCode: machine.currencyCode,
        id: machine.id,
        isArchived: machine.isArchived,
        machineName: machine.machineName,
        taskCode: machine.taskCode,
        taskId: machine.taskId,
      });
    });
    return machines;
  }

  getManpower(EOCManpower: any, taskName) {
    const manPowers = [];
    EOCManpower.map(manpower => {
      manPowers.push({
        taskName: taskName,
        operationHour: manpower.operationHour ? manpower.operationHour : 0,
        manpowerCostPerHour: manpower.costPerHour ? manpower.costPerHour : 0,
        manpowerCostPerCategory: manpower.manpowerCostPerCategory ? manpower.manpowerCostPerCategory : 0,
        idleHours: manpower.idleHours ? manpower.idleHours : 0,
        idleHourCost: manpower.idleHourCost ? manpower.idleHourCost : 0,
        currencyCode: manpower.currencyCode,
        id: manpower.id,
        manpowerCategory: manpower.manpowerCategory,
        manpowerCategoryCode: manpower.manpowerCategoryCode,
        noOfResources: manpower.noOfResources,
        taskCode: manpower.taskCode,
        taskId: manpower.taskId,
      });
    });
    return manPowers;
  }

}
