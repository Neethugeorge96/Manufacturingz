import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Operation } from '@features/routing/genericroutingmaster/operation.model';
import { OperationService } from '@features/routing/genericroutingmaster/operation.service';
import { WorkCenter } from '@settings/work-centers/work-centers.model';
import { WorkCentersService } from '@settings/work-centers/work-centers.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-po-operation-view',
  templateUrl: './po-operation-view.component.html',
  styles: [
  ]
})
export class POOperationViewComponent implements OnInit, OnChanges {
  @Input() operation;
  @Input() routeId;
  operationFromRoute: Operation;
  workcenter: WorkCenter;

  constructor(
    private operationService: OperationService,
    private workCentersService: WorkCentersService
  ) {

  }
  ngOnInit(): void {
    forkJoin([
      this.operationService.getByNumber(this.operation.operationCode),
      this.workCentersService.getAll()
    ]).subscribe(([operation, workcenters]) => {
      this.operationFromRoute = operation;
      this.workcenter = workcenters.find(center => center.id === operation.workCenterId);
    });  }
  

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes.operation.currentValue.operationCode !== changes.operation.previousValue.operationCode) {
      forkJoin([
        this.operationService.getByNumber(this.operation.operationCode),
        this.workCentersService.getAll()
      ]).subscribe(([operation, workcenters]) => {
        this.operationFromRoute = operation;
        this.workcenter = workcenters.find(center => center.id === operation.workCenterId);
      });
    }
  }


}
