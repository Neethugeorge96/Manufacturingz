import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualitycontrolComponent } from './qualitycontrol/qualitycontrol.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';



@NgModule({
  declarations: [QualitycontrolComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: QualitycontrolComponent,
        data: { breadcrumbs: ['Quality Control', 'List'] }
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
    SwitchModule,
    
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true,
    
  },
  SplitByUpperCasePipe],
})
export class QualitycontrolModule { }
 