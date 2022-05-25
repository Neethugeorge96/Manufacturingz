

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ProductionClosingService } from '../production-closing.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-production-closing',
  templateUrl: './production-closing.component.html',
})
export class ProductionClosingComponent implements OnInit {
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  poId: number;
  type = 'BA';
  field;
  routeList = [];
  routesForCurrentBatch: { [x: string]: any; operationCollection: any; };
  selectedNode: any;
  task: any;
  operation: any;
  batchNumber: number;
  operations: any;
  tasks: any;
  machines: any;
  manpowers: any;
  checklists: any;
  nodeId: number;
  batches = [];
  batchWise: any;
  operationWise: any[];
  taskWise: any[];
  batchFirstData: any;
  sumOfBatchOutput: number;
  constructor(
    private toastr: ToasterDisplayService,
    private productionClosingService: ProductionClosingService,
    private route: ActivatedRoute, private datePipe: DatePipe, private router: Router) { }
  public hideDialog: EmitType<object> = () => {
    this.ejDialog.hide();
  }

  ngOnInit(): void {
    this.poId = Number(this.route.snapshot.paramMap.get('id'));
    this.getRoutingDetails();
  }
  getRoutingDetails() {
    this.productionClosingService.getByPO(this.poId).subscribe(res => {
      if (res.length) {
        this.batches = res;
        if (this.batches.length != 0) {
          this.sumOfBatchOutput = 0;
          this.batches.forEach(element => {
            this.sumOfBatchOutput += element.batchOutput
          });
        }
        this.createListView(res);
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
    if (this.type === "BA" && this.batches.length != 0) {
      this.batchWise = this.batches.find(batch => batch.id === this.nodeId);
      this.batchFirstData = this.batchWise;
    }
  }
  onNodeSelecting(args: NodeSelectEventArgs): void {
    const node: any = args.nodeData;
    this.type = node.id.split('~')[1];
    this.nodeId = Number(node.id.split('~')[2]);
    if (this.type === "BA" && this.batches.length != 0) {
      this.batchWise = this.batches.find(batch => batch.id === this.nodeId);
    }
    this.operationWise = [];
    for (let i = 0; i < this.batches.length; i++) {
      for (let j = 0; j < this.batches[i].operationCollection.length; j++) {
        const element = this.batches[i].operationCollection[j];
        this.operationWise.push(element);
      }
    }
    if (this.type === "OP" && this.operationWise.length != 0) {
      this.operationWise = this.operationWise.find(op => op.id === this.nodeId);
    }

    if (this.type === "TA" && this.operationWise.length != 0) {
      this.taskWise = [];
      for (let i = 0; i < this.operationWise.length; i++) {
        for (let j = 0; j < this.operationWise[i].taskCollection.length; j++) {
          const element = this.operationWise[i].taskCollection[j];
          this.taskWise.push(element);
        }
      }
      if (this.taskWise.length != 0) {
        this.taskWise = this.taskWise.find(tsk => tsk.id === this.nodeId);
      }
    }


  }
  openProductionClosePopup() {
    this.ejDialog.show();
  }
  productionCloseItem(event) {
    let _insertdata = event;
    _insertdata.startTime = this.datePipe.transform(_insertdata.startTime, 'yyyy/MM/dd h:mm a');
    _insertdata.endTime = this.datePipe.transform(_insertdata.endTime, 'yyyy/MM/dd h:mm a');
    this.productionClosingService.add(_insertdata)
      .subscribe(res => {
        if (res) {
          this.productionClosingService.updatePlannedProductionOrderStatus(this.poId, 4)
            .subscribe(res => {
              if (res) {
                this.hideDialog();
                this.toastr.showSuccessMessage('Production closed!');
                this.router.navigate(['/release-to-production/release-production-list/edit/' + this.poId]);
              }
            })
        }
      },
        error => {
          console.error("err", error);
          this.toastr.showErrorMessage('Unable to close production');
        }
      );

  }
  ClosePopup(event) {
    if (event == true) {
      this.hideDialog();
    }
  }
}


