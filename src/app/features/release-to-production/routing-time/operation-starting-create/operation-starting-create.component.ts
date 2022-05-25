import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { OperationTimeTrackerModel } from '../operation-time-tracker-model';
import { OperationTrackerService } from '../operation-tracker.service';

@Component({
  selector: 'app-operation-starting-create',
  templateUrl: './operation-starting-create.component.html',
  styles: [
  ]
})
export class OperationStartingCreateComponent implements OnInit {

  @Input() operationData: OperationTimeTrackerModel;
  startForm: FormGroup;
  submitClicked = false;
  get startTime() { return this.startForm.get('startTime'); }
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private operationTrackerService: OperationTrackerService

  ) { }

  ngOnInit(): void {
    this.startForm = this.createFormGroup();

  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [this.operationData.id == null ? 0 : this.operationData.id],
      productionOrderId: [this.operationData.productionOrderId],
      batchTimeTrackerId: [this.operationData.batchTimeTrackerId],
      batchNumber: [this.operationData.batchNumber],
      startTime: [new Date(), [Validators.required]],
      endTime: [new Date(0)],
      routingId: [this.operationData.routingId],
      routingName: [this.operationData.routingName],
      operationId: [this.operationData.operationId],
      operationName: [this.operationData.operationName],
      operationOutput: [this.operationData.operationOutput],
      uom: [this.operationData.uom],
      damageQuantity: [this.operationData.damageQuantity],
      damageReason: [this.operationData.damageReason],
      remarks: [this.operationData.remarks],
    });
  }
  submit() {
    this.submitClicked = true;
    if (this.startForm.valid) {
      this.operationTrackerService.update(this.startForm.value).subscribe(res => {
        if (res) {
          this.activeModal.close('submit');
          this.submitClicked = false;
        }
      });
    }
  }

}
