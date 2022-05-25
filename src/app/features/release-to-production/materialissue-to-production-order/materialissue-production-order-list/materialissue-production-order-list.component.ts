import { Component, OnInit } from '@angular/core';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MaterialissuetoproductionorderService } from '../materialissue-to-production-order.service';
import { MaterialIssueToProductionOrder } from '../materialissue-production-order-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BomService } from '@features/bom/bom.service';

@Component({
  selector: 'app-materialissue-production-order-list',
  templateUrl: './materialissue-production-order-list.component.html'
})
export class MaterialissueProductionOrderListComponent implements OnInit {
  materialForm: FormGroup;
  materialIssuePO: MaterialIssueToProductionOrder[];
  public toolbar: ToolbarItems[] | object;
  productOrderId: number;
  uom: any[];
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  materialIssueFrom = [
    { id: 1, code: 'MIF1', name: 'MIF-111' },
    { id: 2, code: 'MIF2', name: 'MIF-222' },
  ];
  public commands: CommandModel[] = [
    {
      type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' }
    }];

  submitClicked: boolean;
  get issueMaterialFromName() { return this.materialForm.get('issueMaterialFromName'); }
  get actualUOMCode() { return this.materialForm.get('actualUOMCode'); }
  get actualQuantity() { return this.materialForm.get('actualQuantity'); }
  constructor(
    private toastr: ToasterDisplayService,
    private materialissuetoproductionorderService: MaterialissuetoproductionorderService,
    private formBuilder: FormBuilder, private bomService: BomService,
    private route: ActivatedRoute, private router: Router
  ) { }

  ngOnInit(): void {
    this.productOrderId = Number(this.route.snapshot.paramMap.get('id'));
    this.toolbar = ['Search']
    this.getAllUOM();
    this.getMaterialIssueToProductionOrderByPOId();
  }
  createFormGroup(data: any): FormGroup {
  
    return this.formBuilder.group({
      id: [data.id],
      itemName: [data.itemName, [
        //Validators.required
      ]],
      itemCode: [data.itemCode, [
        //Validators.required
      ]],
      issueMaterialFromName: [data.issueMaterialFromName != undefined ? data.issueMaterialFromName : "", [
        Validators.required
      ]],
      issueMaterialFromCode: [data.issueMaterialFromCode != undefined ? data.issueMaterialFromCode : "", [
       // Validators.required
      ]],
      uomCode: [data.uomCode, [
       // Validators.required
      ]],
      quantity: [data.quantity, [
       // Validators.required
      ]],
      actualUOMCode: [data.actualUOMCode != undefined ? data.actualUOMCode : "", [
        Validators.required
      ]],
      actualQuantity: [data.actualQuantity != undefined ? data.actualQuantity : null, [
        Validators.required,
        Validators.max(999999)
      ]],
      productionOrderId: [this.productOrderId, [
       // Validators.required
      ]],
      batchNumber: [data.batchNumber, [
       // Validators.required
      ]],
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

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Material Issue To Production Order' : 'Add Material Issue To Production Order';
    }
    if (args.dialog) {
      let btnObj = (args.dialog as any).btnObj[0];

      btnObj.disabled = !this.materialForm.valid;
      // console.log( btnObj.disabled);
      this.materialForm.statusChanges.subscribe((e) => {
        e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true;
      });
     }
  }
  actionBegin(args: SaveEventArgs): void {
  
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked= false;
      this.materialForm = this.createFormGroup(args.rowData);
    }
  }

  onChangeIssueMaterialFrom(evt) {
    this.materialForm.patchValue({ issueMaterialFromCode: evt.itemData.code });
  }
  getMaterialIssueToProductionOrderByPOId() {
    this.materialissuetoproductionorderService.getMaterialIssueToProductionOrderByPOId(this.productOrderId).subscribe(result => {
      this.materialIssuePO = result;
      if (result.length == 0) {
        this.getPlannedPOBOMDetailsByPOId();
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the production order details');
      });
  }
  getPlannedPOBOMDetailsByPOId() {
    this.materialissuetoproductionorderService.getPlannedPOBOMDetailsByPOId(this.productOrderId).subscribe(result => {
      if (result[0].plannedPOBillOfMaterialItem.length > 0) {
        this.materialIssuePO = result[0].plannedPOBillOfMaterialItem;
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the production order details');
      });
  }
  updateMaterialIssueToProductOrder() {
    this.submitClicked = true;
    if(this.materialForm.valid){
      this.materialIssuePO.forEach(element => {
        if (element.actualQuantity == undefined)
          element.actualQuantity = null;
        if (element.actualUOMCode == undefined)
          element.actualUOMCode = "";
        if (element.issueMaterialFromCode == undefined)
          element.issueMaterialFromCode = "";
        if (element.issueMaterialFromName == undefined)
          element.issueMaterialFromName = "";
        if (element.productionOrderId == undefined)
          element.productionOrderId = this.productOrderId;
      });
      this.materialissuetoproductionorderService.update(this.materialIssuePO)
        .subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Material issue to production order updated successfully!');
            this.router.navigate(['/release-to-production/release-production-list/edit/' + this.productOrderId]);
          }
        },
          error => {
            console.error("err", error);
            this.toastr.showErrorMessage('Unable to update material issue to production order');
          }
        );
    }
    
  }
}
