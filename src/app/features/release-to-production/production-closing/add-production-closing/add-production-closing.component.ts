import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enableRipple } from '@syncfusion/ej2-base';
//enable ripple style
enableRipple(true);
@Component({
  selector: 'app-add-production-closing',
  templateUrl: './add-production-closing.component.html'
})
export class AddProductionClosingComponent implements OnInit {
  proCloseForm: FormGroup;
  productOrderId: number = 20;
  @Output() productionCloseEvent = new EventEmitter<any>();
  @Output() closeEvent = new EventEmitter<boolean>();
  @Input() batchFirstData: any;
  @Input() sumOfBatchOutput: number;

  submitClicked: boolean;
  get endTime() { return this.proCloseForm.get('endTime'); }
  get totalOutput() { return this.proCloseForm.get('totalOutput'); }
  get remarks() { return this.proCloseForm.get('remarks'); }
 

  constructor(private formBuilder: FormBuilder,) { }
  ngOnInit(): void {
    this.proCloseForm = this.createFormGroup();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.batchFirstData != undefined) {
      this.proCloseForm.patchValue({ startTime:  new Date(this.batchFirstData.startTime + 'Z') });
      this.proCloseForm.patchValue({ uOM: this.batchFirstData.uom });
      this.proCloseForm.patchValue({ batchOutput: this.sumOfBatchOutput });
      this.proCloseForm.controls['uOM'].disable();
      this.proCloseForm.controls['batchOutput'].disable();
    }
  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      productionOrderId: [this.productOrderId, [
        Validators.required
      ]],
      startTime: ['', [
        Validators.required
      ]],
      endTime: ['', [
        Validators.required
      ]],
      uOM: ['', [
        Validators.required
      ]],
      totalOutput: [null, [
        Validators.required,
        Validators.max(9999999)
      ]],
      batchOutput: [null, [
        Validators.required
      ]],
      remarks: ['', [
        Validators.maxLength(128)
      ]],

    });
  }
  saveProductionClose() {
    this.submitClicked= true;
    if(this.proCloseForm.valid){
      this.productionCloseEvent.emit(this.proCloseForm.getRawValue());
    }
   
  }
  ClosePopup() {
    this.closeEvent.emit(true);
  }
}
