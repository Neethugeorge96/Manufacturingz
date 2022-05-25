import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductionClosingComponent } from './production-closing/production-closing.component';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { AddProductionClosingComponent } from './add-production-closing/add-production-closing.component';
import { ProductionOrderBatchViewComponent } from './production-order-batch-view/production-order-batch-view.component';
import { ProductionOrderOperationViewComponent } from './production-order-operation-view/production-order-operation-view.component';
import { ProductionOrderTaskViewComponent } from './production-order-task-view/production-order-task-view.component';



@NgModule({
  declarations: [ProductionClosingComponent, AddProductionClosingComponent, ProductionOrderBatchViewComponent,
    ProductionOrderOperationViewComponent,
    ProductionOrderTaskViewComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ProductionClosingComponent,
        data: { breadcrumbs: ['Production Closing', 'List'] }
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
    TimePickerModule,
    TreeViewModule,
    DialogModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
    DatePipe
  ],
})
export class ProductionClosingModule { }
