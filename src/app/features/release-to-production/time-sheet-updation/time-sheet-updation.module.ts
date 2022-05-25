import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { TimePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { ExcelExportService, GridAllModule, GridModule } from '@syncfusion/ej2-angular-grids';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, CheckBoxModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { TabAllModule, TabModule, ToolbarModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

import { TimeSheetUpdationComponent } from './time-sheet-updation/time-sheet-updation.component';
import { TimeSheetContainerComponent } from './time-sheet-container/time-sheet-container.component';
import { TimeSheetUploadComponent } from './time-sheet-upload/time-sheet-upload.component';

@NgModule({
  declarations: [
    TimeSheetUpdationComponent, 
    TimeSheetContainerComponent, 
    TimeSheetUploadComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: TimeSheetContainerComponent,
        data: { breadcrumbs: ['Time Sheet', 'List'] }
      },   
    ]),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule.forRoot(),
    BsDropdownModule.forRoot(),
    MaskedTextBoxModule,
    DropDownListModule,
    AutoCompleteModule,
    DirectivesModule,
    TreeGridModule,
    GridModule,
    GridAllModule,
    TreeViewModule,
    ToolbarModule,
    ButtonModule,
    CheckBoxModule,
    NumericTextBoxModule,
    DropDownListAllModule,
    ButtonModule,
    SwitchModule,
    TabModule,
    TabAllModule,
    TimePickerModule,
    DateTimePickerModule,
    UploaderModule,
    DialogModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
  DatePipe,
  ExcelExportService
  ],
})
export class TimeSheetUpdationModule { }
