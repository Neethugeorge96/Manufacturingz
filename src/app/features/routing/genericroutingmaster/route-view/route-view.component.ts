import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { OperationService } from '../operation.service';
import { duplicateNameValidator } from '@shared/utils/validators.functions';

@Component({
  selector: 'app-route-view',
  templateUrl: './route-view.component.html',
  styles: [
  ]
})
export class RouteViewComponent implements OnInit {
  @Input() route;
  @Input() currentRoute;
  @Output() rowChanged: EventEmitter<any> = new EventEmitter();

  workCenters: any[] = [];
  mappedList: any[] = [];
  alreadyUsed: { names: string[] } = {
    names: []
  };
  fields: object = { text: 'workCenterName', value: 'id' };
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  @ViewChild('content') modelPopup: any;
  public toolbar: ToolbarItems[] = ['Add', 'Search'];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];
  operationForm: FormGroup;
  operationForView;
  lastId: number;
  submitClicked : boolean;
  get operationName() { return this.operationForm.get('operationName'); }
  get workCenterId() { return this.operationForm.get('workCenterId'); }
  

  constructor(
    private workCentersService: WorkCentersService,
    private operationService: OperationService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.workCentersService.getAll().subscribe(res => {
      this.workCenters = res.filter(center=>center.productionLineId === this.currentRoute.productionLineId);
    });
    this.getOperations();
  }
  getOperations() {
    this.operationService.getLastId().subscribe(res => {
      this.lastId = res;
    });
    this.operationService.getByRoutingCode(this.route.id).subscribe(res => {
      this.mappedList = res;
      this.alreadyUsed = {
        names: res.map(data => data.operationName.toLowerCase())
       
      };
    });
  }
  public getName = (field: string, data: object, column: object) => {
    const workCenter = this.workCenters.find(center => center.id === data[field]);
    return workCenter.workCenterName || '';
  }
  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      }, () => { });
  }
  createFormGroup(row): FormGroup {
    return this.formBuilder.group({
      id: [row.id],
      operationName: [row.operationName, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (row.operationName || '').toLowerCase()))
      ]],
      operationNumber: [{value : (row.operationNumber || this.lastId + 10), disabled:true}, [ Validators.required]],

      routingId: [this.route.id, []],
      routingCode: [this.route.routingCode, []],
      isSubcontracted: [row.isSubcontracted || false, []],
      workCenterId: [row.workCenterId, [Validators.required]],
      isOutputRequired: [row.isOutputRequired || false, []],
      batchControl: [row.batchControl || false, []],
      backflushMaterial: [row.backflushMaterial || false, []],
      isQCOperationRequired: [row.isQCOperationRequired || false, []],
      qualityControlRequired: [row.qualityControlRequired || false, []],
    });
  }
  generateNo(): any {
    return Number((Math.floor(Math.random() * 10000) + 10000).toString().substring(1))
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content === 'View') {
      const rowArgs: any = args.rowData;
      const workcenter = this.workCenters.find(workcenter => workcenter.id === rowArgs.workCenterId)
      this.operationForView = {
        ...args.rowData,
        workcenter: workcenter ? workcenter.workCenterName : ''
      };
      this.open(this.modelPopup);
    }
  }
  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      this.submitClicked = false;
      const dialog = args.dialog;
    
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Operation' : 'Add Operation';
    }
  }
  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      if (args.requestType === 'beginEdit') {
        this.operationForm = this.createFormGroup(args.rowData);
      } else {
        this.operationForm = this.createFormGroup(args.rowData);
      }

    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.operationForm.valid){
        const operation: any = this.operationForm.getRawValue();
      if (operation.id) {
        this.operationService.update(operation).subscribe(res => {
          if (res) {
            this.getOperations();
            this.toastr.showSuccessMessage('Operation updated Successfully');
            this.rowChanged.emit({
              event: 'update', object: {
                pid: `RO${this.route.id}`,
                listId: `OP${operation.id}`,
                name: operation.operationName,
                hasChild: true,
              }
            });
          }
        });
      } else {
        const { id, ...operationData } = operation;
        this.operationService.add(operationData).subscribe(res => {
          if (res) {
            this.getOperations();
            this.toastr.showSuccessMessage('Operation added to Route Successfully');
            this.rowChanged.emit({
              event: 'add', object: {
                pid: `RO${this.route.id}`,
                listId: `OP${operation.id}`,
                name: operation.operationName,
                hasChild: true,
              }
            });
          }
        });
      }
      }
      else{
        args.cancel = true;
      }
      
    }
    else if (args.requestType === 'delete') {
      const operation: any = args.data[0];
      const { id, ...operationData } = operation;
      this.operationService.delete(id).subscribe(res => {
        if (res) {
          this.getOperations();
          this.rowChanged.emit({
            event: 'update', object: {
              pid: `RO${this.route.id}`,
              listId: `OP${operation.id}`,
              name: operation.operationName,
              hasChild: true,
            }
          });
          this.toastr.showSuccessMessage('Operation deleted Successfully');
        }
      });
    }

  }



}
