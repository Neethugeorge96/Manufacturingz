import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { PORoutingService } from '../po-routing.service';

@Component({
  selector: 'app-po-routing-edit',
  templateUrl: './po-routing-edit.component.html',
  styles: [
  ]
})
export class PORoutingEditComponent implements OnInit {
  batches = [];
  batch = null;
  operations = [];
  tasks = [];
  machines = [];
  manpowers = [];
  checklists = [];
  showErrorMsg = false;
  @Input() productionOrder;
  @Output() completed: EventEmitter<any> = new EventEmitter();
  routesForCurrentBatch;
  allRoutes;
  routeList = [];
  type = 'RO';
  selectedNode: any;
  parentOperation: any;
  field = { dataSource: this.routeList, id: 'listId', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  task: any;
  operation: any;

  submitClicked: boolean;

  constructor(
    private pORoutingService: PORoutingService
  ) { }

  ngOnInit(): void {
    for (let step = 0; step < this.productionOrder.batchSize; step++) {
      this.batches = [...this.batches, { text: `Batch ${step + 1}`, value: step + 1 }];
    }
    // this.pORoutingService.getByRoute(this.productionOrder.id).subscribe(res => {
    //   this.allRoutes = res;
    // });
  }
  batchChanged(e) {
  this.showErrorMsg = false;
  this.pORoutingService.getRoutingDetails(this.productionOrder.id, e.value)
      .subscribe(res => {
        this.type = 'RO';
        this.checklists = this.manpowers = this.machines = [];
        this.routesForCurrentBatch = res;
        this.routeList = [
          {
            listId: `RO${res.id}`,
            name: res.routingName,
            hasChild: true,
            selected: true
          }];
        const { operationCollection, ...routeData } = this.routesForCurrentBatch;
        this.selectedNode = routeData;
        res.operationCollection.map(operation => {
          this.operations = [...this.operations, operation];
          this.routeList.push(
            {
              listId: `OP${operation.id}`,
              id: operation.id,
              operationCode: operation.operationCode,
              name: operation.operationName,
              workCenterId: operation.workCenterId,
              pid: `RO${res.id}`,
              hasChild: operation.taskCollection.length,
            }
          );
          operation.taskCollection.map(task => {
            this.tasks = [...this.tasks, task];
            this.machines = [...this.machines, ...task.plannedPOMachineCollection];
            this.manpowers = [...this.manpowers, ...task.plannedPOManpowerCollection];
            this.checklists = [...this.checklists, ...task.plannedPOChecklistCollection];
            this.routeList.push(
              {
                listId: `TA${task.id}`,
                id: task.id,
                name: task.taskName,
                pid: `OP${operation.id}`,
                taskCode: task.taskCode,
                hasChild: true,
              }, {
              pid: `TA${task.id}`,
              listId: `MC${task.id}`,
              taskId: task.id,
              name: 'Machine'
            }, {
              pid: `TA${task.id}`,
              listId: `MP${task.id}`,
              taskId: task.id,
              name: 'ManPower'
            },
              {
                pid: `TA${task.id}`,
                listId: `CL${task.id}`,
                taskId: task.id,
                name: 'CheckList'
              }
            );
          });
        });
        this.field = { dataSource: this.routeList, id: 'listId', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
      });
  }
  previous() {
    this.completed.emit(0);
  }
  onNodeSelecting(args: NodeSelectEventArgs): void {
    const node: any = args.nodeData;
    this.type = node.id.substring(0, 2);
    if (this.type === 'RO') {
      const { operationCollection, ...routeData } = this.routesForCurrentBatch;
      this.selectedNode = routeData;
    }
    if (this.type === 'OP') {
      this.selectedNode = this.operations.find((route: any) => route.id === Number(node.id.substring(2)));
    }
    if (this.type === 'TA') {
      this.selectedNode = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
    }
    if (this.type === 'MC') {
      const taskId = node.id.substring(2);
      this.task = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
      this.operation = this.operations.find(operation => operation.id === this.task.plannedPOOperationId);
      this.selectedNode = this.machines.filter(machine => machine.plannedPOTaskId === Number(taskId));
    }
    if (this.type === 'MP') {
      const taskId = node.id.substring(2);
      this.task = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
      this.selectedNode = this.manpowers.filter(manpower => manpower.plannedPOTaskId === Number(taskId));
    }
    if (this.type === 'CL') {
      const taskId = node.id.substring(2);
      this.task = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
      this.selectedNode = this.checklists.filter(checklist => checklist.plannedPOTaskId === Number(taskId));
    }
  }

  submit() {
    if (this.batch) {
      this.showErrorMsg = false;
      this.completed.emit(2);
    } else {
      this.showErrorMsg = true;
    }

  }

}
