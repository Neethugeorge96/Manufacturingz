import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { Router } from "@angular/router";
import { Tooltip } from '@syncfusion/ej2-angular-popups';
import { enumSelector } from '@shared/utils/common.functions';
import { MaterialIssueStatus } from 'src/app/models/common/types/materialissuestatus';
import { MaterialissueService } from '@features/materialissue/materialissue.service';
import { MaterialIssue } from '@features/materialissue/material-issue.model';

@Component({
  selector: 'app-material-request-approve-list',
  templateUrl: './material-request-approve-list.component.html',
})
export class MaterialRequestApproveListComponent implements OnInit {

  addForm: FormGroup;
  materiallssue: MaterialIssue[];
  plantManagerList: any[];
  materialIssueStatus = MaterialIssueStatus;
  public toolbar: ToolbarItems[] | object;
  public dateFormat = { type: 'date', skeleton: 'medium' };
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },]
  constructor(private toastr: ToasterDisplayService, private materialissueService: MaterialissueService,
    private router: Router) { }

  ngOnInit(): void {
    this.toolbar = ['Search',]
    this.getAllMaterialIssue();
  }
  getAllMaterialIssue() {
    this.materialissueService.getAll().subscribe(result => {
      this.materiallssue = result.filter(x => x.status != 1);

    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the BOM details');
      });
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.type == "Edit") {
        this.router.navigate(['/materialissue/material-issue-container/editapprove/' + args.rowData['id']])
    }
  }
  headerCellInfo(args) {
    const toolcontent = args.cell.column.headerText;
    const tooltip: Tooltip = new Tooltip({ content: toolcontent });
    tooltip.appendTo(args.node);
  }

}
