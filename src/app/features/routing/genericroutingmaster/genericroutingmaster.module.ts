import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericRoutingComponent } from './generic-routing/generic-routing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { RouterModule } from '@angular/router';
import { PageService, SortService, FilterService, EditService, ToolbarService, CommandColumnService } from '@syncfusion/ej2-angular-treegrid';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { AutoCompleteAllModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, CheckBoxModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ToolbarModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { RoutingCreateComponent } from './routing-create/routing-create.component';
import { RoutingEditComponent } from './routing-edit/routing-edit.component';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';
import { RouteViewComponent } from './route-view/route-view.component';
import { OperationViewComponent } from './operation-view/operation-view.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { MachineViewComponent } from './machine-view/machine-view.component';
import { ManpowerViewComponent } from './manpower-view/manpower-view.component';
import { ChecklistViewComponent } from './checklist-view/checklist-view.component';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';

@NgModule({
  declarations: [
    GenericRoutingComponent,
    RoutingCreateComponent,
    RoutingEditComponent,
    RouteViewComponent,
    OperationViewComponent,
    TaskViewComponent,
    MachineViewComponent,
    ManpowerViewComponent,
    ChecklistViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: GenericRoutingComponent,
        data: { breadcrumbs: ['Generic Routing', 'Generic'] }
      },
      {
        path: 'add', component: RoutingCreateComponent,
        data: { breadcrumbs: ['Generic Routing', 'Add'] }
      },
      {
        path: ':id', component: RoutingEditComponent,
        data: { breadcrumbs: ['Generic Routing', 'Edit'] }
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
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
    AutoCompleteAllModule,
    ButtonModule,
    SwitchModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
    SplitByUpperCasePipe,
    PageService,
    SortService,
    FilterService,
    EditService,
    ToolbarService,
    CommandColumnService
  ],
})
export class GenericroutingmasterModule { }
