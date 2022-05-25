import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { Router } from '@angular/router';
import { ProductionorderService } from '../productionorder.service';
import { POheader } from '../productionorder.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-production-order-list',
  templateUrl: './production-order-list.component.html',

})
export class ProductionOrderListComponent implements OnInit {

  // addForm: FormGroup;
  productionOrder: POheader[] = [];
  public toolbar: ToolbarItems[] | object = ['Search', 'Add'];
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  POforView;
  closeResult: string;
  @ViewChild('content') modelPopup: any;

  public commands: CommandModel[] = [
    { buttonOption: { content: 'Release', cssClass: 'e-flat' } },
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];


  constructor(private toastr: ToasterDisplayService, private productionorderservice: ProductionorderService,
    private router: Router, private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getAllProductionOrder();
  }


  open(content) {
    this.modalService.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, () => {});
  }
  queryCellInfo(args) { // queryCellInfo event of Grid
    if (args.cell.classList.contains('e-unboundcell') && args.data.status !== 1) {
      args.cell.querySelector('button[title=\'Edit\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Edit\']').classList.add('e-disabled');
      args.cell.querySelector('button[title=\'Delete\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Delete\']').classList.add('e-disabled');
      args.cell.querySelector('button[title=\'Release\']').ej2_instances[0].disabled = true;
      args.cell.querySelector('button[title=\'Release\']').classList.add('e-disabled');
    }
  }

  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.buttonOption.content === 'View') {
      this.POforView = args.rowData;
      this.open(this.modelPopup);
    }
    if(args.commandColumn.buttonOption.content === 'Release'){
      const rowArgs: any = args.rowData;
      this.productionorderservice.updatePlannedProductionOrderStatus(rowArgs.id,2).subscribe(res=>{
        this.toastr.showSuccessMessage('Production Order released to production successfully!');
        this.getAllProductionOrder();
      })
    }
  }

  getAllProductionOrder() {
    this.productionorderservice.getAll().subscribe(result => {
      this.productionOrder = result;
    });
  }

  actionBegin(args: SaveEventArgs): void {
    const rowArgs: any = args.data;
    if (args.requestType === 'add') {
      this.router.navigate(['/productionOrder/production-order-list/create']);
    } else if (args.requestType === 'beginEdit') {
      const row: any = args.rowData;
      this.router.navigate(['/productionOrder/production-order-list/' + row.id]);
    } else if (args.requestType === 'delete') {
      this.productionorderservice.delete(rowArgs[0].id).subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('PO deleted successfully!');
          this.getAllProductionOrder();
        }
      });
    }
  }

}
