import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BatchTimeTrackerModel } from '../batch-time-tracker-model';
import { BatchTrackerService } from '../batch-tracker.service';

@Component({
  selector: 'app-batch-starting-create',
  templateUrl: './batch-starting-create.component.html',
  styles: [
  ]
})
export class BatchStartingCreateComponent implements OnInit {
  @Input() routeData: BatchTimeTrackerModel;
  startForm: FormGroup;

  submitClicked = false;
  get startTime() { return this.startForm.get('startTime'); }
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private batchTrackerService: BatchTrackerService

  ) { }

  ngOnInit(): void {
    this.startForm = this.createFormGroup();
  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [this.routeData.id == null ? 0 : this.routeData.id],
      productionOrderId: [this.routeData.productionOrderId],
      batchNumber: [this.routeData.batchNumber],
      startTime: [new Date(), [Validators.required]],
      endTime: [new Date(0)],
      batchCode: [this.routeData.batchCode],
      batchOutput: [this.routeData.batchOutput],
      uom: [this.routeData.uom],
      damageQuantity: [this.routeData.damageQuantity],
      damageReason: [this.routeData.damageReason],
      remarks: [this.routeData.remarks],
    });
  }
  submit() {
    this.submitClicked = true;
    if (this.startForm.valid) {
      this.batchTrackerService.update(this.startForm.value).subscribe(res => {
        if (res) {
          this.activeModal.close('submit');
          this.submitClicked = false;
        }
      });
    }
  }

}
