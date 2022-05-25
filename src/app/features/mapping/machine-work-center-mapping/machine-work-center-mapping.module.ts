import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxAllModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { MachineWorkCenterComponent } from './machine-work-center/machine-work-center.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MachineWorkCenterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: MachineWorkCenterComponent,
        data: { breadcrumbs: ['settings', 'man-power'] }
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    GridAllModule,
    AutoCompleteModule,
    NumericTextBoxAllModule,
    // DatePickerAllModule,
    DropDownListAllModule,
  ]
})
export class MachineWorkCenterMappingModule { }
