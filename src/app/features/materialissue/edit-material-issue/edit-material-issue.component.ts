import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BomService } from '@features/bom/bom.service';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { DetailMaterialIssue, MaterialIssue } from '../material-issue.model';
import { MaterialissueService } from '../materialissue.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-edit-material-issue',
  templateUrl: './edit-material-issue.component.html'
})
export class EditMaterialIssueComponent implements OnInit {
  materialItemDetailsForm: FormGroup;
  materialIssueForm: FormGroup;
  detailsMaterialIssue: DetailMaterialIssue[] = [];
  materialIssueItemDeletedIds: any[];
  workCenter: WorkCenter[];
  items: any[];
  uom: any[];
  stockQtyUom: any[];
  suggestedQtyUom: any[];
  materialIssueData: MaterialIssue;
  materialIssueId: number;
  deletedIds: number[] = [];
  disableButton: boolean;
  disableverifyAndCollect: boolean;

  submitClicked: boolean;

  get itemName() { return this.materialItemDetailsForm.get('itemName'); }
  get requestedQuantityUOMName() { return this.materialItemDetailsForm.get('requestedQuantityUOMName'); }
  get requestedQuantity() { return this.materialItemDetailsForm.get('requestedQuantity'); }
  get stockQuantityUOMName() { return this.materialItemDetailsForm.get('stockQuantityUOMName'); }
  get stockQuantity() { return this.materialItemDetailsForm.get('stockQuantity'); }
  get suggestedQuantityUOMName() { return this.materialItemDetailsForm.get('suggestedQuantityUOMName'); }
  get suggestedQuantity() { return this.materialItemDetailsForm.get('suggestedQuantity'); }
  get remarks() { return this.materialItemDetailsForm.get('remarks'); }


  constructor(private bomService: BomService, private toastr: ToasterDisplayService,
    public costPriceService: CostPriceService, private materialissueService: MaterialissueService,
    private formBuilder: FormBuilder, private workCentersService: WorkCentersService,
    private datepipe: DatePipe, private router: Router, private route: ActivatedRoute) {
    this.materialIssueId = this.route.snapshot.params['id'];
  }
  @ViewChild('Grid') public Grid: GridComponent;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  materialIssueFrom = [
    { id: 1, code: 'MIF1', name: 'MIF-111' },
    { id: 2, code: 'MIF2', name: 'MIF-222' },
  ];
  materialIssueTo = [
    { id: 1, code: 'MIT1', name: 'MIT-111' },
    { id: 2, code: 'MIT2', name: 'MIT-222' },
  ];
  ngOnInit(): void {
    this.toolbar = ['Add', 'Search'];
    this.materialIssueForm = this.createMaterialIssueFormGroup();
    this.getAllItem();
    this.getAllUOM();
    this.getAllWorkCenter();
    if (this.materialIssueId != null && this.materialIssueId != undefined) {
      this.materialissueService.getMaterialIssue(this.materialIssueId).subscribe(result => {
        if (result) {
          if (result[0].status == 3) {
            if (this.Grid.element.classList.contains('disablegrid')) {
              this.Grid.element.classList.remove('disablegrid');
              document.getElementById('GridParent').classList.remove('wrapper');
            } else {
              this.Grid.element.classList.add('disablegrid');
              document.getElementById('GridParent').classList.add('wrapper');
            }
            this.disableverifyAndCollect = false;
            this.disableButton = true;
          }
          else {
            this.disableverifyAndCollect = true;
            this.disableButton = false;
          }
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
      requestedBy: ['', [
        Validators.required
      ]],
      requestedByCode: ['', [
        Validators.required
      ]],
      status: [2, [
        Validators.required
      ]],
      remarks: ['', [
       
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
      this.uom = this.stockQtyUom = this.suggestedQtyUom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }
  materiaIssueRequest() {
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
    this.materialIssueData.status = 2;
    this.materialIssueData.remarks = this.materialIssueForm.value.remarks;
    if (this.detailsMaterialIssue.length != 0) {
      this.materialIssueData.detailMaterialIssueItems = this.Grid.getCurrentViewRecords();
    }
    else {
      this.materialIssueData.detailMaterialIssueItems = [];
    }
    this.materialIssueData.detailMaterialIssueDeleteList = [];
    if (this.materialIssueForm.valid) {
      this.materialissueService.update(this.materialIssueData)
        .subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Material issue request successfully!');
            this.router.navigate(['/materialissue/material-issue-container']);
          }
        });
    }

  }
  saveMaterialIssue() {
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
    this.materialIssueData.status = 1;
    this.materialIssueData.remarks = this.materialIssueForm.value.remarks;
    if (this.detailsMaterialIssue.length != 0) {
      this.materialIssueData.detailMaterialIssueItems =this.Grid.getCurrentViewRecords();
    }
    else {
      this.materialIssueData.detailMaterialIssueItems = [];
    }
    this.materialIssueData.detailMaterialIssueDeleteList = this.deletedIds;
    if (this.materialIssueForm.valid) {
      this.materialissueService.update(this.materialIssueData)
        .subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Material Issue updated successfully!');
            this.router.navigate(['/materialissue/material-issue-container']);
          }
        });
    }

  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Items' : 'Add Items';
    }
    if (args.dialog) {
      let btnObj = (args.dialog as any).btnObj[0];

      btnObj.disabled = !this.materialItemDetailsForm.valid;
      this.materialItemDetailsForm.statusChanges.subscribe((e) => {
        e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true;
      });
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.materialItemDetailsForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      console.log(this.materialItemDetailsForm.value);

    }
  }

  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({ content: toolcontent });
    tooltip.appendTo(args.node);
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.type == "Delete") {
      this.deletedIds.push(args.rowData["id"]);
    }
  }
  verifyAndCollect() {
    let _materialRequestNo = this.materialIssueForm.get('materialRequestNumber').value;
    this.materialissueService.updateMaterialIssueStatus(_materialRequestNo, 6)
      .subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Material issue verify and collect!');
          this.router.navigate(['/materialissue/material-issue-container']);
        }
      });
  }
  cancelled() {
    let _materialRequestNo = this.materialIssueForm.get('materialRequestNumber').value;
    this.materialissueService.updateMaterialIssueStatus(_materialRequestNo, 7)
      .subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Material issue request cancelled!');
          this.router.navigate(['/materialissue/material-issue-container']);
        }
      });
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

  onChangeMaterialIssueFrom(evt) {
    this.materialIssueForm.patchValue({ requestMaterialFromName: evt.itemData.name });
  }
  onChangeMaterialIssueTo(evt) {
    this.materialIssueForm.patchValue({ requestMaterialToName: evt.itemData.name });
  }
  public onFilteringResItem = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('itemName', 'contains', e.text, true).or('itemCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.items, query);
  }
}
