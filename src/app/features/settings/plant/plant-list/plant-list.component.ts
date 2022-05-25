import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnManPowerService } from '@settings/man-power/own-man-power.service';
import { Plant } from '../plant.model';
import { PlantService } from '../plant.service';
import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { forkJoin } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-plant-list',
  templateUrl: './plant-list.component.html',
})

export class PlantListComponent implements OnInit {

  branch: any;
  plantaddress: any;
  addForm: FormGroup;
  plant: Plant[] = [];
  plantManagerList: any[];
  alreadyUsed: { names: string[]; codes: string[]; } = {
    names: [],
    codes: []
  };
  plantForView: any;
  closeResult: string;
  @ViewChild('content') modelPopup: any;
  submitClicked: boolean;
  lastPlantCode: number;
  get plantCode() { return this.addForm.get('plantCode'); }
  get plantName() { return this.addForm.get('plantName'); }
  get branchId() { return this.addForm.get('branchId'); }
  get plantAddressId() { return this.addForm.get('plantAddressId'); }
  get plantManagerId() { return this.addForm.get('plantManagerId'); }
  get description() { return this.addForm.get('description'); }
  constructor(
    public plantService: PlantService,
    private toastr: ToasterDisplayService,
    private manPowerService: OwnManPowerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

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
    this.getAllBranch();
    this.getLastPlantId();
    this.getAllPlantManagers();
    forkJoin(
      [
        this.plantService.getAll(),
        this.plantService.getAllBranches(),
        this.manPowerService.getAll(),
        this.plantService.getAllPlantAddress()
      ])
      .subscribe(([plants, branches, plantmManager, plantAddress]) => {
        this.plant = plants;
        this.branch = branches;
        this.plantManagerList = plantmManager;
        this.plantaddress = plantAddress;
        this.alreadyUsed = {
          names: plants.map(data => data.plantName.toLowerCase()),
          codes: plants.map(data => data.plantCode.toLowerCase())
        };

      });
  }

  queryCellInfo(args) { // queryCellInfo event of Grid
    if (args.cell.classList.contains('e-unboundcell') && args.data.isAssigned === true) {
      args.cell.querySelector('button[title=\'Edit\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Edit\']').classList.add('e-disabled');
      args.cell.querySelector('button[title=\'Delete\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Delete\']').classList.add('e-disabled');
    }
  }

  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, () => { });
  }

  getAllBranch() {
    this.plantService.getAllBranches().subscribe(result => {
      this.branch = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Branch details');
      });
  }

  getLastPlantId() {
    this.plantService.getLastPlantId().subscribe(result => {
      this.lastPlantCode = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Quality Code');
      });
  }

  commandClick(args: CommandClickEventArgs): void {

    if (args.commandColumn.buttonOption.content == 'View') {
      this.plantForView = args.rowData;
      this.open(this.modelPopup);
    }
  }

  getAllPlantManagers() {
    this.plantService.getAllPlantAddress().subscribe(result => {
      this.plantaddress = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the plant Managers details');
      });
  }

  createFormGroup(plant: any): FormGroup {
    return this.formBuilder.group({
      id: [plant.id == null ? 0 : plant.id],
      branchId: [plant.branchId, [
        Validators.required
      ]],
      branchName: [plant.branchName],
      plantName: [plant.plantName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (plant.plantName || '').toLowerCase()))
      ]],
      plantCode: [{ value: plant.plantCode || this.lastPlantCode + 1, disabled: true }, [
        Validators.required,
        Validators.maxLength(4),
        // duplicateCodeValidator(this.alreadyUsed.codes.filter(code => code !== plant.plantCode))
      ]],
      plantAddressId: [plant.plantAddressId || null, [
        Validators.required
      ]],
      plantAddress: [plant.plantAddress || null],
      plantManagerId: [plant.plantManagerId || null, [
        Validators.required
      ]],
      plantManager: [plant.plantManager || null],
      description: [plant.description, [
        Validators.maxLength(128)
      ]],
    });
  }

  getAllPlants() {
    this.plantService.getAll().subscribe(result => {
      this.plant = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the plant details');
      });
  }

  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Plant ' : 'Add Plant';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      this.submitClicked = false;
      this.addForm = this.createFormGroup(args.rowData);
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.addForm.valid) {
        let insertdata = this.addForm.getRawValue();
        insertdata = {
          ...insertdata,
          branchName: this.branch.find(x => x.id == this.addForm.value.branchId).name,
          plantAddress: this.plantaddress.find(x => x.id == this.addForm.value.plantAddressId).addressName,
          plantManager: this.plantManagerList.find(x => x.id == this.addForm.value.plantManagerId).manpowerName,
        };
        if (!(insertdata['id'])) {
          this.plantService.add(insertdata)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Plant added successfully!');
                this.getAllPlants();

              }
            },
              error => {
                console.error('err', error);
                this.toastr.showErrorMessage('Unable to add the Plant Details');
              }
            );
        } else {
          this.plantService.update(insertdata)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Plant updated successfully!');
                this.getAllPlants();
              }
            },
              error => {
                console.error('err', error);
                this.toastr.showErrorMessage('Unable to add the Plant Details');
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
        if (row.data[0].isAssigned === false) {
          this.plantService.delete(id).subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Plant deleted successfully!');
              this.getAllPlants();
            }
          },
            error => {
              console.error('err', error);
              this.toastr.showErrorMessage('Unable to delete the Plant Details');
            }
          );
        }
      }
    }
  }
}

