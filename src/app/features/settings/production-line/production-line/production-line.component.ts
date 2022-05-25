import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Plant } from '@settings/plant/plant.model';
import { PlantService } from '@settings/plant/plant.service';
import { ProductionLine } from '../production-line.model';
import { ProductionLineService } from '../production-line.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data'; 
@Component({
  selector: 'app-production-line',
  templateUrl: './production-line.component.html'
})
export class ProductionLineComponent implements OnInit {

  productionLine: ProductionLine[] = [];
  plants: any[] = [];
  plantList: any[];
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };
  public orderForm: FormGroup;

  formProdLineCode : number;
  plantName: string;
  productionLineNameview: string;
  productionLineCode: string;
  Remarks: string;
  closeResult: string;
  @ViewChild('content') modelPopup: any;

  submitClicked: boolean;
  get productionLineName() { return this.orderForm.get('productionLineName'); }
  get plantId() { return this.orderForm.get('plantId'); }
  get remarks() { return this.orderForm.get('remarks'); }
 

  
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
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private productionLineService: ProductionLineService,
    private plantService: PlantService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getAllProductionLines();
    this.getPlants();

  }

  queryCellInfo(args) { //queryCellInfo event of Grid 
    if (args.cell.classList.contains("e-unboundcell") && args.data.isAssigned === true) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }

  open(content) {
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

  getPlants() {
    this.plantService.getAll().subscribe(result => {
      this.plants = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Plant Details');
      });
  }

  getAllProductionLines() {
    this.productionLineService.getAll().subscribe(result => {
      this.productionLine = result;
      this.alreadyUsed = {
        codes: result.map(center => center.productionLineCode.toLowerCase()),
        names: result.map(center => center.productionLineName.toLowerCase())
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the production line Details');
      });
  }

  getLastProductionLineId() {
    this.productionLineService.getLastPrductionLineId().subscribe(result => {
      this.formProdLineCode = result + 1;
      this.orderForm.controls['productionLineCode'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the id');
      });
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content == 'View') {
      this.plantName = args.rowData["plantName"];
      this.productionLineNameview = args.rowData["productionLineName"];
      this.productionLineCode = args.rowData["productionLineCode"];
      this.Remarks = args.rowData["remarks"];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(production: any): FormGroup {

    if(production){
      this.formProdLineCode = production.productionLineCode;
    }
    return this.formBuilder.group({
      id: [production.id == null ? 0 : production.id],
      plantId: [production.plantId,
      [Validators.required
      ]],
      plantName: [production.plantName, [
        //Validators.required
      ]],
      productionLineCode: [{value:production.productionLineCode, disabled:true}, [
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]],
      productionLineName: [production.productionLineName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (production.productionLineName || '').toLowerCase()))
      ]],
      remarks: [production.remarks, [
        Validators.maxLength(128),
      ]],
      isValid: [false, [
        Validators.required
      ]]
    });
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Production Line'  : 'Add Production Line';
    }
  }

  actionBegin(args: SaveEventArgs): void {    
    if (args.requestType === 'add') {
      this.submitClicked = false;
      this.orderForm = this.createFormGroup(args.rowData);
      this.getLastProductionLineId();
    }
    if (args.requestType === 'save') {
      this.submitClicked= true;
      if(this.orderForm.valid){
        let orderFormData;
      orderFormData = this.orderForm.value;
      orderFormData = {
        ...orderFormData,
        productionLineCode : this.formProdLineCode,
        plantName: this.plants.find(x => x.id === orderFormData.plantId).plantName
      };
      if (orderFormData.id) {       
        if (args.rowData['isAssigned'] === false) {
          this.productionLineService.update(orderFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Production Line updated successfully!');
                this.getAllProductionLines();                
                let plant = this.plants.find(x=>x.id === orderFormData.plantId)
              plant.isAssigned = true;
              this.plantService.update(plant).subscribe((response : any) => {
               
              })
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to update the production line details');
              }
            );
        }
        else {
          this.toastr.showErrorMessage('Unable to update the production line details which is assigned to Workcenter');
        }
      }
      else {
        let { ...addFormData } = orderFormData;
        orderFormData = {
          ...orderFormData,
          plantName: this.plants.find(x => x.id === addFormData.plantId).plantName
        };
        this.productionLineService.add(orderFormData)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Production Line added successfully!');
              this.getAllProductionLines();
              let plant = this.plants.find(x=>x.id === orderFormData.plantId)
              plant.isAssigned = true;
              this.plantService.update(plant).subscribe((response : any) => {
                
              })

            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the production line Details');
            }

          );
      }
      }
      else{
        args.cancel = true;
      }
      
    }
    else if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        if (row.data[0].isAssigned === false) {
          this.productionLineService.delete(id).subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Production Line deleted successfully!');
              this.getAllProductionLines();
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to delete the production line Details');
            }

          );
        }
        else {
          this.toastr.showErrorMessage('Unable to delete the production line details which is assigned to Workcenter');
        }
      }
    }
    if (args.requestType === 'beginEdit') {
      let editMappingData: any = args.rowData;
      editMappingData = {
        ...editMappingData,
      };
      this.orderForm = this.createFormGroup(editMappingData);
    }
  }
  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('plantName', 'contains', e.text, true).or('plantCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.plants, query);
  }
}
