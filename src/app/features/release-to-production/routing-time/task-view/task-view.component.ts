import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { OperationTrackerService } from '../operation-tracker.service';
import { TaskClosingCreateComponent } from '../task-closing-create/task-closing-create.component';
import { TaskStartingCreateComponent } from '../task-starting-create/task-starting-create.component';
import { TaskTimeTrackerModel } from '../task-time-tracker-model';
import { TaskTrackerService } from '../task-tracker.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styles: [
  ]
})
export class TaskViewComponent implements OnInit, OnChanges {

  @Input() taskTrackerId;
  taskStarted: boolean;
  taskClosed: boolean;
  taskData: TaskTimeTrackerModel;
  poId: number;
  parentStarted: boolean;
  parentClosed: boolean;
  constructor(
    public modalService: NgbModal,
    private toastr: ToasterDisplayService,
    private operationTrackerService: OperationTrackerService,
    private taskTrackerService: TaskTrackerService
  ) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.taskTrackerId && changes.taskTrackerId.currentValue !== changes.taskTrackerId.previousValue) {
      this.getOperationTracker();
    }
  }
  getDate(date) {
    return new Date(date + 'Z');
  }
  getOperationTracker() {
    this.taskTrackerService.get(this.taskTrackerId).subscribe(res => {
      this.operationTrackerService.get(res.operationTimeTrackerId).subscribe(operation => {
        this.parentStarted = new Date(operation.startTime).getFullYear() !== 1970;
        this.parentClosed = new Date(operation.endTime).getFullYear() !== 1970;
      });
      this.taskData = res;
      this.taskStarted = new Date(res.startTime).getFullYear() !== 1970;
      this.taskClosed = new Date(res.endTime).getFullYear() !== 1970;
    });
  }

  taskStarting() {
    const modalRef = this.modalService.open(TaskStartingCreateComponent,
      { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.taskData = this.taskData;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.toastr.showSuccessMessage('Task Started successfully');
        this.getOperationTracker();
      }
    }, () => { });

  }
  taskClosing() {
    const modalRef = this.modalService.open(TaskClosingCreateComponent,
      { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.taskData = this.taskData;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.toastr.showSuccessMessage('Task Closed successfully');
        this.getOperationTracker();
      }
    }, () => { });

  }

}
