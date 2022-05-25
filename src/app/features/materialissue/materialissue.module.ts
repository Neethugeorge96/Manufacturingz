import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddMaterialIssueComponent } from './add-material-issue/add-material-issue.component';
import { EditMaterialIssueComponent } from './edit-material-issue/edit-material-issue.component';
import { MaterialIssueListComponent } from './material-issue-list/material-issue-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule, CUSTOM_ERROR_MESSAGES } from 'ng-bootstrap-form-validation';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { CUSTOM_ERRORS } from '@shared/utils/validators.messages';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule, DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TabModule } from '@syncfusion/ej2-angular-navigations';
import { MaterialIssueContainerComponent } from './material-issue-container/material-issue-container.component';
import { MaterialRequestApproveListComponent } from './materialrequestapprove/material-request-approve-list/material-request-approve-list.component';
import { EditMaterialRequestApproveComponent } from './materialrequestapprove/edit-material-request-approve/edit-material-request-approve.component';


@NgModule({
  declarations: [AddMaterialIssueComponent, EditMaterialIssueComponent,
    MaterialIssueListComponent, MaterialIssueContainerComponent,
    MaterialRequestApproveListComponent, EditMaterialRequestApproveComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: MaterialIssueContainerComponent,
        data: { breadcrumbs: ['Material Issue', 'List'] }
      },
      {
        path: 'create', component: AddMaterialIssueComponent,
        data: { breadcrumbs: ['Material Issue', 'Create'] }
      },
      {
        path: 'edit/:id', component: EditMaterialIssueComponent,
        data: { breadcrumbs: ['Material Issue', 'Edit'] }
      },
      {
        path: 'editapprove/:id', component: EditMaterialRequestApproveComponent,
        data: { breadcrumbs: ['Material Issue Approve', 'Edit'] }
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
    SwitchModule,
    GridAllModule,
    NumericTextBoxModule,
    AutoCompleteModule,
    DatePickerModule,
    TabModule
  ],
  providers: [{
    provide: CUSTOM_ERROR_MESSAGES,
    useValue: CUSTOM_ERRORS,
    multi: true
  },
    DatePipe
  ],
})
export class MaterialissueModule { }
