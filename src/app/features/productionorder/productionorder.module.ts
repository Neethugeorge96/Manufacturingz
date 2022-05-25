import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import {ButtonModule, SwitchModule} from '@syncfusion/ej2-angular-buttons';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { RouterModule } from '@angular/router';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { TabAllModule, TabModule, ToolbarModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ProductionOrderListComponent } from './production-order-list/production-order-list.component';
import { ProductionOrderCreateComponent } from './production-order-create/production-order-create.component';
import { ProductionOrderContainerComponent } from './production-order-container/production-order-container.component';
import { PORoutingEditComponent } from './po-routing-edit/po-routing-edit.component';
import { POMachineViewComponent } from './po-machine-view/po-machine-view.component';
import { POManpowerViewComponent } from './po-manpower-view/po-manpower-view.component';
import { POChecklistViewComponent } from './po-checklist-view/po-checklist-view.component';
import { POBomEditComponent } from './po-bom-edit/po-bom-edit.component';
import { PORouteViewComponent } from './po-route-view/po-route-view.component';
import { POOperationViewComponent } from './po-operation-view/po-operation-view.component';
import { POTaskViewComponent } from './po-task-view/po-task-view.component';



@NgModule({
  declarations: [ProductionOrderListComponent, ProductionOrderCreateComponent, ProductionOrderContainerComponent, PORoutingEditComponent, POMachineViewComponent, POManpowerViewComponent, POChecklistViewComponent, POBomEditComponent, PORouteViewComponent, POOperationViewComponent, POTaskViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ProductionOrderListComponent,
        data: { breadcrumbs: ['ProductionOrder', 'List'] }
      }, 
      
      {
        path: 'create', component: ProductionOrderContainerComponent,
        data: { breadcrumbs: ['ProductionOrder', 'create'] }
      },

      // {
      //   path: 'create', component: ProductionOrderContainerComponent,
      //   //data: { breadcrumbs: ['ProductionOrder', 'container'] }
      // },
      {
        path: ':id', component: ProductionOrderContainerComponent,
        data: { breadcrumbs: ['ProductionOrder', 'Edit'] }
      },
      
    ]),
    DatePickerModule,
    NgbModule, 
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    DirectivesModule,
    DropDownListAllModule,
    ButtonModule,
    SwitchModule ,
    GridAllModule,
    NumericTextBoxModule,
    AutoCompleteModule,
    TabModule,
    TabAllModule,
    TreeViewModule,
  ],

  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }
  ]
})
export class ProductionorderModule { }
