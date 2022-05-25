import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ManPowerCategoryService } from '@settings/man-power-category/man-power-category.service';
import { EditSettingsModel, ToolbarItems, CommandModel, DialogEditEventArgs, SaveEventArgs, CommandClickEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ManpowerToTaskService } from '../manpower-to-task.service';

@Component({
  selector: 'app-manpower-view',
  templateUrl: './manpower-view.component.html',
  styles: [
  ]
})
export class ManpowerViewComponent implements OnInit, OnChanges {

  taskId: number;
  taskCode: string;
  manpowerCategoryCode: string;
  manpowerName: string;
  noOfResourcesView: number;
  costPerHour: number;
  currencyCode: string;
  manpowerCategory: string;

  @Input() task;
  @Input() operation;
  @Output() rowChanged: EventEmitter<any> = new EventEmitter();
  closeResult: string;
  @ViewChild('content') modelPopup: any;
  manpowers: any[] = [];
  mappedList: any[] = [];
  fields: object = { text: 'categoryName', value: 'categoryCode' };
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
  manpowerForm: FormGroup;
  submitClicked: boolean;
 
  get manpowerCategoryId() { return this.manpowerForm.get('manpowerCategoryCode'); }
  get noOfResources() { return this.manpowerForm.get('noOfResources'); }

  constructor(
    private manpowerToTaskService: ManpowerToTaskService,
    private manPowerCategoryService: ManPowerCategoryService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getAllManpowerCategories();
    this.getManpowersForTask();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      this.getManpowersForTask();
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

  commandClick(args: CommandClickEventArgs): void {
    console.log(args.rowData);
    if (args.commandColumn.buttonOption.content == 'View') {
      this.taskCode = args.rowData["taskCode"];
      this.manpowerCategory = args.rowData["manpowerCategory"];
      this.noOfResourcesView = args.rowData["noOfResources"];
      this.costPerHour = args.rowData["costPerHour"];
      this.currencyCode = args.rowData["currencyCode"];
      this.open(this.modelPopup);
    }
  }

  getManpowersForTask() {
    this.manpowerToTaskService.getByTask(this.task.id).subscribe(res => {
      this.mappedList = res;
    });
  }

  getAllManpowerCategories() {
    this.manPowerCategoryService.getAll()
      .subscribe(res => {
        this.manpowers = res;
      });
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      const dialog = args.dialog;
      dialog.header = args.requestType === 'beginEdit' ? 'Edit Manpower' : 'Add Manpower';
    }
  }

  actionBegin(args: SaveEventArgs): void {
    const actionArgs: any = args;
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.manpowerForm = this.createFormGroup(args.rowData);
      this.manpowerForm.valueChanges.subscribe(res => {
        const selectedManpower = this.manpowers.find(manpower => manpower.categoryCode == res.manpowerCategoryCode);
        this.manpowerForm.patchValue({
          manpowerCategory: selectedManpower.categoryName,
          costPerHour: selectedManpower.costRatePerHour,
          currencyCode: selectedManpower.currencyCode
        }, { emitEvent: false });
      });

    } else if (args.requestType === 'save') {
      this.submitClicked = true;
      if(this.manpowerForm.valid){
        const manpower: any = this.manpowerForm.getRawValue();
      if (manpower.id) {
        this.manpowerToTaskService.update(manpower).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Manpower updated Successfully');
            this.getManpowersForTask();
            this.rowChanged.emit({
              eventOn: 'MP', object: {
                pid: `TA${this.task.id}`,
                listId: `TA${this.task.id}`,
                selected: `MP${this.task.id}`
              }
            });
          }
        });
      } else {
        const { id, ...manpowerData } = manpower;
        const duplicateEoc = this.mappedList.filter(x =>
          x.taskId === manpower.taskId &&
          x.taskCode === manpower.taskCode &&
          x.manpowerCategoryCode === manpower.manpowerCategoryCode &&
          x.manpowerName === manpower.manpowerName &&
          x.noOfResources == manpower.noOfResources &&
          x.costPerHour === manpower.costPerHour &&
          x.currencyCode === manpower.currencyCode &&
          x.manpowerCategory === manpower.manpowerCategory
        )
        if (duplicateEoc.length === 0) {
          this.manpowerToTaskService.add(manpowerData)
          .subscribe(res => {
            if (res) {
              this.toastr.showSuccessMessage('Manpower added to Task Successfully');
              this.getManpowersForTask();
              this.rowChanged.emit({
                eventOn: 'MP', object: {
                  pid: `TA${this.task.id}`,
                  listId: `TA${this.task.id}`,
                  selected: `MP${this.task.id}`
                }
              });
            }
          },
            error => {
              console.error("err", error);
              this.toastr.showErrorMessage('Unable to add the Manpower Details');
            });
        }
        else {
          this.toastr.showErrorMessage('Cannot add duplicate Manpower Details');
          this.getManpowersForTask();
        }
      }
      }
      else{
        args.cancel = true;
      }
      
    } else if (args.requestType === 'delete') {
      const manpower: any = args.data[0];
      const { id, ...manpowerData } = manpower;
      this.manpowerToTaskService.delete(id).subscribe(res => {
        if (res) {
          this.getManpowersForTask();
          this.rowChanged.emit({
            eventOn: 'MP', object: {
              pid: `TA${this.task.id}`,
              listId: `TA${this.task.id}`,
              selected: `MP${this.task.id}`
            }
          });
          this.toastr.showSuccessMessage('Manpower deleted Successfully');
        }
      });
    }
  }
  createFormGroup(row: any): FormGroup {
    return this.formBuilder.group({
      id: [row.id],
      taskId: [this.task.id, [
        Validators.required,
        // duplicateNameValidator(this.leaveComponentNames)
      ]],
      taskCode: [this.task.taskCode, [
        Validators.required,
      ]],
      manpowerCategoryCode: [row.manpowerCategoryCode, [
        Validators.required
      ]],
      manpowerCategory: [row.manpowerCategory],
      noOfResources: [row.noOfResources, [Validators.required,Validators.max(999999),Validators.min(1)]],
      manpowerName: [{ value: row.manpowerName, disabled: true }, [Validators.required]],
      costPerHour: [{ value: row.costPerHour, disabled: true }, [Validators.required,]],
      currencyCode: [{ value: row.currencyCode, disabled: true }, [Validators.required]]

    });
  }

}
