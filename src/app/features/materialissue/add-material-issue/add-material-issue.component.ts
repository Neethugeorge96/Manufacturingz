import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BomService } from '@features/bom/bom.service';
import { ManPowertoWorkCenterService } from '@features/mapping/manpower-workcenter-mapping/manpower-workcenter-mapping.service';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { CommandModel, EditSettingsModel, GridComponent, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { DetailMaterialIssue, MaterialIssue } from '../material-issue.model';
import { MaterialissueService } from '../materialissue.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-add-material-issue',
  templateUrl: './add-material-issue.component.html'
})
export class AddMaterialIssueComponent implements OnInit {
  materialItemDetailsForm: FormGroup;
  materialIssueForm: FormGroup;

  detailsMaterialIssue: DetailMaterialIssue[] = [];
  materialIssueItemDeletedIds: any[];
  workCenter: any[];
  items: any[];
  uom: any[];
  stockQtyUom: any[];
  suggestedQtyUom: any[];
  materialIssueData: MaterialIssue;
  manPower: any[];
  submitClicked: boolean;
  submitClickedMain: boolean;
  @ViewChild('Grid') public Grid: GridComponent;
  get itemName() { return this.materialItemDetailsForm.get('itemName'); }
  get requestedQuantityUOMName() { return this.materialItemDetailsForm.get('requestedQuantityUOMName'); }
  get requestedQuantity() { return this.materialItemDetailsForm.get('requestedQuantity'); }
  get stockQuantityUOMName() { return this.materialItemDetailsForm.get('stockQuantityUOMName'); }
  get stockQuantity() { return this.materialItemDetailsForm.get('stockQuantity'); }
  get suggestedQuantityUOMName() { return this.materialItemDetailsForm.get('suggestedQuantityUOMName'); }
  get suggestedQuantity() { return this.materialItemDetailsForm.get('suggestedQuantity'); }
  get remarks() { return this.materialItemDetailsForm.get('remarks'); }


  // get materialRequestNumber() { return this.materialIssueForm.get('materialRequestNumber'); }
  get workCenterCode() { return this.materialIssueForm.get('workCenterCode'); }
  get requestMaterialFromCode() { return this.materialIssueForm.get('requestMaterialFromCode'); }
  get requestMaterialToCode() { return this.materialIssueForm.get('requestMaterialToCode'); }
  get requestedDate() { return this.materialIssueForm.get('requestedDate'); }
  get requestedByCode() { return this.materialIssueForm.get('requestedByCode'); }
  get remarksCtrl() { return this.materialIssueForm.get('remarks'); }





  constructor(private bomService: BomService, private toastr: ToasterDisplayService,
    public costPriceService: CostPriceService, private materialissueService: MaterialissueService,
    private formBuilder: FormBuilder, private workCentersService: WorkCentersService,
    private manPowertoWorkCenterService: ManPowertoWorkCenterService,
    private datepipe: DatePipe, private router: Router) { }
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
    this.submitClickedMain = false;
    this.materialIssueForm = this.createMaterialIssueFormGroup();
    this.getAllItem();
    this.getAllUOM();
    this.getAllWorkCenter();
    this.getLastMaterialRequestId();
  }
  createMaterialIssueFormGroup(): FormGroup {
    return this.formBuilder.group({
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
      requestedDate: [
        new Date()
      ],
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
      status: [],
      remarks: ['', [
      Validators.maxLength(128)
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
  getAllManPowerByWorkCenterId(workCenterId) {

    this.manPowertoWorkCenterService.get(workCenterId).subscribe(result => {
      this.manPower = result;
      // console.log("manPower", result);
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
  getLastMaterialRequestId() {
    this.materialissueService.getLastMaterialRequestId().subscribe(result => {
      this.materialIssueForm.controls['materialRequestNumber'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the request number');
      });
  }
  materiaIssueRequest() {
    this.materialIssueForm.value.requestedDate = this.datepipe.transform(this.materialIssueForm.value.requestedDate, 'yyyy/MM/dd');
    this.materialIssueData = new MaterialIssue();
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
    this.materialIssueData.detailMaterialIssueDeleteList = [];
    this.submitClickedMain = true;
    if (this.materialIssueForm.valid) {
     
      this.materialissueService.add(this.materialIssueData)
        .subscribe(res => {
          if (res) {
            this.submitClickedMain = false;
            this.toastr.showSuccessMessage('Material issue request successfully!');
            this.router.navigate(['/materialissue/material-issue-container']);
          }
        });
    }
  }
  saveMaterialIssue() {
  
    this.materialIssueForm.value.requestedDate = this.datepipe.transform(this.materialIssueForm.value.requestedDate, 'yyyy/MM/dd');
    this.materialIssueData = new MaterialIssue();
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
      this.materialIssueData.detailMaterialIssueItems = this.Grid.getCurrentViewRecords();
    }
    this.materialIssueData.detailMaterialIssueDeleteList = [];
    this.submitClickedMain = true;
    if (this.materialIssueForm.valid) {
      this.materialissueService.add(this.materialIssueData)
        .subscribe(res => {
          if (res) {
            this.submitClickedMain = false;
            this.toastr.showSuccessMessage('Material Issue added successfully!');
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
    let btnObj = (args.dialog as any).btnObj[0];
   
    btnObj.disabled = !this.materialItemDetailsForm.valid;
    this.materialItemDetailsForm.statusChanges.subscribe((e)=> {
     e === 'VALID' ? btnObj.disabled = false : btnObj.disabled = true; 
    });
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.materialItemDetailsForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      // console.log(this.materialItemDetailsForm.value);

    }
  }

 

  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({ content: toolcontent });
    tooltip.appendTo(args.node);
  }
  onChangeItem(evt) {
    this.materialItemDetailsForm.patchValue({ itemCode: evt.itemData.itemCode });
    let itemNameId = evt.itemData.id;
    this.materialissueService.getUom(itemNameId).subscribe((result: any) => {
      // console.log(result);
      let uom = this.uom.find(x => x.uomCode === result.baseUomCode);
      this.materialItemDetailsForm.controls['requestedQuantityUOMCode'].setValue(result.baseUomCode);
      this.materialItemDetailsForm.controls['requestedQuantityUOMName'].setValue(uom.uomName);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch UOM Details');
      });


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
  onChangeWorkCenter(evt) {
    // console.log(evt.itemData.id);
    this.getAllManPowerByWorkCenterId(evt.itemData.id);
    this.materialIssueForm.patchValue({ workCenterName: evt.itemData.workCenterName });

  }
  onChangeRequestedBy(evt) {
    this.materialIssueForm.patchValue({ requestedBy: evt.itemData.manpowerName });
  }
  onChangeMaterialIssueFrom(evt) {
    this.materialIssueForm.patchValue({ requestMaterialFromName: evt.itemData.name });
  }
  onChangeMaterialIssueTo(evt) {
    this.materialIssueForm.patchValue({ requestMaterialToName: evt.itemData.name });
  }
  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('workCenterName', 'contains', e.text, true).or('workCenterCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.workCenter, query);
  }
  public onFilteringResItem = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('itemName', 'contains', e.text, true).or('itemCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.items, query);
  }

}

