import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';

import { ProductionRoutingComponent } from './production-routing/production-routing.component';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxAllModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerAllModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';


@NgModule({
  declarations: [
    ProductionRoutingComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ProductionRoutingComponent,
        data: { breadcrumbs: ['Production Routing', 'Routing'] }
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    DirectivesModule,
    GridAllModule,
    NumericTextBoxAllModule,
    DatePickerAllModule,
    DateTimePickerModule,
    DropDownListAllModule,
    NumericTextBoxModule,
    AutoCompleteModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }],
})
export class ProductionroutingModule { }
