import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Operation } from '@features/routing/genericroutingmaster/operation.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { BatchTrackerService } from '../batch-tracker.service';
import { OperationClosingCreateComponent } from '../operation-closing-create/operation-closing-create.component';
import { OperationStartingCreateComponent } from '../operation-starting-create/operation-starting-create.component';
import { OperationTimeTrackerModel } from '../operation-time-tracker-model';
import { OperationTrackerService } from '../operation-tracker.service';
import { TaskTrackerService } from '../task-tracker.service';

@Component({
  selector: 'app-operation-view',
  templateUrl: './operation-view.component.html',
  styles: [
  ]
})
export class OperationViewComponent implements OnInit, OnChanges {
  @Input() operationTrackerId;
  operationStarted: boolean;
  operationClosed: boolean;
  operationData: OperationTimeTrackerModel;
  operationToRouting: Operation;
  batchStarted: boolean;
  batchClosed: boolean;
  tasksClosed: boolean;
  constructor(
    public modalService: NgbModal,
    private toastr: ToasterDisplayService,
    private operationTrackerService: OperationTrackerService,
    private batchTrackerService: BatchTrackerService,
    private taskTrackerService: TaskTrackerService
  ) { }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.operationTrackerId && changes.operationTrackerId.currentValue !== changes.operationTrackerId.previousValue) {
      this.getOperationTracker();
      this.getOperationToRouting();
    }
  }
  getOperationToRouting() {
    this.operationTrackerService.getOperationToRouting(this.operationTrackerId).subscribe(res => {
      this.operationToRouting = res;
    })
  }
  getOperationTracker() {
    forkJoin([this.taskTrackerService.getByOperaton(this.operationTrackerId),
      this.operationTrackerService.get(this.operationTrackerId)])
      .subscribe(([tasks, operationTracker]) => {
      this.tasksClosed = tasks.every(task => new Date(task.endTime).getFullYear() !== 1970);
      this.batchTrackerService.get(operationTracker.batchTimeTrackerId).subscribe(batch => {
        this.batchStarted = new Date(batch.startTime).getFullYear() !== 1970;
        this.batchClosed = new Date(batch.endTime).getFullYear() !== 1970;
      });
      this.operationData = operationTracker;
      this.operationStarted = new Date(operationTracker.startTime).getFullYear() !== 1970;
      this.operationClosed = new Date(operationTracker.endTime).getFullYear() !== 1970;
    });

  }
  getDate(date) {
    return new Date(date + 'Z');
  }
  operationStarting() {
    const modalRef = this.modalService.open(OperationStartingCreateComponent,
      { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.operationData = this.operationData;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.toastr.showSuccessMessage('Operation Started successfully');
        this.getOperationTracker();
      }
    }, () => { });

  }
  operationClosing() {
    const modalRef = this.modalService.open(OperationClosingCreateComponent,
      { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.operationData = this.operationData;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.toastr.showSuccessMessage('Operation Closed successfully');
        if (this.operationToRouting.backflushMaterial) {
          this.toastr.showInfoMessage('Raw Materials will be back flushed');
        }
        this.getOperationTracker();
      }
    }, () => { });

  }

}
