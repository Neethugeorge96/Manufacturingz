import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { Router } from "@angular/router";
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { enumSelector } from '@shared/utils/common.functions';
import { MaterialIssueStatus } from 'src/app/models/common/types/materialissuestatus';
import { MaterialissueService } from '../materialissue.service';
import { MaterialIssue } from '../material-issue.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-material-issue-list',
  templateUrl: './material-issue-list.component.html'
})
export class MaterialIssueListComponent implements OnInit {

  addForm: FormGroup;
  materiallssue: MaterialIssue[];
  plantManagerList: any[];
  materialRequestNo: string;
  workCenterName: string
  requestMaterialToName: string;
  requestedDate: string;
  requestMaterialFromName: string;
  requestedBy: string;
  status: string
  remarks: string;
  numberOfRequestedItems: number;
  closeResult: string;

  @ViewChild('content') modelPopup: any;
  public dateFormat = { type: 'date', skeleton: 'medium' };
  materialIssueStatus = MaterialIssueStatus;
  public toolbar: ToolbarItems[] | object;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog',
  };
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];


  constructor(private toastr: ToasterDisplayService, private materialissueService: MaterialissueService,
    private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.toolbar = ['Search',
      { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-add', id: 'add' }];
    this.getAllMaterialIssue();
  }
  getAllMaterialIssue() {
    this.materialissueService.getAll().subscribe(result => {
      this.materiallssue = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the BOM details');
      });
  }
  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === 'add') {
      this.router.navigate(['/materialissue/material-issue-container/create']);
    }
  }
 
  queryCellInfo(args) { //queryCellInfo event of Grid 
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 3) {
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 5) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 6) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 7) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true; 
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }
  actionBegin(args: SaveEventArgs): void {
   
    if(args.requestType === 'delete'){ // && !args.target['disabled']
      this.materialissueService.delete(args.data[0].id).subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Material Issue deleted successfully!');
          this.getAllMaterialIssue();
        }
      },
        error => {
          console.error("err", error);
          this.toastr.showErrorMessage('Unable to delete the Material Issue Details');
        }
      );
    }
     
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.type == "Edit" && !args.target['disabled']) {
      this.router.navigate(['/materialissue/material-issue-container/edit/' + args.rowData['id']])
    }
    else if (args.commandColumn.buttonOption.content == 'View') {
      this.materialRequestNo = args.rowData["materialRequestNumber"];
      this.requestedDate = args.rowData["requestedDate"];
      this.workCenterName = args.rowData["workCenterName"];
      this.numberOfRequestedItems = args.rowData["numberOfRequestedItems"];
      this.requestMaterialFromName = args.rowData["requestMaterialFromName"];
      this.requestMaterialToName = args.rowData["requestMaterialToName"];
      this.requestedBy = args.rowData["requestedBy"];
      this.status = this.materialIssueStatus[args.rowData["status"]];
      this.open(this.modelPopup);
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
  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({ content: toolcontent });
    tooltip.appendTo(args.node);
  }

}
