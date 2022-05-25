import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductionorderService } from '@features/productionorder/productionorder.service';
import { ProductionClosingService } from '@features/release-to-production/production-closing/production-closing.service';
import { NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { forkJoin } from 'rxjs';
import { BatchTrackerService } from '../batch-tracker.service';

@Component({
  selector: 'app-routing-time-container',
  templateUrl: './routing-time-container.component.html',
  styles: [
  ]
})
export class RoutingTimeContainerComponent implements OnInit {
  type: string;
  nodeId: number;
  poId: number;
  pODetails;
  field;
  routeList = [];
  batches = [];
  constructor(
    private productionorderService: ProductionorderService,
    private productionClosingService: ProductionClosingService,
    private batchTrackerService: BatchTrackerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.poId = Number(this.route.snapshot.paramMap.get('id'));
    this.getRoutingDetails();
  }
  getRoutingDetails() {
    forkJoin([this.productionorderService.get(this.poId),
    this.productionClosingService.getByPO(this.poId)
    ]).subscribe(([PO, routing]) => {
      this.pODetails = PO;
      if (routing.length) {
        this.batches = routing;
        this.createListView(routing);
      } else {
        this.productionorderService.getAllRoutingDetailsById(this.poId).subscribe(res => {
          const batches = {
            productionOrderId: this.poId,
            batchSize: res.batchSize,
            startTime: new Date(0),
            endTime: new Date(0),
            uom: this.pODetails.uom,
            operationCollection: res.operationCollection
              .filter(operation => operation.batchNumber === 1)
              .map(operation => {
                return {
                  productionOrderId: this.poId,
                  routingId: operation.plannedPORoutingId,
                  routingName: res.routingName,
                  operationId: operation.id,
                  operationName: operation.operationName,
                  batchNumber: operation.batchNumber,
                  startTime: new Date(0),
                  endTime: new Date(0),
                  uom: this.pODetails.uom,
                  taskCollection: operation.taskCollection.map(task => {
                    return {
                      productionOrderId: this.poId,
                      operationId: task.plannedPOOperationId,
                      operationName: operation.operationName,
                      taskId: task.id,
                      taskName: task.taskName,
                      startTime: new Date(0),
                      endTime: new Date(0),
                    };
                  }),
                };
              }),
          };
          this.batchTrackerService.add(batches).subscribe(saveRes => {
            if (saveRes) {
              this.getRoutingDetails();
            }
          });
        });
      }
    });
  }
  createListView(res) {
    res.map(batch => {
      this.routeList.push({
        listId: `${batch.batchNumber}~BA~${batch.id}`,
        name: `Batch ${batch.batchNumber}`,
        hasChild: true,
        selected: batch.batchNumber === res[0].batchNumber
      });
      batch.operationCollection.map(operation => {
        this.routeList.push({
          listId: `${operation.batchNumber}~OP~${operation.id}`,
          name: operation.operationName,
          hasChild: operation.taskCollection.length !== 0,
          pid: `${operation.batchNumber}~BA~${operation.batchTimeTrackerId}`,
        });
        operation.taskCollection.map(task => {
          this.routeList.push({
            listId: `${operation.batchNumber}~TA~${task.id}`,
            name: task.taskName,
            pid: `${operation.batchNumber}~OP~${task.operationTimeTrackerId}`,
          });
        });
      });
    });

    this.field = { dataSource: this.routeList, id: 'listId', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
    this.type = 'BA';
    this.nodeId = this.batches.length ? this.batches[0].id : 0;

  }

  onNodeSelecting(args: NodeSelectEventArgs): void {
    const node: any = args.nodeData;
    this.type = node.id.split('~')[1];
    this.nodeId = Number(node.id.split('~')[2]);
  }
  statusChanged(status: number) {
    this.pODetails.status = status;
  }

}
