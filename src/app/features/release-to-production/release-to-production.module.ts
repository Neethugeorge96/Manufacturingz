import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReleaseToProductionListComponent } from './release-to-production-list/release-to-production-list.component';
import { ReleaseToProductionContainerComponent } from './release-to-production-container/release-to-production-container.component';
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
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    ReleaseToProductionListComponent,
    ReleaseToProductionContainerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ReleaseToProductionListComponent,
        data: { breadcrumbs: ['Release To Production', 'List'] }
      },
      {
        path: 'edit/:id', component: ReleaseToProductionContainerComponent,
        data: { breadcrumbs: ['Release To Production', 'Edit'] }
      },
      {
        path: 'edit/:id/material-issue-production-order',
        loadChildren: () => import('../release-to-production/materialissue-to-production-order/materialissue-to-production-order.module').then(m => m.MaterialissuetoproductionorderModule),
        data: { breadcrumbs: ['Release To Production', 'Material Issue'] }
      },
      {
        path: 'edit/:id/routing-time',
        loadChildren: () => import('../release-to-production/routing-time/routing-time.module').then(m => m.RoutingTimeModule),
        data: { breadcrumbs: ['Release To Production', 'Routing-time'] }
      },
      {
        path: 'edit/:id/time-sheet-updation',
        loadChildren: () => import('../release-to-production/time-sheet-updation/time-sheet-updation.module').then(m => m.TimeSheetUpdationModule),
        data: { breadcrumbs: ['Release To Production', 'Time-Sheet'] }
      },
      {
        path: 'edit/:id/production-closing',
        loadChildren: () => import('../release-to-production/production-closing/production-closing.module').then(m => m.ProductionClosingModule),
        data: { breadcrumbs: ['Release To Production', 'Production-closing'] }
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
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
    TabAllModule,
    SwitchModule,
    GridAllModule,
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }]
})
export class ReleaseToProductionModule { }
