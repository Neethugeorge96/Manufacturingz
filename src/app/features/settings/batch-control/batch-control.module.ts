import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { BatchControlComponent } from './batch-control/batch-control.component';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';



@NgModule({
  declarations: [BatchControlComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: BatchControlComponent,
        data: { breadcrumbs: ['Batch Size master', 'List'] }
      },   
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    DirectivesModule,
    GridAllModule,
    DropDownListAllModule,
    NumericTextBoxModule,
    AutoCompleteModule,
    SwitchModule 
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }],
})
export class BatchControlModule { }
