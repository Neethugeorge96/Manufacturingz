import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskTimeTrackerModel } from '../task-time-tracker-model';
import { TaskTrackerService } from '../task-tracker.service';

@Component({
  selector: 'app-task-closing-create',
  templateUrl: './task-closing-create.component.html',
  styles: [
  ]
})
export class TaskClosingCreateComponent implements OnInit {

  @Input() taskData: TaskTimeTrackerModel;

  startForm: FormGroup;
  submitClicked = false;

  get endTime() { return this.startForm.get('endTime'); }
  get remarks() { return this.startForm.get('remarks'); }
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private taskTrackerService: TaskTrackerService

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
      id: [this.taskData.id == null ? 0 : this.taskData.id],
      productionOrderId: [this.taskData.productionOrderId],
      operationTimeTrackerId: [this.taskData.operationTimeTrackerId],
      batchNumber: [this.taskData.batchNumber],
      startTime: [{ value: new Date(this.taskData.startTime + 'Z'), disabled: true }],
      endTime: [new Date(), [Validators.required]],
      taskId: [this.taskData.taskId],
      taskName: [this.taskData.taskName],
      operationId: [this.taskData.operationId],
      operationName: [this.taskData.operationName],
      uom: [this.taskData.uom],
      remarks: [this.taskData.remarks, Validators.maxLength(128)],
    });
  }
  submit() {
    this.submitClicked = true;
    if (this.startForm.valid) {
      this.taskTrackerService.update(this.startForm.getRawValue()).subscribe(res => {
        if (res) {
          this.submitClicked = false;
          this.activeModal.close('submit');
        }
      });
    }
  }

}
