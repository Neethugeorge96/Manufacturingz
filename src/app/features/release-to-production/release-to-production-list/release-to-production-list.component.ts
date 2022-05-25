import { Component, OnInit } from '@angular/core';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { Router } from "@angular/router";
import { PlannedProductionOrder } from '../release-to-production.model';
import { ReleaseToProductionListService } from '../release-to-production-list.service';
import { ProductionOrderStatus } from 'src/app/models/common/types/productionorderstatus';

@Component({
  selector: 'app-release-to-production-list',
  templateUrl: './release-to-production-list.component.html'
})
export class ReleaseToProductionListComponent implements OnInit {

  productionOrder: PlannedProductionOrder[] = [];
  public toolbar: ToolbarItems[] | object;
  productionOrderStatus = ProductionOrderStatus;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  public dateFormat = { type: 'date', skeleton: 'medium' };
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
  ];
  constructor(
    private toastr: ToasterDisplayService,
    private releaseToProductionListService: ReleaseToProductionListService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.toolbar = ['Search']
    this.getAllProductionOrder();
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'delete') {
      this.releaseToProductionListService.delete(args.data[0].id).subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('Production order deleted successfully!');
          this.getAllProductionOrder();
        }
      },
        error => {
          console.error("err", error);
          this.toastr.showErrorMessage('Unable to delete the Production Close Details');
        }
      );
    }
  }
  getAllProductionOrder() {
    this.releaseToProductionListService.getAll().subscribe(result => {
      this.productionOrder = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the production order details');
      });
  }
  queryCellInfo(args) {
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 4) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 2) {
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
    if (args.cell.classList.contains("e-unboundcell") && args.data.status === 3) {
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.type == "Edit" && !args.target['disabled']) {
      this.router.navigate(['release-to-production/release-production-list/edit/' + args.rowData['id']])
    }
  }

}