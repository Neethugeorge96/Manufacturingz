import { NgModule } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ERROR_MESSAGES, NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { MaskedTextBoxModule, NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';


// import { InPlaceEditorAllModule } from '@syncfusion/ej2-angular-inplace-editor';

import { OwnManPowerListComponent } from './own-man-power-list/man-power-list.component';
import { OwnManPowerCreateComponent } from './own-man-power-create/man-power-create.component';
import { OwnManPowerEditComponent } from './own-man-power-edit/man-power-edit.component';
import { OwnManPowerViewComponent } from './own-man-power-view/man-power-view.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { ManPowerContainerComponent } from './man-power-container/man-power-container.component';
import { HiredManPowerListComponent } from './hired-man-power-list/hired-man-power-list.component';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';



@NgModule({
  declarations: [
    OwnManPowerListComponent,
    OwnManPowerCreateComponent,
    OwnManPowerEditComponent,
    OwnManPowerViewComponent,
    ManPowerContainerComponent,
    HiredManPowerListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: ManPowerContainerComponent,
        data: { breadcrumbs: ['settings', 'man-power'] }
      },
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MaskedTextBoxModule,
    DropDownListModule,
    AutoCompleteModule,
    DatePickerModule,
    TabModule,
    GridAllModule,
    NumericTextBoxModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    DirectivesModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
  SlicePipe,
]
})
export class ManPowerModule { }
