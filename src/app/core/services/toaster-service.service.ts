import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterDisplayService {

  constructor(private toastr: ToastrService) { }

  showSuccessMessage(msg: string) {
    this.toastr.success(msg, 'Success Message');
  }
  showErrorMessage(msg: string) {
    this.toastr.error(msg, 'Error Message');
  }
  showInfoMessage(msg: string) {
    this.toastr.info(msg, 'Info Message');
  }
  showWarningMessage(msg: string) {
    this.toastr.warning(msg, 'Warning Message');
  }
}