import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { duplicateNameValidator } from '@shared/utils/validators.functions';
import { EditSettingsModel, ToolbarItems, CommandModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { POCheckListService } from '../po-check-list.service';
import { ProductionorderService } from '../productionorder.service';

@Component({
  selector: 'app-po-checklist-view',
  templateUrl: './po-checklist-view.component.html',
  styles: [
  ]
})
export class POChecklistViewComponent implements OnInit {
  @Input() routeData;
  @Input() task;
  mappedList = [];
  alreadyUsed: { names: string[] } = {
    names: []
  };
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
 
  checklistForm: FormGroup;
  submitClicked: boolean;
  get checkListItem() { return this.checklistForm.get('checkListItem'); }
  get description() { return this.checklistForm.get('description'); }
  taskId: number;
  constructor(
    private pOCheckListService: POCheckListService,
    private productionorderService: ProductionorderService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.mappedList = this.routeData;
    this.alreadyUsed = {
      names:  this.mappedList.map(data => data.checkListItem.toLowerCase())
    };
 
  }
  
  getCheckListsForTask() {
    this.productionorderService.getTaskDetails(this.task.id).subscribe(res => {
      this.mappedList = res.plannedPOChecklistCollection;
     
    });
    
  }
  actionComplete(args) {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Checklist' : 'Add Checklist';
    }
  }
  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked= false;
      this.checklistForm = this.createFormGroup(args.rowData);
    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.checklistForm.valid){
        const checklist: any = this.checklistForm.getRawValue();
        if (checklist.id) {
          this.pOCheckListService.update(checklist).subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('CheckList updated Successfully');
              this.getCheckListsForTask();
            }
          });
        } else {
          const { id, ...checklistData } = checklist;
          this.pOCheckListService.add(checklistData)
            .subscribe(res => {
              if (res) {
                this.getCheckListsForTask();
                this.toastr.showSuccessMessage('CheckList added to Task Successfully');
              }
            });
        }
      }
      else{
        args.cancel= true;
      }
      
    } else if (args.requestType === 'delete') {
      const checklist: any = args.data[0];
      const { id, ...checklistData } = checklist;
      this.pOCheckListService.delete(id).subscribe(res => {
        if (res) {
          this.getCheckListsForTask();
          this.toastr.showSuccessMessage('CheckList deleted Successfully');
        }
      });
    }
  }
  createFormGroup(row: any): FormGroup {
    
    return this.formBuilder.group({
      id: [row.id],
      PlannedPOTaskId: [this.task.id, [
        Validators.required,
        // duplicateNameValidator(this.leaveComponentNames)
      ]],
      batchNumber: [this.task.batchNumber, [
        Validators.required,
      ]],
      checkListItem: [row.checkListItem, [
        Validators.required,
        Validators.maxLength(32),
        duplicateNameValidator(this.alreadyUsed.names.filter(name => name !== (row.checkListItem || '').toLowerCase())),
    
      ]],
      description: [row.description,[
      Validators.maxLength(128)
      ]],

    });
  }
 ;
 
    
}
