import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { EditService, ToolbarService, PageService } from '@syncfusion/ej2-angular-treegrid';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EocService } from '../eoc.service';
import { EOCBasicModel } from '../eoc.model';
import { BomService } from '@features/bom/bom.service';
import { RoutingCostingBasis } from 'src/app/models/common/types/routingcostingbasis';
import { enumSelector } from '@shared/utils/common.functions';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';

@Component({
  selector: 'app-eoc-list',
  templateUrl: './eoc-list.component.html',
  providers: [EditService, ToolbarService, PageService]
})
export class EocListComponent implements OnInit {

  eocOrder: EOCBasicModel[] = [];
  uomList: any;
  uom: any;
  routingCostingBasis = enumSelector(RoutingCostingBasis);

  public toolbarOptions: ToolbarItems[] = ['Add', 'Search'];
  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  public eocForm: FormGroup;
  public commands: CommandModel[] = [
    { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
    { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
    { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
    { type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' } }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private eocService: EocService,
    private bomService: BomService,
    private splitByUpperCasePipe: SplitByUpperCasePipe,
  ) { }

  ngOnInit(): void {
    this.routingCostingBasis = enumSelector(RoutingCostingBasis);
    forkJoin(
      [
        this.bomService.getAllUOM(),
        this.eocService.getAll(),
      ]
    ).subscribe(([uoms, eocOrder]) => {
      this.uom = uoms;
      this.eocOrder = eocOrder.map(res => {
        const uom = this.uom.find(x => x.id === parseInt(res.productionUOM));
        return {
          ...res,
          productionUOM: uom ? uom.uomName : '',
        }
      });
    });
  }

  getUOMList() {
    this.bomService.getAllUOM().subscribe(result => {
      this.uomList = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }

  getEocList() {
    this.eocService.getAll().subscribe(result => {
      this.eocOrder = result.map(res => {
        const uom = this.uom.find(x => x.id === parseInt(res.productionUOM));
        return {
          ...res,
          productionUOM: uom ? uom.uomName : '',
        }
      });
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the EOC Details');
      });
  }

  public getRoutingCostingBasic = (field: string, data: object, column: object) => {
    const routingCostingBasis = RoutingCostingBasis;
    return this.splitByUpperCasePipe.transform(routingCostingBasis[data[field]]);
  }

  actionBegin(args: SaveEventArgs): void {
    const rowArgs: any = args.rowData;
    if (args.requestType === 'add') {
      this.router.navigate(['/eoc/eoc-list/create']);
    } else if (args.requestType === 'beginEdit') {
      this.router.navigate(['/eoc/eoc-list/' + rowArgs.id]);
    } else if (args.requestType === 'delete') {
      const row: any = args;
      this.eocService.delete(row.data[0].id).subscribe(res => {
        if (res) {
          this.toastr.showSuccessMessage('EOC deleted successfully!');
          this.getEocList();
        }
        this.getEocList();
      });
    }
  }

}
