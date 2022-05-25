import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CostPriceComponet } from '@settings/cost-price/cost-price.model';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { ManPowerCategory } from '../man-power-category.model';
import { ManPowerCategoryService } from '../man-power-category.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';

import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { forkJoin } from 'rxjs';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-man-power-category-list',
  templateUrl: './man-power-category-list.component.html'
}) 
export class ManPowerCategoryListComponent implements OnInit {

  manPowerCategory: ManPowerCategory[] = [];
  costPriceComponent: any[] = [];
  cpcList: any;
  currencyList: any;

  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };
  formmanpowerCateCode : number;
  categoryCode: string;
  categoryNameView: string;
  currency: string;
  costRate: string;
  cpc: string;
  remarks: string;
  closeResult: string;
  @ViewChild('content') modelPopup: any;
  public orderForm: FormGroup;


  submitClicked: boolean;
  get categoryName() { return this.orderForm.get('categoryName'); }
  get costRatePerHour() { return this.orderForm.get('costRatePerHour'); }
  get costComponentId() { return this.orderForm.get('costComponentId'); }
  get description() { return this.orderForm.get('description'); }
 
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
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];

  constructor(
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private manPowerCategoryService: ManPowerCategoryService,
    private costPriceService: CostPriceService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    forkJoin(
      [this.costPriceService.getAll(),
      this.manPowerCategoryService.getAll(),
      this.manPowerCategoryService.getAllCurrency(),
      ])
      .subscribe(([costPrice, manPowerC, currency]) => {
        this.costPriceComponent = costPrice;
        this.costPriceComponent = costPrice.filter(x => x.cpcType === 1) // cpc
        this.manPowerCategory = manPowerC;
        this.currencyList = currency;
       
      });
  }

  queryCellInfo(args) { //queryCellInfo event of Grid 
    if (args.cell.classList.contains("e-unboundcell") && args.data.isAssigned === true) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
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

  getAllManPowerCategory() {
    this.manPowerCategoryService.getAll().subscribe(result => {
      this.manPowerCategory = result;
      this.alreadyUsed = {
        names: result.map(category => category.categoryName.toLowerCase()),
        codes: result.map(category => category.categoryCode.toLowerCase())
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the ManPower Category Details');
      });
  }

  getLastmanpowerCategoryId() {
    this.manPowerCategoryService.getLastManpowerCategoryId().subscribe(result => {
      this.formmanpowerCateCode = result + 1;
      this.orderForm.controls['categoryCode'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Manpower Category Code');
      });
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content == 'View') {
      this.categoryCode = args.rowData["categoryCode"];
      this. categoryNameView = args.rowData["categoryName"];
      this.currency = args.rowData["currencyCode"];
      this.costRate = args.rowData["costRatePerHour"];
      this.cpc = this.costPriceComponent.find(x => x.id == args.rowData["costComponentId"]).cpcName;
      this.remarks = args.rowData["description"];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(category: any): FormGroup {

    if(category){
      this.formmanpowerCateCode = category.categoryCode;
    }
    return this.formBuilder.group({
      id: [category.id == null ? 0 : category.id],
      categoryCode: [{value:category.categoryCode , disabled:true}, [
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]],
      categoryName: [category.categoryName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (category.categoryName || '').toLowerCase()))
      ]],
      costRatePerHour: [category.costRatePerHour, [
        Validators.required
      ]],
      // currencyId: [category.currencyId, [
      //   Validators.required
      // ]],
      currencyCode: ["INR"],
      costComponentId: [category.costComponentId, [
        Validators.required
      ]],
      costPriceComponent: [category.costPriceComponent, [
        // Validators.required
      ]],
      description: [category.description, [
       
        Validators.maxLength(128),
      ]],
      isAssigned: [false]
    });
  }

  actionComplete(args) {
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      const dialog = args.dialog;
     
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Manpower Category'  : 'Add Manpower Category';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.getLastmanpowerCategoryId();
      this.orderForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
  
      if(this.orderForm.valid){

        let orderFormData;
        orderFormData = this.orderForm.value;
        orderFormData = {
          ...orderFormData,
          categoryCode : this.formmanpowerCateCode,
          costPriceComponent: this.costPriceComponent.find(x => x.id == orderFormData.costComponentId).cpcName,
          // currencyCode: this.currencyList.find(x => x.id == orderFormData.currencyId).code
        }
        if (orderFormData.id) {
          this.manPowerCategoryService.update(orderFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Manpower Category updated successfully!');
                this.getAllManPowerCategory();
                let cpc = this.costPriceComponent.find(x=>x.id === orderFormData.costComponentId )
                cpc.isAssigned = true;
                
                this.costPriceService.update(cpc).subscribe(res=>{
                  
                })
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to update the Manpower Category Details');
              }
            );
  
        }
        else {
          let { ...addFormData } = orderFormData;
          orderFormData = {
            ...orderFormData,
            costPriceComponent: this.costPriceComponent.find(x => x.id == addFormData.costComponentId).cpcName,
            // currencyCode: this.currencyList.find(x => x.id == addFormData.currencyId).code
          }
          this.manPowerCategoryService.add(orderFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Manpower Category added successfully!');
                this.getAllManPowerCategory();
  
                let cpc = this.costPriceComponent.find(x=>x.id === orderFormData.costComponentId )
                cpc.isAssigned = true;
                
                this.costPriceService.update(cpc).subscribe(res=>{
                 
                })
  
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the Manpower Category Details');
              }
            );
        }
      }
      else {
        args.cancel = true;
      }
      
    }
    else if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        this.manPowerCategoryService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Manpower Category deleted successfully!');
            this.getAllManPowerCategory();
          }
        },
          error => {
            console.error("err", error);
            this.toastr.showErrorMessage('Unable to add the Manpower Category Details');
          }
        );

      }
    }
    if (args.requestType === 'beginEdit') {
      let editMappingData: any = args.rowData
      editMappingData = {
        ...editMappingData,
      };
      this.orderForm = this.createFormGroup(editMappingData);
    }
  }
  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('cpcName', 'contains', e.text, true).or('cpcCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.costPriceComponent, query);
  }
}