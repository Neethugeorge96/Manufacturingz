import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NodeClickEventArgs, NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EocService } from '../eoc.service';

@Component({
  selector: 'app-eoc-routing',
  templateUrl: './eoc-routing.component.html'
})
export class EocRoutingComponent implements OnInit {

  eocBasicId: number;
  routeList: object[] = [];
  public field: Object = { dataSource: this.routeList, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  id: any;
  type:any;
  value:any[];
  workCenterId: any[];
  operations = [];
  tasks = [];
  machines = [];
  manpowers = [];
  task = [];
  operation = [];
  selectedNode: any;
  selectedRoute:any;
  selectedTask: any;
  routesForCurrentBatch;
  @Output() completed: EventEmitter<any> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    public modalService: NgbModal,
    private eocService:EocService,
  ) { }

  ngOnInit(): void {
    this.eocBasicId = Number(this.route.snapshot.paramMap.get('id'));
    this.getEocRoutingDetails();

  }

  getEocRoutingDetails() {
    this.eocService.getEocRoutingDetails(this.eocBasicId).subscribe((res:any) => {
      this.type = 'RO';
      this.routesForCurrentBatch = res;
      this.routeList = [
        {
          listId: `RO${res.id}`,
          name: res.routingName,
          hasChild: true,
          selected: true
        }];
      const { eocOperationCollection, ...routeData } = this.routesForCurrentBatch;
      this.selectedNode = routeData;
      res.eocOperationCollection.map(operation => {
        this.operations = [...this.operations, operation];
        this.routeList.push(
          {
            listId: `OP${operation.id}`,
            id: operation.id,
            operationCode: operation.operationCode,
            name: operation.operationName,
            workCenterId: operation.workCenterId,
            pid: `RO${res.id}`,
            hasChild: operation.eocTaskCollection.length,
          }
        );
        operation.eocTaskCollection.map(task => {
          this.tasks = [...this.tasks, task];
          this.machines = [...this.machines, ...task.eocMachineCollection];
          this.manpowers = [...this.manpowers, ...task.eocManpowerCollection];
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
          }
          );
        });
      });
      this.field = { dataSource: this.routeList, id: 'listId', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the EOC routing details ');
      });
  }

  isNodeClicked(args: NodeClickEventArgs) {
  }

  onNodeSelecting(args: NodeSelectEventArgs): void {
    const node: any = args.nodeData;
    this.type = node.id.substring(0, 2);
    if (this.type === 'RO') {
      const { eocOperationCollection, ...routeData } = this.routesForCurrentBatch;
      this.selectedNode = routeData;
      this.id =  Number(node.id.substring(2));
    }
    if (this.type === 'OP') {
      const { eocOperationCollection, ...routeData } = this.routesForCurrentBatch;
      this.selectedRoute = routeData;
      this.selectedNode = this.operations.find((route: any) => route.id === Number(node.id.substring(2)));
      this.id =  Number(node.id.substring(2));

    }
    if (this.type === 'TA') {
      this.selectedNode = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
      this.id =  Number(node.id.substring(2));

    }
    if (this.type === 'MC') {
      const taskId = node.id.substring(2);
      this.task = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
      const { eocTaskCollection, ...routeData } = this.routesForCurrentBatch;
      this.selectedTask = this.routesForCurrentBatch;
      this.selectedNode = this.machines.filter(machine => machine.taskId === Number(taskId));
    }
    if (this.type === 'MP') {
      const taskId = node.id.substring(2);
      this.task = this.tasks.find((route: any) => route.id === Number(node.id.substring(2)));
      this.selectedNode = this.manpowers.filter(manpower => manpower.taskId === Number(taskId));
    }
  }

  previous(){
    this.completed.emit(0);
  }

  next() {
    this.completed.emit(2);
  }

}
