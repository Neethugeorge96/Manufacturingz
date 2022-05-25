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

import { WorkCentersListComponent } from './work-centers-list/work-centers-list.component';

@NgModule({
  declarations: [ 
    WorkCentersListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: WorkCentersListComponent,
        data: { breadcrumbs: ['Workcenters', 'List'] }
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
export class WorkCentersModule { }
