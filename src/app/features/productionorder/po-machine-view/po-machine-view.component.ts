import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MachineWorkCenterService } from '@features/mapping/machine-work-center-mapping/machine-work-center.service';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs } from '@syncfusion/ej2-angular-grids';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { POMachineService } from '../po-machine.service';
import { ProductionorderService } from '../productionorder.service';

@Component({
  selector: 'app-po-machine-view',
  templateUrl: './po-machine-view.component.html',
  styles: [
  ]
})
export class POMachineViewComponent implements OnInit, OnChanges {

  @Input() task;
  @Input() routeData;
  @Input() operation;
  machines: any[] = [];
  fields: object = { text: 'machineName', value: 'machineId' };
  mappedList: any[] = [];
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [{ type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
  { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
  { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
  { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  machineForm: FormGroup;
  submitClicked: boolean;
  get machineCode() { return this.machineForm.get('machineCode'); }

  constructor(
    private pOMachineService: POMachineService,
    private productionorderService: ProductionorderService,
    private machineWorkCenterService: MachineWorkCenterService,
    private toastr: ToasterDisplayService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder

  ) { }
  ngAfterContentInit(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.getAllMachines();
    // this.getMachinesForTask();
    this.mappedList = this.routeData.map(machine => {
      return {
        ...machine,
        text: `${machine.machineName}-${machine.machineCode}`,
        value: machine.id
      }
    });
    this.getAllMachines();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      this.getMachinesForTask();
    }
    this.changeDetector.detectChanges();
  }
  getMachinesForTask() {
    this.productionorderService.getTaskDetails(this.task.id).subscribe(res => {
      this.mappedList = res.plannedPOMachineCollection;
    });
  }
  getAllMachines() {
    this.machineWorkCenterService.getAll()
      .subscribe(res => {
        this.machines = res.filter(machines => machines.workCenterId === this.operation.workCenterId);
      });
  }
  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Machine' : 'Add Machine';
    }
  }
  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.machineForm = this.createFormGroup(args.rowData);
      this.machineForm.valueChanges.subscribe(res => {
        const selectedMachine = this.machines.find(machine => machine.machineId === res.machineCode.substr(res.machineCode.lastIndexOf('-') + 1));
        this.machineForm.patchValue({
          machineName: selectedMachine.machineName,
          costRatePerHour: selectedMachine.costRatePerHour,
          currencyCode: selectedMachine.currencyCode

        }, { emitEvent: false });
      });


    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.machineForm.valid){
        const machine: any = {
          ...this.machineForm.getRawValue(),
          machineCode: this.machineForm.getRawValue().machineCode.substr(this.machineForm.getRawValue().machineCode.lastIndexOf('-') + 1)
        };
        if (machine.id) {
          this.pOMachineService.update(machine).subscribe(res => {
            if (res) {
              this.getMachinesForTask();
              this.toastr.showSuccessMessage('Machine updated Successfully');
            }
          });
        } else {
          const { id, ...machineData } = machine;

          this.pOMachineService.add(machineData)
            .subscribe(res => {
              if (res) {
                this.getMachinesForTask();
                this.toastr.showSuccessMessage('Machine added to task Successfully');
              }
            });
        }
      }
      else{
        args.cancel = true;
      }
      
    } else if (args.requestType === 'delete') {
      const machine: any = args.data[0];
      const { id, ...machineData } = machine;
      this.pOMachineService.delete(id).subscribe(res => {
        if (res) {
          this.getMachinesForTask();
          this.toastr.showSuccessMessage('Machine deleted Successfully');
        }
      });
    }
  }
  createFormGroup(row: any): FormGroup {
    const machineSelected = this.machines.find(machine => row.machineCode === machine.machineId);
    return this.formBuilder.group({
      id: [row.id],
      plannedPOTaskId: [this.task.id, [
        Validators.required,
        // duplicateNameValidator(this.leaveComponentNames)
      ]],
      batchNumber: [this.task.batchNumber, [
        Validators.required,
      ]],
      machineCode: [machineSelected ? machineSelected.text : '', [
        Validators.required
      ]],
      machineName: [{ value: row.machineName, disabled: true }, [Validators.required]],
      costRatePerHour: [{ value: row.costRatePerHour, disabled: true }, [Validators.required]],
      currencyCode: [{ value: row.currencyCode, disabled: true }, [Validators.required]]

    });
  }

  checkDuplication(event){
    if(event){
      let machineId = event.itemData.machineId;
      this.mappedList.filter(x => {
        if(x.machineCode === machineId){
          this.toastr.showErrorMessage('Cannot able to add duplicate Machine.');
          this.machineForm.controls['machineCode'].setValue(null);
        }
      })

      
    }
  }


}
