import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandModel, EditSettingsModel, SaveEventArgs, DialogEditEventArgs, ToolbarItems, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { Plant } from '@settings/plant/plant.model';
import { PlantService } from '@settings/plant/plant.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { forkJoin } from 'rxjs';
import { MachineWorkCenterService } from '../machine-work-center.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CostPriceService } from '@settings/cost-price/cost-price.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';

@Component({
  selector: 'app-machine-work-center',
  templateUrl: './machine-work-center.component.html',
  styles: [
  ]
})
export class MachineWorkCenterComponent implements OnInit {

  orderForm: FormGroup;
  machines: any[];
  costPrices: any[];
  fields: object = { text: 'text', value: 'value' };
  machineToWorkCenters: any[];
  mappedList: any[] = [];
  closeResult: string;
  showErrorMsg = false;
  workCenterName: string;
  machineName: string;
  // costRatePerHour: number;
  cpcName: string;
  description: string;
  currentCenter;
  @ViewChild('content') modelPopup: any;

  get machineId() { return this.orderForm.get('machineId'); }
  get costRatePerHour() { return this.orderForm.get('costRatePerHour'); }
  get cPCCode() { return this.orderForm.get('cPCCode'); }
  get descriptionCtrl() { return this.orderForm.get('description'); }
  submitClicked: boolean;
  dataForView: any;

  constructor(
    private plantService: PlantService,
    private workCentersService: WorkCentersService,
    private machineWorkCenterService: MachineWorkCenterService,
    private toastr: ToasterDisplayService,
    private costPriceService: CostPriceService,
    public modalService: NgbModal,
  ) { }

  plants: Plant[];
  workCenters: any[];
  centersInPlant: WorkCenter[] = [];
  currencies: any[] = [];
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

  ngOnInit(): void {
    forkJoin(
      [
        this.plantService.getAll(),
        this.workCentersService.getAll(),
        this.costPriceService.getAll(),
        this.machineWorkCenterService.getAllCurrencies(),
        this.machineWorkCenterService.getAll(),
        this.machineWorkCenterService.getMachines()
      ])
      .subscribe(([plants, workCenters, costPrices, currencies, machineToWorkCenter, machines]) => {
        this.plants = plants;
        this.workCenters = workCenters;
        this.costPrices = costPrices.filter(x => x.cpcType === 3);
        this.costPrices = this.costPrices.map(costPrice => {
          return {
            ...costPrice,
            text: costPrice.cpcName,
            value: costPrice.id
          };
        });
        this.currencies = currencies;
        this.machineToWorkCenters = machineToWorkCenter;
        this.machines = machines;
      });
  }

  centerSelected(event) {
    const selectedcenter = this.workCenters.find(center => center.id === this.currentCenter);
    this.mappedList = this.machineToWorkCenters.filter(mapping => mapping.workCenterId === this.currentCenter);
  }

  getMappedData() {
    this.machineWorkCenterService.getAll().subscribe(res => {
      if (this.currentCenter) {
        this.mappedList = res.filter(mapping => mapping.workCenterId === this.currentCenter);
      }
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
      this.workCenterName = this.workCenters.find(x => x.id == args.rowData['workCenterId']).workCenterName;
      this.machineName = args.rowData['machineName'];
      // this.costRatePerHour = args.rowData["costRatePerHour"];
      this.cpcName = args.rowData['cpcName'];
      this.description = args.rowData['description'];
      this.dataForView = args.rowData;
      this.open(this.modelPopup);
    }
  }

  createFormGroup(data1: any): FormGroup {
    return new FormGroup({
      id: new FormControl(data1.id),
      workCenterId: new FormControl(this.currentCenter),
      isValid: new FormControl(true),
      machineId: new FormControl(data1.machineId, Validators.required),
      costRatePerHour: new FormControl(data1.costRatePerHour, [Validators.required, Validators.max(999999)]),
      currencyCode: new FormControl('INR'),
      cPCCode: new FormControl(data1.cpcName, Validators.required),
      description: new FormControl(data1.description, Validators.maxLength(128))
    });
  }

  clickHandler(args: DialogEditEventArgs) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
    }

  }
  actionComplete(args: DialogEditEventArgs) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      this.submitClicked = false;
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Machine To Workcenter' : 'Add Machine To Workcenter';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      this.submitClicked = false;
    }
    if (args.requestType === 'beginEdit') {
      const data: any = args.rowData;
      const machine = this.machines.find(machine => machine.itemCode === data.machineId);
      const formData = {
        ...data,
        machineId: `${machine.itemCommodityName}-${machine.itemCode}`
      };
      this.orderForm = this.createFormGroup(formData);
    } else if (args.requestType === 'add') {
      this.orderForm = this.createFormGroup(args.rowData);
    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.orderForm.valid) {
        let mapping = this.orderForm.value;
        const selectedMachine = this.machines.find(machine => machine.text === mapping.machineId);
        const cpc = this.costPrices.find(costPrice => costPrice.cpcName === mapping.cPCCode);
        mapping = {
          ...mapping,
          machineName: selectedMachine.itemCommodityName,
          machineId: selectedMachine.itemCode,
          cPCCode: cpc.cpcCode,
          cPCName: cpc.cpcName,
        };
        if (mapping.id) {
          this.machineWorkCenterService.update(mapping).subscribe(res => {
            if (res) {
              this.getMappedData();
              this.toastr.showSuccessMessage('Machine to workcenter mapping updated successfully!');

              const workCenter = this.workCenters.find(x => x.id === mapping.workCenterId);
              workCenter.isAssigned = true;
              this.workCentersService.update(workCenter).subscribe(res => {
              });

              const costPriceComponent = this.costPrices.find(x => x.cpcCode === mapping.cPCCode);
              costPriceComponent.isAssigned = true;
              this.costPriceService.update(costPriceComponent).subscribe(res => {

              });
            }
          },
            error => {
              console.error('err', error);
              this.toastr.showErrorMessage('Unable to update the Machine to workcenter mapping Details');
            }
          );

        } else {
          delete mapping.id;
          this.machineWorkCenterService.add(mapping).subscribe(res => {
            if (res) {
              this.getMappedData();

              this.toastr.showSuccessMessage('Machine Added to workcenter successfully!');
              const workCenter = this.workCenters.find(x => x.id === mapping.workCenterId);
              workCenter.isAssigned = true;
              this.workCentersService.update(workCenter).subscribe(res => {
              });

              const costPriceComponent = this.costPrices.find(x => x.cpcCode === mapping.cPCCode);
              costPriceComponent.isAssigned = true;
              this.costPriceService.update(costPriceComponent).subscribe(res => {

              });
            }
          },
            error => {
              console.error('err', error);
              this.toastr.showErrorMessage('Unable to add the Machine to workcenter mapping Details');
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
        this.machineWorkCenterService.delete(id).subscribe(res => {
          if (res) {
            this.getMappedData();
            this.toastr.showSuccessMessage('Machine deleted from workcenter successfully!');
          }
        },
          error => {
            console.error('err', error);
            this.toastr.showErrorMessage('Unable to delete the Machine to workcenter mapping Details');
          }
        );
      }
    }
  }

  checkCPCDuplication(event, source) {
    if (source === 'machine') {
      if (this.orderForm.controls.cPCCode.value) {
        const cpcName = this.orderForm.controls.cPCCode.value;
        if (this.mappedList.find(x => x.machineId === event.itemData.itemCode && x.cpcName === cpcName)) {
          this.toastr.showErrorMessage('Duplicate Machine to workcenter mapping');
          this.orderForm.controls.machineId.setValue(null);
        }
      }
    }
    if (source === 'cpcName') {
      if (this.orderForm.controls.machineId.value) {
        const machineText = this.orderForm.controls.machineId.value;
        const machine = this.machines.find(machine => machine.text === machineText);
        if (this.mappedList.find(x => x.machineId === machine.itemCode && x.cpcName === event.itemData.cpcName)) {
          this.toastr.showErrorMessage('Duplicate Machine to workcenter mapping');
          this.orderForm.controls.cPCCode.setValue(null);
        }
      }
    }
  }

  public onFilteringWC = (e: FilteringEventArgs) => {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('workCenterName', 'contains', e.text, true).or('workCenterCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.workCenters, query);
  }

  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('cpcName', 'contains', e.text, true).or('cpcCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.costPrices, query);
  }

  public onFilteringResMachine = (e: FilteringEventArgs) => {
    let query = new Query();
    const predicateQuery = query.where(new Predicate('itemCommodityName', 'contains', e.text, true).or('itemCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.machines, query);
  }

}
