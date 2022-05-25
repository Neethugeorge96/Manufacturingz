import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { duplicateNameValidator } from '@shared/utils/validators.functions';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-operation-view',
  templateUrl: './operation-view.component.html',
  styles: [
  ]
})
export class OperationViewComponent implements OnInit, OnChanges {
  @Input() operation;
  @Input() costToTask;
  @Output() rowChanged: EventEmitter<any> = new EventEmitter();
  tasks: any[] = [];

  alreadyUsed: { names: string[]} = {
    names: []
  };
  mappedList: any[] = [];
  fields: object = { text: 'taskName', value: 'id' };
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
  taskForm: FormGroup;
  taskForView;
  @ViewChild('content') modelPopup: any;
  lastTaskId: number;
  
  submitClicked: boolean;

  get taskName() { return this.taskForm.get('taskName'); }
  get relatedTaskId() { return this.taskForm.get('relatedTaskId'); }
  constructor(
    private taskService: TaskService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getTasksByOperation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.operation.previousValue && changes.operation.currentValue.id !== changes.operation.previousValue.id) {
      this.getTasksByOperation();
    }
  }
  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      }, () => { });
  }
  getTasksByOperation() {
    this.taskService.getLastTaskId().subscribe(res => {
      this.lastTaskId = res;
    });
    this.taskService.getTasksByOperation(this.operation.id).subscribe(res => {
      this.mappedList = res.map(task => {
        return {
          ...task,
          cost: this.costToTask[task.id] || 0
        };
      });
      this.alreadyUsed = {
        names: res.map(data => data.taskName.toLowerCase())
       
      };
    });
  }
  public getName = (field: string, data: any, column: object) => {
    if (data.isRelatedTask) {
      const selectedtask = this.tasks.find(task => task.id === data[field]);
      return selectedtask.taskName;
    }
    return '--';
  }
  createFormGroup(row): FormGroup {
    return this.formBuilder.group({
      id: [row.id],
      taskCode: [{ value: this.lastTaskId + 1, disabled: true }, [
        Validators.required,
        // duplicateNameValidator(this.leaveComponentNames)
      ]],
      taskName: [row.taskName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (row.taskName || '').toLowerCase()))
      ]],
      costPerHour: [row.costPerHour || 0,],
      description: [row.description],
      operationNumber: [this.operation.operationNumber, []],
      operationId: [this.operation.id, []],
      isRelatedTask: [row.isRelatedTask || false, []],
      relatedTaskId: [Number(row.relatedTaskId) || 0],
      qualityControlRequired: [row.qualityControlRequired || false, []]

    });
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content === 'View') {
      const rowArgs: any = args.rowData;
      const relatedTask = this.tasks.find(task => task.id === Number(rowArgs.relatedTaskId))
      this.taskForView = {
        ...args.rowData,
        relatedTask: relatedTask ? relatedTask.taskName : ''
        // workcenter: workcenter ? workcenter.workCenterName : ''
      };
      this.open(this.modelPopup);
    }
  }
  actionComplete(args: DialogEditEventArgs): void {

    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;

      dialog.header = args.requestType === 'beginEdit' ? 'Edit Task' : 'Add Task';
    }

  }
  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked = false
      this.taskForm = this.createFormGroup(args.rowData);
      this.tasks = this.mappedList.filter(task => task.id !== actionArgs.rowData.id)

    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.taskForm.valid){
        const task: any = this.taskForm.getRawValue();
      if (task.id) {
        this.taskService.update({
          ...task,
          relatedTaskId: Number(task.relatedTaskId)
        }).subscribe(res => {
          if (res) {
            this.getTasksByOperation();
            this.toastr.showSuccessMessage('Task updated Successfully');
            this.rowChanged.emit({
              eventOn: 'OP', object: {
                pid: `OP${this.operation.id}`,
                listId: `OP${this.operation.id}`,
                selected: `OP${this.operation.id}`
              }
            });
          }
        });
      } else {
        const { id, ...taskData } = task;
        this.taskService.add(
          {
            ...taskData,
            relatedTaskId: Number(taskData.relatedTaskId)
          })
          .subscribe((res: any) => {
            if (res) {
              this.toastr.showSuccessMessage('Task added to operation Successfully');
              this.getTasksByOperation();
              this.rowChanged.emit({
                eventOn: 'OP', object: {
                  pid: `OP${this.operation.id}`,
                  listId: `OP${this.operation.id}`,
                  selected: `OP${this.operation.id}`
                }
              });
            }
          });
      }
      }
      else{
        args.cancel = true;
      }
      
    } else if (args.requestType === 'delete') {
      const task: any = args.data[0];
      const { id, ...taskData } = task;
      this.taskService.delete(id).subscribe(res => {
        if (res) {
          this.getTasksByOperation();
          this.rowChanged.emit({
            eventOn: 'OP', object: {
              pid: `OP${this.operation.id}`,
              listId: `OP${this.operation.id}`,
              selected: `OP${this.operation.id}`
            }
          });
          this.toastr.showSuccessMessage('Task deleted Successfully');
        }
      });
    }
  }

}
