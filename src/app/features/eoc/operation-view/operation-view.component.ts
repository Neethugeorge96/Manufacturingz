import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EocService } from '../eoc.service';
import { EOCBasicModel } from '../eoc.model';
import { enumSelector } from '@shared/utils/common.functions';
import { RoutingType } from 'src/app/models/common/types/routingtype';
import { RoutingCostingBasis } from 'src/app/models/common/types/routingcostingbasis';
import { BomService } from '@features/bom/bom.service';
// import { OperationService } from '../operation.service';
import { EOCOperation } from '../operation.model';
import { OperationService } from '@features/routing/genericroutingmaster/operation.service';
import { EOCOperationService } from '../operation.service';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { forkJoin, of } from 'rxjs';
import { result } from 'lodash';

@Component({
  selector: 'app-operation-view',
  templateUrl: './operation-view.component.html'
})
export class OperationViewComponent implements OnInit, OnChanges {

  @Input() operation: any;
  @Input() eocRoute: any;
  eocOperation: any;
  routingId: number;
  public operationForm: FormGroup;
  routingTypes = enumSelector(RoutingType);
  routingCostingBasis = enumSelector(RoutingCostingBasis);
  uom: any[];
  eocRoutingData: any[];
  productionRoutes: any[];
  eocData: any;
  manufacturingProduct: any[];
  workcenter: WorkCenter[] = [];


  submitClicked: boolean;

  get yieldPercentage() { return this.operationForm.get('yieldPercentage'); }
  get byProductPercentage() { return this.operationForm.get('byProductPercentage'); }



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private operationService: OperationService,
    private eocOperationService: EOCOperationService,
    private bomService: BomService,
    private eocService: EocService,
    private workCentersService: WorkCentersService
  ) { }

  ngOnInit(): void {
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    this.getEocDetails();
    this.getAllUOM();
    this.getManufacturingProduct();
    // console.log("operation", this.operation)
    this.operationForm = this.createFormGroup({});
    forkJoin(
      [
        this.workCentersService.getAll(),
        this.eocOperationService.get(this.operation.id)
      ])
      .subscribe(([workcenter, eocOperation]) => {
        this.workcenter = workcenter;
        this.eocOperation = eocOperation;
        this.operationForm.patchValue({
          ...eocOperation,
          workCenterName: this.workcenter.find(x => x.id == eocOperation.workCenterId).workCenterName,
        });
        // console.log("patch",operations)
      });
    // this.getWorkCenterList();
    // this.getOperationList();
    this.submitClicked = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.operation.previousValue && changes.operation.currentValue.id !== changes.operation.previousValue.id) {
      this.routingId = Number(this.route.snapshot.paramMap.get('id'));
      this.getEocDetails();
      this.getAllUOM();
      this.getManufacturingProduct();
      // console.log("operation", this.operation)
      this.operationForm = this.createFormGroup({});
      forkJoin(
        [
          this.workCentersService.getAll(),
          this.eocOperationService.get(this.operation.id)
        ])
        .subscribe(([workcenter, eocOperation]) => {
          this.workcenter = workcenter;
          this.eocOperation = eocOperation;
          this.operationForm.patchValue({
            ...eocOperation,
            workCenterName: this.workcenter.find(x => x.id == eocOperation.workCenterId).workCenterName,
          });
          // console.log("patch",operations)
        });
    }
  }

  getOperationCost() {
    this.eocOperationService.get(this.operation).subscribe(result => {
      this.eocData = result;
      // console.log("res", result)
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Operation Details');
      });
  }

  getEocDetails() {
    this.eocService.get(this.routingId).subscribe(result => {
      this.eocData = result;
      // console.log("res", result)
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the EOC Details');
      });
  }

  getWorkCenterList() {
    this.workCentersService.getAll().subscribe(result => {
      this.workcenter = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Workcenter Details');
      });
  }

  getOperationList() {
    this.operationService.get(this.operation).subscribe(result => {
      this.eocOperation = result;
      // console.log("operation Value", result)
      this.operationForm.patchValue(result);
      // this.operationForm.patchValue({
      //   ...result,
      //   workCenterName: this.workcenter.find(x=>x.id == result.workCenterId).workCenterName
      // });
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the EOC Operation Details');
      });
  }

  getManufacturingProduct() {
    this.bomService.getAllItem().subscribe(result => {
      this.manufacturingProduct = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Manufacuring Product details');
      });
  }

  getAllUOM() {
    this.bomService.getAllUOM().subscribe(result => {
      this.uom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }

  createFormGroup(routeOperation): FormGroup {
    return this.formBuilder.group({
      id: [this.operation || 0],
      eocBasicId: this.eocRoute.eocBasicId,
      routingId: [routeOperation.routingId || null, []],
      routingCode: [routeOperation.routingCode || null, [
        // Validators.required,
        // Validators.maxLength(4)
      ]],
      routingName: [routeOperation.routingName || null, [
        // Validators.required,
      ]],
      workCenterId: [routeOperation.workCenterId || null, [
        // Validators.required,
      ]],
      workCenterName: [{ value: routeOperation.workCenterName, disabled: true } || null, [
        // Validators.required,
      ]],
      operationNumber: [routeOperation.operationNumber || null, [
        // Validators.required,
      ]],
      operationName: [routeOperation.operationName || null, [
         //Validators.required,
      ]],
      yieldPercentage: [routeOperation.yieldPercentage || null, [
        Validators.required,
        Validators.max(100)
      ]],
      isByProductGenerated: [routeOperation.isByProductGenerated || false, [
        // Validators.required,
      ]],
      byProductPercentage: [routeOperation.byProductPercentage || 0, [
        Validators.required,
        Validators.max(100)
      ]],
      manufacturedProductCode: [routeOperation.manufacturedProductCode || null, [
        // Validators.required,
         //Validators.maxLength(4)
      ]],
      manufacturedProduct: [routeOperation.manufacturedProduct || '', [
        // Validators.required
      ]]
    });
  }

  onSubmit() {
    this.submitClicked = true;
    const operationFormValue = this.operationForm.getRawValue()
    // console.log("this.operationForm.value", this.operationForm.value)
    operationFormValue.manufacturedProduct = this.eocData.manufacturedProduct;
    operationFormValue.manufacturedProductCode = this.eocData.manufacturedProductCode;
    operationFormValue.routingName = operationFormValue.routingCode;
    operationFormValue.routingName = this.eocRoute.routingName;
    operationFormValue.routingCode = this.eocRoute.routingCode;
    operationFormValue.routingId = this.eocRoute.routingId;

    // console.log(this.operationForm.value);
    if (this.eocOperation.id) {
      this.eocOperationService.update(this.operationForm.value).subscribe((res: any) => {
        // console.log("update", res);
        this.submitClicked = false;
        this.toastr.showSuccessMessage('EOC operation updated successfully!');

      })
    } else {
      this.eocOperationService.add(this.operationForm.value).subscribe((res: any) => {
        // console.log("add", res);
        this.submitClicked = false;
        this.toastr.showSuccessMessage('EOC operation added successfully!');

      });
    }
    // this.eocOperationService.update(this.operationForm.value).subscribe((res: any) => {
    //   if (res) {
    //     this.toastr.showSuccessMessage('EOC operation updated successfully!');
    //     // this.router.navigate(['eoc/eoc-list/' + res.id]);
    //   }
    // },
    error => {
      console.error("err", error);
      this.toastr.showErrorMessage('Unable to update the EOC operation Details');
    }
  }

}
