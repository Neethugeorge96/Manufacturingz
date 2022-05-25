import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BatchTrackerService } from '@features/release-to-production/routing-time/batch-tracker.service';
import { ToolbarItems } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-production-order-batch-view',
  templateUrl: './production-order-batch-view.component.html'
})
export class ProductionOrderBatchViewComponent implements OnInit {
  @Input() batchWise: any;
  constructor() { }
  batchStart:boolean 
  batchClosed:boolean 
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.batchWise;
    this.batchStart = new Date(this.batchWise.startTime).getFullYear() !== 1970;
    this.batchClosed = new Date(this.batchWise.endTime).getFullYear() !== 1970;
  }
  getDate(date) {
    return new Date(date + 'Z');
  }

}
