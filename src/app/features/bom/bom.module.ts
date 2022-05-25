
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module'; 
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import {ButtonModule, SwitchModule} from '@syncfusion/ej2-angular-buttons';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { BomListComponent } from './maintain-bom-list/bom-list.component';
import { EditBomItemComponent } from './bom-item/edit-bom-item/edit-bom-item.component';
import { AddBomItemListComponent } from './bom-item/add-bom-item/add-bom-item-list.component';


@NgModule({
  declarations: [BomListComponent, AddBomItemListComponent, EditBomItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: BomListComponent,
        data: { breadcrumbs: ['BOM', 'List'] }
      },
      {
        path: 'create', component: AddBomItemListComponent,
        data: { breadcrumbs: ['BOM Item', 'List'] }
      },
      {
        path: 'edit/:id', component: EditBomItemComponent,
        data: { breadcrumbs: ['BOM Item', 'List'] }
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
    SwitchModule ,
    GridAllModule,
    NumericTextBoxModule,
    AutoCompleteModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  }
  ],
})
export class BomModule { }
