import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandClickEventArgs, CommandModel, SaveEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EditSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-treegrid'; 

import { EditService, ToolbarService, PageService } from '@syncfusion/ej2-angular-treegrid';
import { enumSelector } from '@shared/utils/common.functions';
import { RoutingType } from 'src/app/models/common/types/routingtype';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericRoutingService } from '../generic-routing.service';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
 


@Component({
    selector: 'app-generic-routing',
    templateUrl: './generic-routing.component.html',
    providers: [EditService, ToolbarService, PageService] 

})
export class GenericRoutingComponent implements OnInit {
    public routingList: any[] = [];
    public toolbarOptions: ToolbarItems[] = ['Add', 'Search'];

    // RoutingTypes = enumSelector(RoutingType);
    routingCode: string;
    routingName : string;
    routingType: string;
    productionLineName: string;
    mainRoute: string;
    Mainroute:string;
    closeResult: string;
    @ViewChild('content') modelPopup: any;
    public edited = false;

    public editSettings: EditSettingsModel = {
        showDeleteConfirmDialog: true,
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
    };
    public commands: CommandModel[] = [
        { buttonOption: { content: 'View', cssClass: 'e-flat btn-view' } },
        { type: 'Edit', buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' } },
        { type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } },
        { type: 'Save', buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' } },
        {
            type: 'Cancel', buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' }
        }];
    routingTypes = enumSelector(RoutingType);
    constructor(
        private splitByUpperCasePipe: SplitByUpperCasePipe,
        private route: ActivatedRoute,
        private toastr: ToasterDisplayService,
        private genericRoutingService: GenericRoutingService,
        private router: Router,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.getRoutingList(); 
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


      commandClick(args: CommandClickEventArgs): void {
        console.log(args.rowData);
        if (args.commandColumn.buttonOption.content == 'View') {

            let RountingType = this.splitByUpperCasePipe.transform(RoutingType[args.rowData["routingType"]]);
            if(args.rowData["routingType"] === 2 ){
                this. Mainroute = this.routingList.find(x=>x.routingCode == args.rowData["mainRoutingCode"]).routingName
                this.edited = true;
            }

          this.routingCode = args.rowData["routingCode"];
          this.routingName = args.rowData["routingName"];
          this.routingType = RountingType;
          this.mainRoute = this.Mainroute;
          this.productionLineName = args.rowData["productionLineName"];
         
          this.open(this.modelPopup);
        }
      }


    getRoutingList() {
        this.genericRoutingService.getAll().subscribe(res => {
            this.routingList = res;
        });    }

    public getRouteTypeName = (field: string, data: object, column: object) => {
        const routingtype = RoutingType;
        return this.splitByUpperCasePipe.transform(routingtype[data[field]]);
    }

    actionBegin(args: SaveEventArgs): void {
        if (args.requestType === 'add') {
            this.router.navigate(['add'], { relativeTo: this.route });
        } else if (args.requestType === 'beginEdit') {
            const rowData: any = args.rowData;
            this.router.navigate([rowData.id], { relativeTo: this.route });
        } else if (args.requestType === 'delete') {
         
            const machine: any = args.data[0];
            const { id, ...machineData } = machine;
            console.log("delete")
            this.genericRoutingService.delete(id).subscribe(res => {
              if (res) {
                this.getRoutingList();
                this.toastr.showSuccessMessage('Route deleted Successfully');
              }
            });
          } 

    }
}
