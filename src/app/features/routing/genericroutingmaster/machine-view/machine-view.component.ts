import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MachineWorkCenterService } from '@features/mapping/machine-work-center-mapping/machine-work-center.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { MachineToTaskService } from '../machine-to-task.service';

@Component({
  selector: 'app-machine-view',
  templateUrl: './machine-view.component.html',
  styles: [
  ]
})
export class MachineViewComponent implements OnInit, OnChanges, AfterContentInit {

  taskId: number;
  taskCode:string;
  //machineId: string;
  machineName: string;
  costRatePerHour: number;
  currencyCode: string;
 

  @Input() task;
  @Input() operation;
  @Output() rowChanged: EventEmitter<any> = new EventEmitter();
  closeResult: string;
  @ViewChild('content') modelPopup: any;
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
  public commands: CommandModel[] = [
  { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
  { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
  { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
  { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
  { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  machineForm: FormGroup;

  submitClicked: boolean;
  get machineId() { return this.machineForm.get('machineId'); }

  constructor(
    private machineToTaskService: MachineToTaskService,
    private machineWorkCenterService: MachineWorkCenterService,
    private toastr: ToasterDisplayService,
    private changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
  ) { }
  ngAfterContentInit(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit(): void {
    this.getAllMachines();
    this.getMachinesForTask();
    this.getAllMachines();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      this.getMachinesForTask();
    }
    this.changeDetector.detectChanges();
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
    console.log(args.rowData);
    if (args.commandColumn.buttonOption.content == 'View') {
      this.taskCode = args.rowData["taskCode"];
      this.machineName = args.rowData["machineName"];
      this.costRatePerHour = args.rowData["costRatePerHour"];
      this.currencyCode = args.rowData["currencyCode"];
      this.open(this.modelPopup);
    }
  }

  getMachinesForTask() {
    this.machineToTaskService.getByTask(this.task.id).subscribe(res => {
      this.mappedList = res;
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
        const selectedMachine = this.machines.find(machine => machine.machineId === res.machineId.substr(res.machineId.lastIndexOf('-') + 1));
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
          machineId: this.machineForm.getRawValue().machineId.substr(this.machineForm.getRawValue().machineId.lastIndexOf('-') + 1)
        };
        if (machine.id) {
          this.machineToTaskService.update(machine).subscribe(res => {
            if (res) {
              this.getMachinesForTask();
              this.rowChanged.emit({
                eventOn: 'MC', object: {
                  pid: `TA${this.task.id}`,
                  listId: `TA${this.task.id}`,
                  selected: `MC${this.task.id}`
                }
              });
              this.toastr.showSuccessMessage('Machine updated Successfully');
            }
          });
        } else {
          const { id, ...machineData } = machine;
          const duplicateEoc = this.mappedList.filter(x =>
            x.taskId === machine.taskId &&
            x.taskCode === machine.taskCode &&
            x.machineId === machine.machineId &&
            x.machineName === machine.machineName &&
            x.costRatePerHour == machine.costRatePerHour &&
            x.currencyCode === machine.currencyCode 
          )
          if (duplicateEoc.length === 0) {
            this.machineToTaskService.add(machineData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Machine added to task Successfully');
                this.getMachinesForTask();
                this.rowChanged.emit({
                  eventOn: 'MC', object: {
                    pid: `TA${this.task.id}`,
                    listId: `TA${this.task.id}`,
                    selected: `MC${this.task.id}`
                  }
                });
              }
            },
              error => {
                console.error("err", error);
                this.toastr.showErrorMessage('Unable to add the Machine Details');
            });
          }
          else {
            this.toastr.showErrorMessage('Cannot add duplicate Machine Details');
            this.getMachinesForTask();
          }
        }
      }
      else{
        args.cancel= true;
      }
       
    } else if (args.requestType === 'delete') {
      const machine: any = args.data[0];
      const { id, ...machineData } = machine;
      this.machineToTaskService.delete(id).subscribe(res => {
        if (res) {
          this.getMachinesForTask();
          this.rowChanged.emit({
            eventOn: 'MC', object: {
              pid: `TA${this.task.id}`,
              listId: `TA${this.task.id}`,
              selected: `MC${this.task.id}`
            }
          });
          this.toastr.showSuccessMessage('Machine deleted Successfully');
        }
      });
    }
  }
  createFormGroup(row: any): FormGroup {
    const machineSelected = this.machines.find(machine => row.machineId === machine.machineId);
    return this.formBuilder.group({
      id: [row.id],
      taskId: [this.task.id, [
        Validators.required,
        // duplicateNameValidator(this.leaveComponentNames)
      ]],
      taskCode: [this.task.taskCode, [
        Validators.required,
      ]],
      machineId: [machineSelected ? machineSelected.text : '', [
        Validators.required
      ]],
      machineName: [{ value: row.machineName, disabled: true }, [Validators.required]],
      costRatePerHour: [{ value: row.costRatePerHour, disabled: true }, [Validators.required]],
      currencyCode: [{ value: row.currencyCode, disabled: true }, [Validators.required]]

    });
  }

}
