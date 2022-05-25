import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ProductionRoutingService } from '../production-routing.service';
import { ProductionRouting } from '../production-routing.model';
import { GenericRoutingService } from '@features/routing/genericroutingmaster/generic-routing.service';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query, Predicate } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-production-routing',
  templateUrl: './production-routing.component.html'
})
export class ProductionRoutingComponent implements OnInit {

  productionRouting: ProductionRouting[] = []; 
  genericRouting: any[] = [];
  manufacturedItems: any[] = [];

  public toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];
  productionForm: FormGroup;

  public editSettings: EditSettingsModel = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };
  productionLines: any[];
  submitClicked: boolean;

  get manufacturedProduct() { return this.productionForm.get('manufacturedProduct'); }
  get productionLineId() { return this.productionForm.get('productionLineId'); }
  get routingId() { return this.productionForm.get('routingId'); }
  constructor(
    public modalService: NgbModal,
    public productionRoutingService: ProductionRoutingService,
    private genericRoutingService: GenericRoutingService,
    private toastr: ToasterDisplayService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this.getAllProductionRouting();
    this.getAllProductLineDetails();
    this.getManufacturedItems();
  }

  getAllProductionRouting() {
    this.productionRoutingService.getAll().subscribe(result => {
      this.productionRouting = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Production Routing details');
      });
  }

  getAllProductLineDetails() {
    this.genericRoutingService.getProductLineDetails().subscribe(result => {
      this.productionLines = result;
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Generic Routing details');
      });
  }

  getManufacturedItems() {
    this.productionRoutingService.getItemMaster().subscribe(result => {


      this.manufacturedItems = result.filter(x => x.itemTypeName == "Manufactured")

      this.manufacturedItems = this.manufacturedItems.map(x => {
        return {
          value: x.id,
          text: x.itemName,
          code: x.itemCode
        };
      });


    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Manufactured items details');
      });
  }

  actionBegin(args: SaveEventArgs): void {

    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked = false;
      const rowArgs: any = args.rowData;
      this.productionForm = this.createFormGroup(args.rowData);
      if (args.requestType === 'beginEdit') {
        const selectedProductionLine = this.productionLines
          .find(productionLine => productionLine.productionLineId === rowArgs.productionLineId);
        this.genericRouting = selectedProductionLine.routingCollection;
      }
      this.productionForm.get('productionLineId').valueChanges.subscribe(res => {
        const selectedProductionLine = this.productionLines.find(productionLine => productionLine.productionLineId === res);

        this.productionForm.patchValue({
          productionLineName: selectedProductionLine ? selectedProductionLine.productionLineName : '',
          productionLineCode: selectedProductionLine ? selectedProductionLine.productionLineCode : '',
          routingId: '',
          routingCode: '',
          routingName: ''
        }, { emitEvent: false });
        this.genericRouting = selectedProductionLine.routingCollection;
      });
      this.productionForm.get('routingId').valueChanges.subscribe(res => {
        if (res) {
          const selectedRoute = this.genericRouting.find(route => route.basicRoutingId === res);
          this.productionForm.patchValue({
            routingName: selectedRoute ? selectedRoute.basicRoutingName : '',
            routingCode: selectedRoute ? selectedRoute.basicRoutingCode : '',
          }, { emitEvent: false });
        }
      });
    }
    if (args.requestType === 'save') {
      this.submitClicked = true;
      if (this.productionForm.valid) {
        let productionFormData;
        productionFormData = this.productionForm.value;
        productionFormData = {
          ...productionFormData,
          manufacturedProductCode: this.manufacturedItems.find(x => x.text == productionFormData.manufacturedProduct).code,

        };
        if (productionFormData.id) {
          this.productionRoutingService.update(productionFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Production Routing  updated successfully!');
                this.getAllProductionRouting();
              }
            },
              error => {
                console.error('err', error);
                this.toastr.showErrorMessage('Unable to update the Production Routing  Details');
              }
            );
        } else {
          const { ...addFormData } = productionFormData;
          productionFormData = {
            ...productionFormData,
            manufacturedProductCode: this.manufacturedItems.find(x => x.text == productionFormData.manufacturedProduct).code,
          };
          this.productionRoutingService.add(addFormData)
            .subscribe(res => {
              if (res) {
                this.toastr.showSuccessMessage('Production Routing  added successfully!');
                this.getAllProductionRouting();
              }
            },
              error => {
                console.error('err', error);
                this.toastr.showErrorMessage('Unable to add the Production Routing  Details');
              }
            );
        }
      } else {
        args.cancel = true;
      }
    }
    if (args.requestType === 'delete') {
      const row: any = args;
      const id = row.data[0] ? row.data[0].id : 0;
      if (id) {
        console.log(row.data[0])
        //  if (row.data[0].isAssigned === false) {
        this.productionRoutingService.delete(id).subscribe(res => {
          if (res) {
            this.toastr.showSuccessMessage('Production Routing  deleted successfully!');
            this.getAllProductionRouting();
          }
        },
          error => {
            console.error('err', error);
            this.toastr.showErrorMessage('Unable to delete the Production Routing  Details');
          }
        );
        // }
      }
    }
  }

  createFormGroup(production: any): FormGroup {
    return new FormGroup({
      id: new FormControl(production.id == null ? 0 : production.id),
      manufacturedProductCode: new FormControl(production.manufacturedProductCode, []),
      manufacturedProduct: new FormControl(
        production.manufacturedProduct, [
        Validators.required
      ]),
      productionLineId: new FormControl(production.productionLineId, [Validators.required]),
      productionLineName: new FormControl(production.productionLineName),
      productionLineCode: new FormControl(production.productionLineCode),
      routingId: new FormControl(production.routingId, [
        Validators.required,
      ]),
      routingCode: new FormControl(production.routingCode, []),
      routingName: new FormControl(production.routingName, []),
    });
  }



  checkprodRoutDuplication(event, source) {
    if (source === 'manufacture') {
      if (this.productionForm.controls['routingId'].value) {
        let routeControl = this.productionForm.controls['routingId'].value;
        if (this.productionRouting.find(x => x.manufacturedProductCode === event.itemData.code && x.routingId === routeControl)) {
          this.toastr.showErrorMessage('Duplicate Production routing ');
          this.productionForm.controls['manufacturedProduct'].setValue(null);
        }
      }
    }

    if (source === 'routing') {
      if (this.productionForm.controls['manufacturedProduct'].value) {
        let manufacturedProductVal = this.productionForm.controls['manufacturedProduct'].value;
        let manufacturedProdCode = this.manufacturedItems.find(x => x.text === manufacturedProductVal);
        if (this.productionRouting.find(x => x.routingId === event.itemData.basicRoutingId && x.manufacturedProductCode === manufacturedProdCode.code)) {
          this.toastr.showErrorMessage('Duplicate Production routing ');
          this.productionForm.controls['routingId'].setValue(null);
        }

      }
    }
  }
  public onFilteringRes = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('productionLineName', 'contains', e.text, true).or('productionLineCode', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.productionLines, query);
  }
  public onFilteringItem = (e: FilteringEventArgs) => {
    let query = new Query();
    let predicateQuery = query.where(new Predicate('text', 'contains', e.text, true).or('code', 'contains', e.text, true));
    query = (e.text !== '') ? predicateQuery : query;
    e.updateData(this.manufacturedItems, query);
  }
}
