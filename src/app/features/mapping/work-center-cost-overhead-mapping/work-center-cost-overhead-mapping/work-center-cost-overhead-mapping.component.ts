import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CommandModel, EditSettingsModel, SaveEventArgs, DialogEditEventArgs, ToolbarItems, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';

import { Query, Predicate } from '@syncfusion/ej2-data';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { WorkCenterCostOverheadMappingService } from '../work-center-cost-overhead-mapping.service';
import { CostAbsorptionToWorkCenter } from '../work-center-cost-overhead-mapping.model';
import { CostPriceComponet } from '@settings/cost-price/cost-price.model';
import { CostAbsorpationType } from 'src/app/models/common/types/costabsorpationtype';
import { enumSelector } from '@shared/utils/common.functions';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';


@Component({
  selector: 'app-work-center-cost-overhead-mapping',
  templateUrl: './work-center-cost-overhead-mapping.component.html'
})
export class WorkCenterCostOverheadMappingComponent implements OnInit {
  get cpcNameCtrl() { return this.orderForm.get('cpcName'); }
  get costAbsorpationBasisCtrl() { return this.orderForm.get('costAbsorpationBasis'); }
  get costAbsorptionRatePHour() { return this.orderForm.get('costAbsorptionRatePerHour'); }
  get descriptionCtrl() { return this.orderForm.get('description'); }

  constructor(
    private workCentersService: WorkCentersService,
    private toastr: ToasterDisplayService,
    private costPriceService: CostPriceService,
    private workCenterCostOverheadMappingService: WorkCenterCostOverheadMappingService,
    public modalService: NgbModal,
    public splitByUpperCasePipe: SplitByUpperCasePipe
  ) { }

  orderForm: FormGroup;
  costPrices: any[];
  mappedList: any[] = [];
  workCenter: any[];
  currentCenter;
  workCenterId: number;
  disableColumn: boolean;
  costAbsorptionToWorkCenter: CostAbsorptionToWorkCenter[] = [];
  cpcList: any[];
  costPrice: CostPriceComponet[] = [];
  costAbsorpationTypes = enumSelector(CostAbsorpationType);
  closeResult: string;
  showErrorMsg = false;
  workCenterName: string;
  cpcName: string;
  costAbsorpationBasis: string;
  costAbsorptionRatePerHour: number;
  currencyCode: string;
  description: string;
  isValid: boolean;
  @ViewChild('content') modelPopup: any;

  submitClicked: boolean;

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
    {
      type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' }
    }];

  public onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    let query: Query = new Query();
    query = (e.text !== '') ? query.where('cpcName', 'startswith', e.text, true) : query;
    e.updateData(this.cpcList, query);
  }

  onOptionsSelected(id) {
    this.workCenterId = id;
    this.getCostAbsorpationWorkCenter(id);
  }

  ngOnInit(): void {
    this.getAllWorkCenters();
    this.getAllcostPrice();
    this.costAbsorpationTypes = enumSelector(CostAbsorpationType);
    // this.costAbsorpationTypes.forEach(element => {
    //   if (element.text == "  Manhours") {
    //     element.text = "Man hours"
    //   }
    //   else if (element.text == "  Machinehours")
    //   element.text = "Machine hours"
    // });
  }

  public getCostAbsorptionTypeName = (field: string, data: Object, column: Object) => {
    const AbsorpationType = CostAbsorpationType;
    return this.splitByUpperCasePipe.transform(AbsorpationType[data[field]]);
  }

  getCostAbsorpationWorkCenter(id) {
    this.workCenterCostOverheadMappingService.getAll(id).subscribe(result => {
      this.costAbsorptionToWorkCenter = result;
      this.mappedList = this.costAbsorptionToWorkCenter.map(x => {

        return {
          ...x,
        };
      });
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Cost Absorption to Workcenter mapping details');
      });
  }

  getAllWorkCenters() {
    this.workCentersService.getAll().subscribe(result => {
      this.workCenter = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Workcenter Details');
      });
  }

  getAllcostPrice() {
    this.costPriceService.getAll().subscribe(result => {
      this.costPrice = result;
      this.cpcList = result.filter(x => (x.cpcType == 4));
      this.cpcList = this.cpcList.map(x => {
        return {
          cpcCode: x.cpcCode,
          value: x.id,
          text: x.cpcName,
        };
      });
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the CPC Details');
      });
  }

  open(content: any) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
      const CostAbsorptionType = this.splitByUpperCasePipe.transform(CostAbsorpationType[args.rowData['costAbsorpationBasis']]);
      // this.workCenterId = args.rowData["workCenterId"];
      this.workCenterName = this.workCenter.find(x => x.id == args.rowData['workCenterId']).workCenterName;
      this.cpcName = args.rowData['cpcName'];
      this.costAbsorpationBasis = CostAbsorptionType;
      this.costAbsorptionRatePerHour = args.rowData['costAbsorptionRatePerHour'];
      this.currencyCode = args.rowData['currencyCode'];
      this.description = args.rowData['description'];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(cost: any): FormGroup {
    return new FormGroup({
      id: new FormControl(cost.id),
      workCenterId: new FormControl(this.workCenterId, Validators.required),
      cpcCode: new FormControl(cost.cpcCode),
      cpcName: new FormControl(cost.cpcName, Validators.required),
      costAbsorpationBasis: new FormControl(cost.costAbsorpationBasis, Validators.required),
      costAbsorptionRatePerHour: new FormControl(cost.costAbsorptionRatePerHour, [Validators.required,Validators.max(999999)]),
      currencyCode: new FormControl('INR', Validators.required),
      description: new FormControl(cost.description, [Validators.maxLength(128)]),
      isValid: new FormControl(true, Validators.required)
    });
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Cost Absorption To Workcenter ' : 'Add Cost Absorption To Workcenter ';
    }
  }
  actionBegin(args: SaveEventArgs): void {
    this.disableColumn = false;
    if (args.requestType === 'add') {
      this.submitClicked = false;
      if (!this.workCenterId) {
        this.showErrorMsg = true;
      }
      this.orderForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.orderForm.valid) {
        let orderFormData;
        orderFormData = this.orderForm.value;
        orderFormData = {
          ...orderFormData,
          cpcCode: this.cpcList.find(x => x.text == orderFormData.cpcName).cpcCode,

        };
        if (orderFormData.id) {


          this.workCenterCostOverheadMappingService.update(orderFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Cost Absorption to Workcenter mapping updated successfully!');
                this.getCostAbsorpationWorkCenter(this.workCenterId);

                const workCenter = this.workCenter.find(x => x.id === orderFormData.workCenterId);
                workCenter.isAssigned = true;
                this.workCentersService.update(workCenter).subscribe(res => {
                });

                const costPriceComponent = this.costPrice.find(x => x.cpcCode === orderFormData.cpcCode);
                costPriceComponent.isAssigned = true;
                this.costPriceService.update(costPriceComponent).subscribe(res => {

                });
              }
            },
              error => {
                console.error('err', error);
                this.toastr.showErrorMessage('Unable to update the Cost Absorption to Workcenter mapping Details');
              }
            );
        } else {
          const { id, ...addFormData } = orderFormData;
          this.workCenterCostOverheadMappingService.add(addFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Cost Absorption to Workcenter mapping Details added successfully');
                this.getCostAbsorpationWorkCenter(this.workCenterId);
                const workCenter = this.workCenter.find(x => x.id === orderFormData.workCenterId);
                workCenter.isAssigned = true;
                this.workCentersService.update(workCenter).subscribe(res => {
                });

                const costPriceComponent = this.costPrice.find(x => x.cpcCode === orderFormData.cpcCode);
                costPriceComponent.isAssigned = true;
                this.costPriceService.update(costPriceComponent).subscribe(res => {

                });
              }
            },
              error => {
                console.error('err', error);
                this.toastr.showErrorMessage('Unable to add the Cost Absorption to Workcenter mapping Details');
              }
            );
        }
      } else {
        args.cancel = true;
      }
    } else if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        this.workCenterCostOverheadMappingService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Cost Absorption to Workcenter deleted successfully!');
            this.getCostAbsorpationWorkCenter(this.workCenterId);
          }
        },
          error => {
            console.error('err', error);
            this.toastr.showErrorMessage('Unable to delete the Cost Absorption to Workcenter mapping Details');
          }
        );
      }
    }
    if (args.requestType === 'beginEdit') {
      this.disableColumn = true;
      let editMappingData: any = args.rowData;
      editMappingData = {
        ...editMappingData,
        // cpcName: this.cpcList.find(x => x.cpcCode == editMappingData.cpcCode).text,
        editMappingData
        // costAbsorpationBasis: this.costAbsorpationTypes.find(y => y.value == editMappingData.costAbsorpationBasis).text
      };
      this.orderForm = this.createFormGroup(editMappingData);
    }
  }

  checkCPCDuplication(event, source) {
    if (source === 'cpcName') {
      if (this.orderForm.controls.costAbsorpationBasis.value) {
        const absorptioncontrolname = this.orderForm.controls.costAbsorpationBasis.value;

        if (this.mappedList.find(x => (x.cpcName === event.itemData.text && x.costAbsorpationBasis === absorptioncontrolname))) {
          this.toastr.showErrorMessage('Duplicate Cost absorption to Workcenter mapping');
          // this.orderForm.controls.cpcName.setValue(null);
        }
      }
    }
    if (source === 'costabsorption') {
      if (this.orderForm.controls.cpcName.value) {
        const cpccontrolname = this.orderForm.controls.cpcName.value;
        if (this.mappedList.find(x => (x.costAbsorpationBasis === event.itemData.value && x.cpcName === cpccontrolname))) {
          this.toastr.showErrorMessage('Duplicate Cost absorption to Workcenter mapping');
          // this.orderForm.controls.costAbsorpationBasis.setValue(null);
        }
      }
    }
  }

  public onFilteringWC = (e: FilteringEventArgs) => {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('workCenterName', 'contains', e.text, true).or('workCenterCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.workCenter, query);
  }
  public onFilteringItem = (e: FilteringEventArgs) => {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('text', 'contains', e.text, true).or('cpcCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.cpcList, query);
  }
}


