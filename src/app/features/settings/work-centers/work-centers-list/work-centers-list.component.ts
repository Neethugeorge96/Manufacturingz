import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { OwnManPower } from '@settings/man-power/own-man-power';
import { OwnManPowerService } from '@settings/man-power/own-man-power.service';
import { Plant } from '@settings/plant/plant.model';
import { PlantService } from '@settings/plant/plant.service';
import { WorkCenter } from '../work-centers.model';
import { WorkCentersService } from '../work-centers.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ProductionLineService } from '@settings/production-line/production-line.service'; 
import { ProductionLine } from '@settings/production-line/production-line.model';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-work-centers-list',
  templateUrl: './work-centers-list.component.html'
})

export class WorkCentersListComponent implements OnInit {

  workCenter: WorkCenter[] = [];
  plants: any[] = [];
  manPower: OwnManPower[] = [];
  plantList: any[];
  manPowerList: any[];
  productionLines: any[] = [];
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };
  formWCCode : number;
  plantIdselect: number;
  plantName: string;
  productLine: string;
  workcenterCode: string;
  workcenterName: string;
  supervisor: string;
  remarks: string;
  closeResult: string;
 // productionLineCode: string;
  @ViewChild('content') modelPopup: any;
  public orderForm: FormGroup;

  submitClicked: boolean;
  get workCenterName() { return this.orderForm.get('workCenterName'); }
  get plantId() { return this.orderForm.get('plantId'); }
  get productionLineCode() { return this.orderForm.get('productionLineCode'); }
  get supervisorId() { return this.orderForm.get('supervisorId'); }
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
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private workCentersService: WorkCentersService,
    private plantService: PlantService,
    private manPowerService: OwnManPowerService,
    private productionLineService: ProductionLineService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getAllWorkCenters();
    this.getPlants();
    this.getManpower();
  }

  queryCellInfo(args) { //queryCellInfo event of Grid 
    if (args.cell.classList.contains("e-unboundcell") && args.data.isAssigned === true) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }

  onOptionsSelected(args) {
    this.plantIdselect = args.itemData.id;  //this.plantId
    this.getProductionLines( this.plantIdselect);
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

  getProductionLines(id) {
    this.productionLineService.getAllProductionLine(id).subscribe(result => {
      this.productionLines = result;
      console.log("Production Line", result);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Production Line Details');
      });
  }

  getManpower() {
    this.manPowerService.getAll().subscribe(result => {
      this.manPower = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Man power Details');
      });
  }

  getAllWorkCenters() {
    this.workCentersService.getAll().subscribe(result => {
      this.workCenter = result;
      this.alreadyUsed = {
        codes: result.map(center => center.workCenterCode),
        names: result.map(center => center.workCenterName.toLowerCase())
      };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Workcenter Details');
      });
  }

  getLastWorkCenterId() {
    this.workCentersService.getLastWorkCenterId().subscribe(result => {
      this.formWCCode = result + 1;
      this.orderForm.controls['workCenterCode'].setValue(result + 1);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Workcenter Code');
      });
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content == 'View') {
      this.plantName = args.rowData["plantName"];
      this.productLine = args.rowData["productionLineName"];
      this.workcenterCode = args.rowData["workCenterCode"];
      this.workcenterName = args.rowData["workCenterName"];
      this.supervisor = args.rowData["supervisor"];
      this.remarks = args.rowData["description"];
      this.open(this.modelPopup);
    }
  }

  createFormGroup(work: any): FormGroup {
    if(work){
      this.formWCCode = work.workCenterCode;
    }
    return this.formBuilder.group({
      id: [work.id == null ? 0 : work.id],
      plantId: [work.plantId,
      [Validators.required
      ]],
      plantName: [work.plantName, [
        //Validators.required
      ]],
      productionLineCode: [work.productionLineCode, [
        Validators.required,
      ]],
      workCenterCode: [{value:work.workCenterCode , disabled:true}, [
        Validators.required,
        Validators.maxLength(4),
        duplicateCodeValidator(this.alreadyUsed.codes)
      ]],
      workCenterName: [work.workCenterName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (work.workCenterName || '').toLowerCase()))
      ]],
      supervisorId: [work.supervisorId, [
        Validators.required
      ]],
      supervisor: [work.supervisor, [
        //Validators.required
      ]],
      description: [work.description, [
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
    
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Workcenter' : 'Add Workcenter';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      this.submitClicked =false
      this.getLastWorkCenterId(); 
      this.orderForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.orderForm.valid){
        let orderFormData;
      orderFormData = this.orderForm.value;
      orderFormData = {
        ...orderFormData,
        workCenterCode : this.formWCCode,
        plantName: this.plants.find(x => x.id === orderFormData.plantId).plantName,
        supervisor: this.manPower.find(x => x.id === orderFormData.supervisorId).manpowerName,
        productionLineName: this.productionLines.find(x => x.productionLineCode === orderFormData.productionLineCode).productionLineName,
        productionLineId: this.productionLines.find(x => x.productionLineCode === orderFormData.productionLineCode).id
      };
      if (orderFormData.id) {
        this.workCentersService.update(orderFormData)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Workcenter updated successfully!');
              this.productionLineService.isAssigned(orderFormData.productionLineCode, true).subscribe(result => {
              },
                error => {
                  console.error(error);
                  this.toastr.showErrorMessage('Unable to update the Production Line Details');
                });
              this.getAllWorkCenters();
              let plant = this.plants.find(x => x.id === orderFormData.plantId);
              plant.isAssigned = true;
              this.plantService.update(plant).subscribe((response : any) => {
              })
              let productionLine = this.productionLines.find(x => x.id === orderFormData.productionLineId); 
              productionLine.isAssigned = true;
              this.productionLineService.update(productionLine).subscribe((response: any) => {
              })

            } 
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to update the Workcenter Details');
            });
      }
      else {
        let { ...addFormData } = orderFormData;
        orderFormData = {
          ...orderFormData,
          plantName: this.plants.find(x => x.id === addFormData.plantId).plantName,
          supervisor: this.manPower.find(x => x.id === addFormData.supervisorId).manpowerName,
          productionLineName: this.productionLines.find(x => x.productionLineCode === orderFormData.productionLineCode).productionLineName,
          productionLineId: this.productionLines.find(x => x.productionLineCode === orderFormData.productionLineCode).id
        };
        this.workCentersService.add(orderFormData)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Workcenter added successfully!');
              this.productionLineService.isAssigned(orderFormData.productionLineCode, true).subscribe(result => {
              },
                error => {
                  console.error(error);
                  this.toastr.showErrorMessage('Unable to update the Production Line Details');
                });
              this.getAllWorkCenters();
              let plant = this.plants.find(x => x.id === addFormData.plantId);
              plant.isAssigned = true;
              this.plantService.update(plant).subscribe((response : any) => {
              })
              let productionLine = this.productionLines.find(x => x.id === addFormData.productionLineId);
              productionLine.isAssigned = true;
              this.productionLineService.update(productionLine).subscribe((response: any) => {
              })
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the Workcenter Details');
            });
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
        this.workCentersService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Workcenter deleted successfully!');
            this.getAllWorkCenters();
          }
        },
          error => {
            console.error("err", error);
            this.toastr.showErrorMessage('Unable to delete the Workcenter Details');
          });
      }
    }
    if (args.requestType === 'beginEdit') {
      let editMappingData: any = args.rowData;
      this.getProductionLines(editMappingData.plantId);
      editMappingData = {
        ...editMappingData,
      };
      console.log("afer", editMappingData);
      this.orderForm = this.createFormGroup(editMappingData);
     // this.orderForm.controls['plantId'].disable();
    }
  }
  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('plantName', 'contains', e.text, true).or('plantCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.plants, query);
  }
  public onFilteringProdLine = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('productionLineName', 'contains', e.text, true).or('productionLineCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.productionLines, query);
  }
}
