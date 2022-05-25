import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ModalModule, BsModalRef, } from 'ngx-bootstrap/modal';
import { DialogsService } from './dialogs.service';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [ConfirmDialogComponent, ConfirmModalComponent],
  entryComponents: [ConfirmDialogComponent, ConfirmModalComponent],
  imports: [
    CommonModule,
    ModalModule
  ],
  exports: [
    ConfirmDialogComponent
  ],
  providers: [
    DialogsService,
    BsModalRef
  ]
})
export class DialogsModule { }
