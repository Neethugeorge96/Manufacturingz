import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, GridComponent, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { MaintainProduction } from '../bom.model';
import { BomService } from '../bom.service';
import { Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { POBillOfMaterialService } from '@features/productionorder/po-bill-of-material.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-bom-list',
  templateUrl: './bom-list.component.html'
})
export class BomListComponent implements OnInit {
  addForm: FormGroup;
  bom: MaintainProduction[] = [];
  plantManagerList: any[];
  public toolbar: ToolbarItems[] | object;
  @ViewChild('content') modelPopup: any;
  closeResult: string;
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Dialog'
  };
  manufacturedProductCode: string;
  manufacturedProduct: string;
  ProductUOMName: string;
  modifiedDate: string;
  BomQuantity: number;
  mappedMaintainProductionIds: number[];
  public commands: CommandModel[] = [
    { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }];

  constructor(private toastr: ToasterDisplayService, private bomService: BomService, private poBillOfMaterialService: POBillOfMaterialService,
    private router: Router, private modalService: NgbModal,) { }
  ngOnInit(): void {
    this.toolbar = ['Search',
      { text: 'Add', tooltipText: 'Add', prefixIcon: 'e-add', id: 'add' }];
    forkJoin(
      [
        this.poBillOfMaterialService.getAllMappedMaintainProductionId()
      ])
      .subscribe(([mappedmaintainedproductionIds]) => {
        this.mappedMaintainProductionIds = mappedmaintainedproductionIds;
      });
    this.getAllBOM();
  }
  getAllBOM() {
    this.bomService.getAll().subscribe(result => {
      this.bom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the BOM details');
      });
  }
  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === 'add') {
      this.router.navigate(['/bom/maintain-bom-list/create']);
    }
  }
  commandClick(args: CommandClickEventArgs): void {
    if (args.commandColumn.type == "Edit" && !args.target['disabled']) {
      this.router.navigate(['/bom/maintain-bom-list/edit/' + args.rowData['id']])
    }
    else if (args.commandColumn.buttonOption.content == 'View') {
      this.manufacturedProduct = args.rowData["manufacturedProduct"];
      this.manufacturedProductCode = args.rowData["manufacturedProductCode"];
      this.ProductUOMName = args.rowData["productUOMName"];
      this.BomQuantity = args.rowData["bomQuantity"];
      this.open(this.modelPopup);
    }
  }
  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'delete') {
      this.bomService.delete(args.data[0].id).subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('BOM deleted successfully!');
          this.getAllBOM();
        }
      },
        error => {
          console.error("err", error);
          this.toastr.showErrorMessage('Unable to delete the BOM Details');
        }
      );
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
  queryCellInfo(args) {
    if (args.cell.classList.contains("e-unboundcell") && this.mappedMaintainProductionIds.includes(args.data.id)) {
      args.cell.querySelector("button[title='Edit']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Edit']").classList.add("e-disabled");
      args.cell.querySelector("button[title='Delete']").ej2_instances[0].disabled = true;
      args.cell.querySelector("button[title='Delete']").classList.add("e-disabled");
    }
  }
}
