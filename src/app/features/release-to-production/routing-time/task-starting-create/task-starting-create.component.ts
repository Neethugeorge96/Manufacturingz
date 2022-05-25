import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TaskTimeTrackerModel } from '../task-time-tracker-model';
import { TaskTrackerService } from '../task-tracker.service';

@Component({
  selector: 'app-task-starting-create',
  templateUrl: './task-starting-create.component.html',
  styles: [
  ]
})
export class TaskStartingCreateComponent implements OnInit {

  @Input() taskData: TaskTimeTrackerModel;
  startForm: FormGroup;

  submitClicked = false;
  get startTime() { return this.startForm.get('startTime'); }

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private taskTrackerService: TaskTrackerService

  ) { }

  ngOnInit(): void {
    this.startForm = this.createFormGroup();

  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [this.taskData.id == null ? 0 : this.taskData.id],
      productionOrderId: [this.taskData.productionOrderId],
      operationTimeTrackerId: [this.taskData.operationTimeTrackerId],
      batchNumber: [this.taskData.batchNumber],
      startTime: [new Date(), [Validators.required]],
      endTime: [new Date(0)],
      taskId: [this.taskData.taskId],
      taskName: [this.taskData.taskName],
      operationId: [this.taskData.operationId],
      operationName: [this.taskData.operationName],
      uom: [this.taskData.uom],
      remarks: [this.taskData.remarks],
    });
  }
  submit() {
    this.submitClicked = true;
    if (this.startForm.valid) {
      this.taskTrackerService.update(this.startForm.value).subscribe(res => {
        if (res) {
          this.submitClicked = true;
          this.activeModal.close('submit');
        }
      });
    }
  }

}
