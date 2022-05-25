import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DialogButtons } from '../dialogs.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'smart-confirm-dialog',
  template: `
        <div class="modal-header border-bottom">
          <div class="modal-title" [innerHTML]="title">
          </div>
        </div>
        <div class="modal-body border-top" [innerHTML]="message"></div>
        <div class="modal-footer" *ngIf="buttons">
          <button (click)="confirm($event)" type="button" class="btn bootbox-accept {{buttons.confirm.className}}">
          {{buttons.confirm.label}}</button>
          <button (click)="cancel($event)" type="button" class="btn bootbox-cancel {{buttons.cancel.className}}">
          {{buttons.cancel.label}}</button>
        </div>
  `,
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  buttons: DialogButtons;
  onClose = new Subject();

  constructor(public bsModalRef: BsModalRef) {
    if(!this.buttons){
      this.buttons = {
        cancel: {
          label: "Cancel",
          className: "btn-primary btn"

        },
        confirm: {
          label: "Ok",
          className: "btn-danger btn"
        }
      }
    }
   }

  confirm($event: MouseEvent) {
    this.onClose.next(true);
    this.onClose.complete();
    this.bsModalRef.hide();
  }

  cancel($event: MouseEvent) {
    this.onClose.next(false);
    this.onClose.complete();
    this.bsModalRef.hide();
  }

}
