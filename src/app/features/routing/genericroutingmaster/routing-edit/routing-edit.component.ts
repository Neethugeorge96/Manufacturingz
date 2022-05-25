import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { Query } from '@syncfusion/ej2-data';

import { ProductionLine } from '@settings/production-line/production-line.model';
import { ProductionLineService } from '@settings/production-line/production-line.service';
import { enumSelector } from '@shared/utils/common.functions';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { RoutingType } from 'src/app/models/common/types/routingtype';
import { BasicRouting } from '../generic-routing.model';
import { GenericRoutingService } from '../generic-routing.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-routing-edit',
  templateUrl: './routing-edit.component.html',
  styles: [
  ]
})
export class RoutingEditComponent implements OnInit {
  routingId: number;
  routeForm: FormGroup;
  routingTypes = enumSelector(RoutingType);
  routeList: any[] = [];
  type = null;
  costToTask = {};
  currentRoute;
  public field: object = { dataSource: this.routeList, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  selectedNode: any;
  parentOperation: object;
  productionLines: ProductionLine[] = [];
  otherRoutes: BasicRouting[] = [];
  public fields: object = { text: 'routingName', value: 'value' };
  public query: Query = new Query().select(['routingName', 'routingCode', 'value']).take(6);
  public filterType = 'Contains';
  previousUpdate: any;

  submitClicked: boolean;

  get routingName() { return this.routeForm.get('routingName'); }
  get routingType() { return this.routeForm.get('routingType'); }
  get productionLineCode() { return this.routeForm.get('productionLineCode'); }
  get mainRoutingCode() { return this.routeForm.get('mainRoutingCode'); }
  constructor(
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    private genericRoutingService: GenericRoutingService,
    private productionLineService: ProductionLineService,
  ) {

  }

  ngOnInit(): void {
    this.routingId = Number(this.route.snapshot.paramMap.get('id'));
    this.productionLineService.getAll().subscribe(res => {
      this.productionLines = res;
    });
    this.getRoutingDetails();
    this.getRouteDetails();
    this.routeForm = this.createFormGroup();

  }
  getRouteDetails() {
    forkJoin([this.genericRoutingService.getAll(),
    this.genericRoutingService.get(this.routingId)]
    ).subscribe(([routes, route]) => {
      this.currentRoute = route;
      this.otherRoutes = routes.filter(thisRoute => thisRoute.id !== this.routingId);
      this.type = 'RO';
      this.selectedNode = {
        ...route,
        listId: `RO${route.id}`,
        name: route.routingName,
        hasChild: true
      };
      const mainRoute: any = this.otherRoutes.find(thisRoute => thisRoute.routingCode === route.mainRoutingCode);
      this.routeForm.patchValue({
        ...route,
        mainRoutingCode: mainRoute ? mainRoute.value : ''
      });

    });
  }
  getRoutingDetails(isFirstUpdate = true) {
    this.genericRoutingService.getAllRoutingDetails(this.routingId).subscribe(result => {
      this.routeList = [{
        listId: `RO${this.routingId}`,
        id: this.routingId,
        name: result.routingName,
        routingCode: result.routingCode,
        selected: isFirstUpdate === true,
        hasChild: result.operationsToRouting.length,
      }];
      result.operationsToRouting.map(operation => {
        this.routeList.push({
          listId: `OP${operation.id}`,
          id: operation.id,
          operationNumber: operation.operationNumber,
          name: operation.operationName,
          workCenterId: operation.workCenterId,
          pid: `RO${operation.routingId}`,
          hasChild: operation.taskToOperation.length,
        });
        operation.taskToOperation.map(task => {
          const machineCost = task.machineList.reduce((sum, machine) => sum + machine.costRatePerHour, 0);
          const manpowerCost = task.manpowerList.reduce((sum, manpower) => sum + manpower.costPerHour, 0);
          this.costToTask[task.id] = machineCost + manpowerCost;
          this.routeList.push({
            listId: `TA${task.id}`,
            id: task.id,
            name: task.taskName,
            pid: `OP${task.operationId}`,
            taskCode: task.taskCode,
            cost: machineCost + manpowerCost,
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
      if (!isFirstUpdate) {
        this.routeList = this.routeList.map(route => {
          if (route.listId === `RO${this.routingId}`) {
            return {
              ...route,
              expanded: true,
              // selected: false
            };
          } else {
            return route;
          }
        });
        this.routeList = this.routeList.map(route => {
          if (route.listId === this.previousUpdate.object.selected) {
            return {
              ...route,
              selected: true
            };
          } else {
            return route;
          }
        });
        if (this.previousUpdate.eventOn === 'OP') {
        } else {
          this.addExpanded(this.previousUpdate.object.listId, 3);
          this.routeList = this.routeList.map(route => {
            if (route.listId === this.previousUpdate.object.selected) {
              return {
                ...route,
                selected: true
              };
            } else {
              return route;
            }
          });
        }
      }
      this.field = { dataSource: this.routeList, id: 'listId', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
    });
  }
  addExpanded(id, noOfIterations) {
    let list = id;
    for (let index = 0; index < noOfIterations; index++) {
      this.routeList = this.routeList.map(route => {
        if (route.listId === list) {
          list = route.pid;
          return {
            ...route,
            expanded: true
          };
        } else { return route; }
      });

    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(0),
      routingCode: new FormControl({ value: '', disabled: true }, Validators.required),
      routingName: new FormControl('', [Validators.required,Validators.maxLength(36)]),
      routingType: new FormControl('', Validators.required),
      isCompleted: new FormControl(false),
      productionLineCode: new FormControl('', Validators.required),
      productionLineName: new FormControl(''),
      productionLineId: new FormControl(''),
      mainRoutingCode: new FormControl('')
    });
  }

  onNodeSelecting(args: NodeSelectEventArgs): void {
    const node: any = args.nodeData;
    this.type = node.id.substring(0, 2);
    if (this.type === 'RO' || this.type === 'OP' || this.type === 'TA') {
      this.selectedNode = this.routeList.find((route: any) => route.listId === node.id);
    }
    if (this.type === 'MC' || this.type === 'MP' || this.type === 'CL') {
      this.selectedNode = this.routeList.find((route: any) => route.listId === node.parentID);
      this.parentOperation = this.routeList.find((route: any) => route.listId === this.selectedNode.pid);
    }
  }

  listAltered(item) {
    this.previousUpdate = item;
    this.getRoutingDetails(false);
  }

  onSubmit() {
    this.submitClicked = true;
    if (this.routeForm.valid) {
      const selectedProductionLine = this.productionLines
        .find(productionLine => productionLine.productionLineCode === this.routeForm.value.productionLineCode);
      this.genericRoutingService.update({
        ...this.routeForm.getRawValue(),
        mainRoutingCode: this.routeForm.getRawValue().routingType === 2 ?
          this.routeForm.getRawValue().mainRoutingCode.substr(this.routeForm.getRawValue().mainRoutingCode.lastIndexOf('-') + 1)
          : '',
        productionLineName: selectedProductionLine ? selectedProductionLine.productionLineName : '',
        productionLineId: selectedProductionLine ? selectedProductionLine.id : 0,

      })
        .subscribe((res: any) => {
          if (res) {
            this.productionLineService.isAssigned(selectedProductionLine.productionLineCode, true).subscribe(() => { });
            this.toastr.showSuccessMessage('Route updated successfully');
          }
        });
    }

  }

  duplicationValidation(event){
    let routingName = event.target.value;
    this.otherRoutes.forEach(data => {
      if(data.routingName.toLowerCase() === routingName.toLowerCase()){
        this.toastr.showErrorMessage("Can't able to add duplicate generic Routing Name");
        this.routeForm.controls['routingName'].setValue(null);
      }
    })
    
    
  }

}
