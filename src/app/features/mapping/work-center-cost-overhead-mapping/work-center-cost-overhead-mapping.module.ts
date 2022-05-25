import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';

import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxAllModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerAllModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';


import { WorkCenterCostOverheadMappingComponent } from './work-center-cost-overhead-mapping/work-center-cost-overhead-mapping.component';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';



@NgModule({ 
  declarations: [WorkCenterCostOverheadMappingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: WorkCenterCostOverheadMappingComponent,
        data: { breadcrumbs: ['Cost Absorption To Work', 'List'] }
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
  },
  SplitByUpperCasePipe],
})
export class WorkCenterCostOverheadMappingModule { }
