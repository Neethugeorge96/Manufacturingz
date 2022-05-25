import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OperationTimeTrackerModel } from '../operation-time-tracker-model';

import { OperationTrackerService } from '../operation-tracker.service';

@Component({
  selector: 'app-operation-closing-create',
  templateUrl: './operation-closing-create.component.html',
  styles: [
  ]
})
export class OperationClosingCreateComponent implements OnInit {

  @Input() operationData: OperationTimeTrackerModel;

  submitClicked = false;
  startForm: FormGroup;
  get endTime() { return this.startForm.get('endTime'); }
  get remarks() { return this.startForm.get('remarks'); }
  get operationOutput() { return this.startForm.get('operationOutput'); }
  get damageQuantity() { return this.startForm.get('damageQuantity'); }
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private operationTrackerService: OperationTrackerService

  ) { }

  ngOnInit(): void {
    this.startForm = this.createFormGroup();
    this.startForm.valueChanges.subscribe(res => {
      if (!this.startForm.get('endTime').errors) {
        if (new Date(this.startForm.getRawValue().startTime).getTime() > new Date(res.endTime).getTime()) {
          this.startForm.get('endTime').setErrors({ earlier: true });
        } else {
          this.startForm.get('endTime').setErrors(null);
        }
      }
    });

  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [this.operationData.id == null ? 0 : this.operationData.id],
      productionOrderId: [this.operationData.productionOrderId],
      batchTimeTrackerId: [this.operationData.batchTimeTrackerId],
      batchNumber: [this.operationData.batchNumber],
      startTime: [{ value: new Date(this.operationData.startTime + 'Z'), disabled: true }],
      endTime: [new Date(), [Validators.required]],
      routingId: [this.operationData.routingId],
      routingName: [this.operationData.routingName],
      operationId: [this.operationData.operationId],
      operationName: [this.operationData.operationName],
      operationOutput: [this.operationData.operationOutput, [Validators.required]],
      uom: [this.operationData.uom],
      damageQuantity: [this.operationData.damageQuantity, [Validators.required]],
      damageReason: [this.operationData.damageReason],
      remarks: [this.operationData.remarks, Validators.maxLength(250)],
    });
  }
  submit() {
    this.submitClicked = true;
    if (this.startForm.valid) {
      this.operationTrackerService.update(this.startForm.getRawValue()).subscribe(res => {
        if (res) {
          this.activeModal.close('submit');
          this.submitClicked = false;
        }
      });
    }
  }

}
