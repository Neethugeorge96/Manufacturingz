import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';

import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, CheckBoxModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TabAllModule, TabModule, ToolbarModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';

import { EocListComponent } from './eoc-list/eoc-list.component';
import { ChecklistViewComponent } from './checklist-view/checklist-view.component';
import { MachineViewComponent } from './machine-view/machine-view.component';
import { ManpowerViewComponent } from './manpower-view/manpower-view.component';
import { RouteViewComponent } from './route-view/route-view.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { OperationViewComponent } from './operation-view/operation-view.component';
import { RoutingCreateComponent } from './routing-create/routing-create.component';
import { RoutingEditComponent } from './routing-edit/routing-edit.component';
import { EocContainerComponent } from './eoc-container/eoc-container.component';
import { EocRoutingComponent } from './eoc-routing/eoc-routing.component';
import { EocCostAbsorptionComponent } from './eoc-cost-absorption/eoc-cost-absorption.component';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';
import { BomListComponent } from './bom-list/bom-list.component';

@NgModule({
  declarations: [
    EocListComponent, 
    ChecklistViewComponent, 
    MachineViewComponent, 
    ManpowerViewComponent, 
    RouteViewComponent, 
    TaskViewComponent, 
    OperationViewComponent, 
    RoutingCreateComponent, 
    RoutingEditComponent, 
    EocContainerComponent, 
    EocRoutingComponent, EocCostAbsorptionComponent, BomListComponent, 
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: EocListComponent,
        data: { breadcrumbs: ['EOC centers', 'List'] }
      },   
      {
        path: 'add', component: RoutingCreateComponent,
        data: { breadcrumbs: ['EOC create', 'Add'] }
      }, 
      // {
      //   path: 'container', component: EocContainerComponent,
      //   //data: { breadcrumbs: ['ProductionOrder', 'container'] }
      // },
      {
        path: ':id', component: EocContainerComponent,
        data: { breadcrumbs: ['EOC Routing', 'Edit'] }
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    DirectivesModule,
    GridAllModule,
    MaskedTextBoxModule,
    DropDownListModule,
    AutoCompleteModule,
    DirectivesModule,
    TreeGridModule,
    GridModule,
    GridAllModule,
    TreeViewModule,
    ToolbarModule,
    ButtonModule,
    CheckBoxModule,
    NumericTextBoxModule,
    DropDownListAllModule,
    ButtonModule,
    SwitchModule,
    TabModule,
    TabAllModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
  SplitByUpperCasePipe,
]
})
export class EocModule { }
