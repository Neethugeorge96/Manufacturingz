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
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { MaterialissueProductionOrderListComponent } from './materialissue-production-order-list/materialissue-production-order-list.component';
import { CommonModule, DatePipe } from '@angular/common';
@NgModule({
  declarations: [MaterialissueProductionOrderListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: MaterialissueProductionOrderListComponent,
        data: { breadcrumbs: ['Material Issue Approve', 'List'] }
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
    DatePickerModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
    DatePipe
  ],
})
export class MaterialissuetoproductionorderModule { }
