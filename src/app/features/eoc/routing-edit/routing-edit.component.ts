import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { duplicateCodeValidator, duplicateNameValidator } from '@shared/utils/validators.functions';
import { NodeClickEventArgs, NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';

import { CommandModel, EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EocService } from '../eoc.service';
import { EOCBasicModel } from '../eoc.model';
import { enumSelector } from '@shared/utils/common.functions';
import { RoutingType } from 'src/app/models/common/types/routingtype';
import { RoutingCostingBasis } from 'src/app/models/common/types/routingcostingbasis';
import { BomService } from '@features/bom/bom.service';
import { GenericRoutingService } from '@features/routing/genericroutingmaster/generic-routing.service';


@Component({
  selector: 'app-routing-edit',
  templateUrl: './routing-edit.component.html'
})
export class RoutingEditComponent implements OnInit {

  eoc:EOCBasicModel[]=[];
  public eocForm: FormGroup;
  routingTypes = enumSelector(RoutingType);
  routingCostingBasis = enumSelector(RoutingCostingBasis);
  uom: any[];
  manufacturingProduct: any[];
  productionRoutes: any[];

  routingId: number;
  routeList: object[] = [];
  type = null;
  // maps the appropriate column to fields property
  public field: Object = { dataSource: this.routeList, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  id: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eocService:EocService,
    private bomService:BomService,
    private changeDetector: ChangeDetectorRef,
    private genericRoutingService:GenericRoutingService
  ) { }

  ngOnInit(): void {
    this.getEocList();
    this.getAllUOM();
    this.getManufacturingProduct();
    this.routingTypes = enumSelector(RoutingType);
    this.routingCostingBasis = enumSelector(RoutingCostingBasis);
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    this.eocForm = this.createFormGroup();
    console.log(this.routingId);
    this.getRoutingDetails();
  }

  getEocList() {
    this.eocService.getAll().subscribe(result => {
      this.eoc = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the EOC Details');
      });
  }

  getManufacturingProduct() {
    this.bomService.getAllItem().subscribe(result => {
      this.manufacturingProduct = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Manufacuring Product details');
      });
  }

  getAllUOM() {
    this.bomService.getAllUOM().subscribe(result => {
      this.uom = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the UOM details');
      });
  }

  getRoutingCodebyProduct(event) {
    this.eocService.getRoutingcode(event.value).subscribe(result => {
      this.productionRoutes = result;
      if (result.length != 0) {
        this.eocForm.controls.routingCode.setValue(result[0].routingCode);
    }
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Routing Code Details');
      });
  }

  getRoutingDetails() {
    this.eocService.get(this.routingId).subscribe((res:any )=> {
      console.log("res",res)
      res.productionUOM = parseInt(res.productionUOM);
      this.genericRoutingService.getAllRoutingDetails(res.routingId).subscribe((r1) => {
        console.log("grid",r1)
          this.routeList = r1; 
          this.field = { dataSource: this.routeList, id: 'listId', text: 'name', child: 'subChild' };
      });
      this.eocForm.patchValue(res);
      console.log("this.eocForm",this.eocForm.value)
    });
  }
  
  createFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      manufacturedProductCode: new FormControl('', Validators.required),
      manufacturedProduct: new FormControl('', Validators.required),
      routingCode: new FormControl('', Validators.required),
      routingName: new FormControl('', Validators.required),
      routingCostingBasis: new FormControl('', Validators.required),
      productionUOM: new FormControl('', Validators.required),
      productionQuantity: new FormControl('', Validators.required),
    });
  }

  isNodeClicked(args: NodeClickEventArgs) {
    // console.log(args);
  }
  onNodeSelecting(args: NodeSelectEventArgs): void {
    console.log(args);
    const node: any = args.nodeData;
    this.type = node.id.substring(0, 2);
    if (this.type === 'RO') {
      this.id =  Number(node.id.substring(2));
    }
    if (this.type === 'OP') {
      this.id = Number(node.id.substring(2));
    }
    if (this.type === 'TA') {
      this.id = Number(node.id.substring(2));
    }
    this.id = Number(node.id.substring(2));
    console.log(this.type);
  }

  onSubmit() {
    const eocFormValue =this.eocForm.value
    console.log("this.eocForm.value",this.eocForm.value)
    eocFormValue.manufacturedProduct=  this.manufacturingProduct.find(x => x.itemCode === eocFormValue.manufacturedProductCode).itemName;
    eocFormValue.routingName = eocFormValue.routingCode;
    eocFormValue.routingId = this.productionRoutes.find(x => x.routingCode == eocFormValue.routingCode).routingId;
    eocFormValue.routingCostingBasis =this.routingCostingBasis.find(x => x.text === eocFormValue.routingCostingBasis).value;
    console.log(this.eocForm.value);
    this.eocService.update(this.eocForm.value).subscribe((res: any) => {
      // if (res) {
        this.toastr.showSuccessMessage('EOC updated successfully!');
        // this.router.navigate(['eoc/eoc-list/' + res.id]);
      // }
    },
    error => {
      console.error("err", error);
      this.toastr.showErrorMessage('Unable to update the EOC Details');
    }
    );
  }

}
