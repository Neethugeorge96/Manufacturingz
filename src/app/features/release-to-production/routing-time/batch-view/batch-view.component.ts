import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ProductionorderService } from '@features/productionorder/productionorder.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';

import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { BatchClosingCreateComponent } from '../batch-closing-create/batch-closing-create.component';
import { BatchStartingCreateComponent } from '../batch-starting-create/batch-starting-create.component';
import { BatchTimeTrackerModel } from '../batch-time-tracker-model';
import { BatchTrackerService } from '../batch-tracker.service';
import { OperationTrackerService } from '../operation-tracker.service';

@Component({
  selector: 'app-batch-view',
  templateUrl: './batch-view.component.html',
  styles: [
  ]
})
export class BatchViewComponent implements OnInit, OnChanges {
  routeData: BatchTimeTrackerModel;
  @Input() batchTrackerId;
  @Input() pODetails;
  batchStarted: boolean;
  batchClosed: boolean;
  backFlushRequired: boolean;
  @Output() statusChange: EventEmitter<number> = new EventEmitter();
  operationsClosed: boolean;


  constructor(
    public modalService: NgbModal,
    private toastr: ToasterDisplayService,
    private batchTrackerService: BatchTrackerService,
    private operationTrackerService: OperationTrackerService,
    private productionorderService: ProductionorderService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.batchTrackerId && changes.batchTrackerId.currentValue !== changes.batchTrackerId.previousValue) {
      this.getBatchTracker();
      this.getOperationsInBatch();
    }
  }
  getOperationsInBatch() {
    this.batchTrackerService.getOperations(this.batchTrackerId).subscribe(res => {
      this.backFlushRequired = res.filter(operation => operation.backflushMaterial === false).length !== 0;
    });
  }
  getBatchTracker() {
    forkJoin([this.operationTrackerService.getByBatch(this.batchTrackerId),
    this.batchTrackerService.get(this.batchTrackerId)])
      .subscribe(([operations, batchTracker]) => {
        this.operationsClosed = operations.every(operation => new Date(operation.endTime).getFullYear() !== 1970);
        this.routeData = batchTracker;
        this.batchStarted = new Date(batchTracker.startTime).getFullYear() !== 1970;
        this.batchClosed = new Date(batchTracker.endTime).getFullYear() !== 1970;
      });
  }

  ngOnInit(): void {
  }
  getDate(date) {
    return new Date(date + 'Z');
  }
  batchStarting() {
    const modalRef = this.modalService.open(BatchStartingCreateComponent,
      { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.routeData = this.routeData;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.toastr.showSuccessMessage('Batch Started successfully');
        if (this.pODetails.status !== 3) {
          this.productionorderService.updatePlannedProductionOrderStatus(this.pODetails.id, 3).subscribe(res => {
            if (res) {
              this.statusChange.emit(3);
            }
          });
        }
        this.getBatchTracker();
      }
    }, () => { });

  }
  batchClosing() {
    const modalRef = this.modalService.open(BatchClosingCreateComponent,
      { centered: true, backdrop: 'static', size: 'lg' });
    modalRef.componentInstance.routeData = this.routeData;
    modalRef.result.then((result) => {
      if (result === 'submit') {
        this.toastr.showSuccessMessage('Batch Closed successfully');
        this.getBatchTracker();
        if (this.backFlushRequired) {
          this.toastr.showInfoMessage('Raw Materials will be back flushed');
        }
      }
    }, () => { });

  }

}
