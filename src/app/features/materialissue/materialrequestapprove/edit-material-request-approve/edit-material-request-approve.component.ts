import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BomService } from '@features/bom/bom.service';
import { DetailMaterialIssue, MaterialIssue } from '@features/materialissue/material-issue.model';
import { MaterialissueService } from '@features/materialissue/materialissue.service';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { approvalSystemService } from '@features/materialissue/approval-system.service';


@Component({
  selector: 'app-edit-material-request-approve',
  templateUrl: './edit-material-request-approve.component.html',
})
export class EditMaterialRequestApproveComponent implements OnInit {
  materialItemDetailsForm: FormGroup;
  materialIssueForm: FormGroup;
  detailsMaterialIssue: DetailMaterialIssue[] = [];
  materialIssueItemDeletedIds: any[];
  workCenter: WorkCenter[];
  items: any[];
  uom: any[];
  stockQtyUom: any[];
  suggestedQtyUom: any[];
  issueQtyUom: any[];
  storeQtyUom: any[];
  materialIssueData: MaterialIssue;
  materialIssueId: number;
  disableOnHold: boolean;

  submitClicked: boolean;

  get storeQuantityUOMName() { return this.materialItemDetailsForm.get('storeQuantityUOMName'); }
  get storeQuantity() { return this.materialItemDetailsForm.get('storeQuantity'); }
  get issueQuantityUOMName() { return this.materialItemDetailsForm.get('issueQuantityUOMName'); }
  get issueQuantity() { return this.materialItemDetailsForm.get('issueQuantity'); }
  get remarksCtrl() { return this.materialItemDetailsForm.get('remarks'); }

  constructor(private bomService: BomService, private toastr: ToasterDisplayService,
    private approvalSystemService: approvalSystemService,
    public costPriceService: CostPriceService, private materialissueService: MaterialissueService,
    private formBuilder: FormBuilder, private workCentersService: WorkCentersService,
    private datepipe: DatePipe, private router: Router, private route: ActivatedRoute) {
    this.materialIssueId = this.route.snapshot.params['id'];
  }
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Search'];
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } }];
  materialIssueFrom = [
    { id: 1, code: 'MIF1', name: 'MIF-111' },
    { id: 2, code: 'MIF2', name: 'MIF-222' },
  ];
  materialIssueTo = [
    { id: 1, code: 'MIT1', name: 'MIT-111' },
    { id: 2, code: 'MIT2', name: 'MIT-222' },
  ];
  ngOnInit(): void {
    this.toolbar = ['Search'];
    this.materialIssueForm = this.createMaterialIssueFormGroup();
    this.getAllItem();
    this.getAllUOM();
    this.getAllWorkCenter();
    if (this.materialIssueId != null && this.materialIssueId != undefined) {
      this.materialissueService.getMaterialIssue(this.materialIssueId).subscribe(result => {
        if (result) {
          this.materialIssueForm.patchValue({ id: result[0].id });
          this.materialIssueForm.patchValue({ materialRequestNumber: result[0].materialRequestNumber });
          this.materialIssueForm.patchValue({ requestedDate: result[0].requestedDate });
          this.materialIssueForm.patchValue({ requestedBy: result[0].requestedBy });
          this.materialIssueForm.patchValue({ requestedByCode: result[0].requestedByCode });
          this.materialIssueForm.patchValue({ remarks: result[0].remarks });
          this.materialIssueForm.patchValue({ workCenterCode: result[0].workCenterCode });
          this.materialIssueForm.patchValue({ workCenterName: result[0].workCenterName });
          this.materialIssueForm.patchValue({ requestMaterialToCode: result[0].requestMaterialToCode });
          this.materialIssueForm.patchValue({ requestMaterialToName: result[0].requestMaterialToName });
          this.materialIssueForm.patchValue({ requestMaterialFromCode: result[0].requestMaterialFromCode });
          this.materialIssueForm.patchValue({ requestMaterialFromName: result[0].requestMaterialFromName });
          if (result[0].status === 4) {
            this.disableOnHold = true;
          }
          else {
            this.disableOnHold = false;
          }
          if (result[0].detailMaterialIssueItems.length != 0) {
            if (result[0].detailMaterialIssueItems[0] == null) {
              this.detailsMaterialIssue = [];
            }
            else {
              this.detailsMaterialIssue = result[0].detailMaterialIssueItems;
            }

          }
        }
      },
        error => {
          console.error(error);
          this.toastr.showErrorMessage('Unable to fetch the meterial issue  details');
        });
    }
  }
  createMaterialIssueFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      materialRequestNumber: ['', [
        Validators.required
      ]],
      workCenterCode: ['', [
        Validators.required
      ]],
      workCenterName: ['', [
        Validators.required
      ]],
      requestMaterialToCode: ['', [
        Validators.required
      ]],
      requestMaterialToName: ['', [
        Validators.required
      ]],
      requestedDate: ['', [
        Validators.required
      ]],
      requestMaterialFromCode: ['', [
        Validators.required
      ]],
      requestMaterialFromName: ['', [
        Validators.required
      ]],
      requestedByCode: ['', [
        Validators.required
      ]],
      requestedBy: ['', [
        Validators.required
      ]],
      status: [2, [
        Validators.required
      ]],
      remarks: ['', [
        Validators.required
      ]],
    });
  }
  createFormGroup(data: any): FormGroup {
    return this.formBuilder.group({
      id: [data.id == null ? 0 : data.id],
      itemName: [data.itemName, [
        Validators.required
      ]],
      itemCode: [data.itemCode, [
        Validators.required
      ]],
      requestedQuantity: [data.requestedQuantity, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      requestedQuantityUOMCode: [data.requestedQuantityUOMCode, [
        Validators.required
      ]],
      requestedQuantityUOMName: [data.requestedQuantityUOMName, [
        Validators.required
      ]],
      stockQuantityUOMCode: [data.stockQuantityUOMCode, [
        Validators.required
      ]],
      stockQuantityUOMName: [data.stockQuantityUOMName, [
        Validators.required
      ]],
      stockQuantity: [data.stockQuantity, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      suggestedQuantity: [data.suggestedQuantity, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      suggestedQuantityUOMCode: [data.suggestedQuantityUOMCode, [
        Validators.required
      ]],
      suggestedQuantityUOMName: [data.suggestedQuantityUOMName, [
        Validators.required
      ]],
      storeQuantityUOMCode: [data.storeQuantityUOMCode, [
        Validators.required
      ]],
      storeQuantityUOMName: [data.storeQuantityUOMName, [
        Validators.required
      ]],
      storeQuantity: [data.storeQuantity, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]],
      issueQuantityUOMCode: [data.issueQuantityUOMCode, [
        Validators.required
      ]],
      issueQuantityUOMName: [data.issueQuantityUOMName, [
        Validators.required
      ]],
      issueQuantity: [data.issueQuantity, [
        Validators.required
      ]],
      remarks: [data.remarks,[
        Validators.maxLength(128)
      ]],
    });

  }
  getAllItem() {
    this.bomService.getAllItem().subscribe(result => {
      if (result.length != 0) {
        this.items = result.filter(x => x.itemType != "Manufactured");
      }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the item details');
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
  getAllUOM() {
    this.bomService.getAllUOM().subscribe(result => {
      this.uom = this.stockQtyUom = this.suggestedQtyUom = this.storeQtyUom = this.issueQtyUom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }
  materialRequestApprove() {
    this.materialIssueForm.value.requestedDate = this.datepipe.transform(this.materialIssueForm.value.requestedDate, 'yyyy/MM/dd');
    this.materialIssueData = new MaterialIssue();
    this.materialIssueData.id = this.materialIssueForm.value.id;
    this.materialIssueData.materialRequestNumber = this.materialIssueForm.value.materialRequestNumber;
    this.materialIssueData.workCenterCode = this.materialIssueForm.value.workCenterCode;
    this.materialIssueData.workCenterName = this.materialIssueForm.value.workCenterName;
    this.materialIssueData.requestMaterialToCode = this.materialIssueForm.value.requestMaterialToCode;
    this.materialIssueData.requestMaterialToName = this.materialIssueForm.value.requestMaterialToName;
    this.materialIssueData.requestedDate = this.materialIssueForm.value.requestedDate;
    this.materialIssueData.requestMaterialFromCode = this.materialIssueForm.value.requestMaterialFromCode;
    this.materialIssueData.requestMaterialFromName = this.materialIssueForm.value.requestMaterialFromName;
    this.materialIssueData.requestedByCode = this.materialIssueForm.value.requestedByCode;
    this.materialIssueData.requestedBy = this.materialIssueForm.value.requestedBy;
    this.materialIssueData.status = 3;
    this.materialIssueData.remarks = this.materialIssueForm.value.remarks;
    if (this.detailsMaterialIssue.length != 0) {
      this.materialIssueData.detailMaterialIssueItems = this.detailsMaterialIssue;
    }
    this.materialIssueData.detailMaterialIssueDeleteList = [];
    this.materialissueService.update(this.materialIssueData)
      .subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Material Issue updated successfully!');
          this.router.navigate(['/materialissue/material-issue-container']);
        }
      });
      // this.approvalSystemService parameter values passed here
      this.approvalSystemService
      .GetAllAppr(this.materialIssueId,1)
      .subscribe((response) => {
      console.log(response)
      }), error => {
        console.error(error);
      };

  }
  
  materialOnHold() {
    let _materialRequestNo = this.materialIssueForm.get('materialRequestNumber').value;
    this.materialissueService.updateMaterialIssueStatus(_materialRequestNo, 4)
      .subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Material issue request holded!');
          this.router.navigate(['/materialissue/material-issue-container']);
        }
      });
  }
  rejected() {
    let _materialRequestNo = this.materialIssueForm.get('materialRequestNumber').value;
    this.materialissueService.updateMaterialIssueStatus(_materialRequestNo, 5)
      .subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Material issue request rejected!');
          this.router.navigate(['/materialissue/material-issue-container']);
        }
      });
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
    
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Material Issue Approve' : 'Add Material Issue Approve';
    }
   if(args.dialog){
    let btnObj = (args.dialog as any).btnObj[0];
   
    btnObj.disabled = !this.materialItemDetailsForm.valid;
    this.materialItemDetailsForm.statusChanges.subscribe((e)=> {
     e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true; 
    });
   }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.materialItemDetailsForm = this.createFormGroup(args.rowData);
    }
    if(args.requestType === 'save'){
      this.submitClicked = true;
    }
  }
  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({ content: toolcontent });
    tooltip.appendTo(args.node);
  }
  onChangeItem(evt) {
    this.materialItemDetailsForm.patchValue({ itemCode: evt.itemData.itemCode });
  }
  onChangeRequestedQtyUOM(evt) {
    this.materialItemDetailsForm.patchValue({ requestedQuantityUOMCode: evt.itemData.uomCode });
  }
  onChangeStockQtyUOM(evt) {
    this.materialItemDetailsForm.patchValue({ stockQuantityUOMCode: evt.itemData.uomCode });
  }
  onChangeSuggestedQtyUOM(evt) {
    this.materialItemDetailsForm.patchValue({ suggestedQuantityUOMCode: evt.itemData.uomCode });
  }
  onChangeStoreQtyUOM(evt) {
    this.materialItemDetailsForm.patchValue({ storeQuantityUOMCode: evt.itemData.uomCode });
  }
  onChangeIssueQtyUOM(evt) {
    this.materialItemDetailsForm.patchValue({ issueQuantityUOMCode: evt.itemData.uomCode });
  }
  onChangeWorkCenter(evt) {
    this.materialIssueForm.patchValue({ workCenterName: evt.itemData.workCenterName });
  }
  onChangeMaterialIssueFrom(evt) {
    this.materialIssueForm.patchValue({ requestMaterialFromName: evt.itemData.name });
  }
  onChangeMaterialIssueTo(evt) {
    this.materialIssueForm.patchValue({ requestMaterialToName: evt.itemData.name });
  }

}
