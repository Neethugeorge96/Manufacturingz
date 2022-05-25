import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutingTimeContainerComponent } from './routing-time-container/routing-time-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule, DatePickerModule, TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule, AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { BatchViewComponent } from './batch-view/batch-view.component';
import { RouteViewComponent } from './route-view/route-view.component';
import { OperationViewComponent } from './operation-view/operation-view.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { BatchStartingCreateComponent } from './batch-starting-create/batch-starting-create.component';
import { BatchClosingCreateComponent } from './batch-closing-create/batch-closing-create.component';
import { OperationStartingCreateComponent } from './operation-starting-create/operation-starting-create.component';
import { OperationClosingCreateComponent } from './operation-closing-create/operation-closing-create.component';
import { TaskStartingCreateComponent } from './task-starting-create/task-starting-create.component';
import { TaskClosingCreateComponent } from './task-closing-create/task-closing-create.component';



@NgModule({
  declarations: [
    RoutingTimeContainerComponent,
    BatchViewComponent,
    RouteViewComponent,
    OperationViewComponent,
    TaskViewComponent,
    BatchStartingCreateComponent,
    BatchClosingCreateComponent,
    OperationStartingCreateComponent,
    OperationClosingCreateComponent,
    TaskStartingCreateComponent,
    TaskClosingCreateComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: RoutingTimeContainerComponent,
        data: { breadcrumbs: ['Release To production', 'Routing time'] }
      },

    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    DirectivesModule,
    DropDownListAllModule,
    ButtonModule,
    SwitchModule,
    GridAllModule,
    NumericTextBoxModule,
    AutoCompleteModule,
    DatePickerModule,
    TreeViewModule,
    TimePickerModule
  ],
  entryComponents: [
    BatchStartingCreateComponent
  ]
})
export class RoutingTimeModule { }
