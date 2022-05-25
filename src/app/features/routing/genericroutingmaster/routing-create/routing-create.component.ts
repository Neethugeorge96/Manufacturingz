import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Query } from '@syncfusion/ej2-data';

import { ProductionLine } from '@settings/production-line/production-line.model';
import { ProductionLineService } from '@settings/production-line/production-line.service';
import { enumSelector } from '@shared/utils/common.functions';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { RoutingType } from 'src/app/models/common/types/routingtype';
import { GenericRoutingService } from '../generic-routing.service';

@Component({
  selector: 'app-routing-create',
  templateUrl: './routing-create.component.html',
  styles: [
  ]
})

export class RoutingCreateComponent implements OnInit {
  routingTypes = enumSelector(RoutingType);
  routeForm: FormGroup;
  productionLines: ProductionLine[] = [];
  route: string;
  otherRoutes: any[] = [];
  public fields: object = { text: 'routingName', value: 'value' };
  public query: Query = new Query().select(['routingName', 'routingCode', 'value']).take(6); 
  public filterType = 'Contains';

  submitClicked: boolean;
 
  get routingName() { return this.routeForm.get('routingName'); }
  get routingType() { return this.routeForm.get('routingType'); }
  get productionLineCode() { return this.routeForm.get('productionLineCode'); }
  get mainRoutingCode() { return this.routeForm.get('mainRoutingCode'); }
  

  constructor(
    private genericRoutingService: GenericRoutingService,
    private productionLineService: ProductionLineService,
    private toastr: ToasterDisplayService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLastGenericrouteId();
    this.route = this.router.url;
    this.genericRoutingService.getAll().subscribe(res => {
      this.otherRoutes = res.filter(route => route.routingType === 1); 
    });
    this.productionLineService.getAll().subscribe(res => {
      this.productionLines = res;
    });
    this.routeForm = this.createFormGroup();
  }

  getLastGenericrouteId() {
    this.genericRoutingService.getLastGenericRouteId().subscribe(result => {
    this.routeForm.controls['routingCode'].setValue(result + 1); 
  },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to fetch the generic routing code');
    });
  }

  duplicationValidation(event){
    let routingName = event.target.value;
    this.otherRoutes.forEach(data => {
      if(data.routingName.toLowerCase() === routingName.toLowerCase()){
        this.toastr.showErrorMessage("Can't able to add duplicate generic Routing Name");
        this.routeForm.controls['routingName'].setValue(null);
      }
    })
    
    
  }
  


  createFormGroup(): FormGroup {
    return new FormGroup({
      routingCode: new FormControl({ value: '', disabled: true },[Validators.required, Validators.maxLength(4)] ),
      routingName: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      routingType: new FormControl('', Validators.required),
      isCompleted: new FormControl(false),
      productionLineCode: new FormControl('', Validators.required),
      productionLineName: new FormControl(''),
      productionLineId: new FormControl(''),
      mainRoutingCode: new FormControl('')
    });
  }

  onSubmit() {
    this.submitClicked = true;
    if(this.routeForm.valid){
      const selectedProductionLine = this.productionLines
      .find(productionLine => productionLine.productionLineCode === this.routeForm.value.productionLineCode);
    this.genericRoutingService.add({
      ...this.routeForm.getRawValue(),
      mainRoutingCode: this.routeForm.getRawValue().routingType === 2 ?
        this.routeForm.getRawValue().mainRoutingCode.substr(this.routeForm.getRawValue().mainRoutingCode.lastIndexOf('-') + 1)
        : '',
      productionLineName: selectedProductionLine ? selectedProductionLine.productionLineName : '',
      productionLineId: selectedProductionLine ? selectedProductionLine.id : 0,
    })
      .subscribe((res: any) => {
        if (res) {
          this.productionLineService.isAssigned(selectedProductionLine.productionLineCode, true).subscribe(() => { });
          this.toastr.showSuccessMessage('Route Created successfully');
          this.router.navigate(['routing/generic/' + res.id]);
        }
      });
    }
    
  }

}
