import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-production-order-operation-view',
  templateUrl: './production-order-operation-view.component.html'
})
export class ProductionOrderOperationViewComponent implements OnInit {
  @Input() operationWise: any;
  constructor() { }
  operationStart:boolean;
  operationClosed:boolean;
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.operationWise;
    this.operationStart = new Date(this.operationWise.startTime).getFullYear() !== 1970;
    this.operationClosed = new Date(this.operationWise.endTime).getFullYear() !== 1970;
  }
  getDate(date) {
    return new Date(date + 'Z');
  }

}
