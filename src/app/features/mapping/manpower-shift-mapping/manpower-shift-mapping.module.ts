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
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';

import { ManpowerShiftMappingComponent } from './manpower-shift-mapping/manpower-shift-mapping.component';
import { MappingCreateComponent } from './mapping-create/mapping-create.component';
import { MappingEditComponent } from './mapping-edit/mapping-edit.component';
import { MappingViewComponent } from './mapping-view/mapping-view.component';




@NgModule({
  declarations: [
    ManpowerShiftMappingComponent,
    MappingCreateComponent,
    MappingEditComponent,
    MappingViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ManpowerShiftMappingComponent,
        data: { breadcrumbs: ['Manpower To Shift', 'List'] }
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
  
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }]
})
export class ManpowerShiftMappingModule { }
