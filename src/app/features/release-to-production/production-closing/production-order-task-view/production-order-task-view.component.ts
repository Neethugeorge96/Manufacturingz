import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-production-order-task-view',
  templateUrl: './production-order-task-view.component.html'
})
export class ProductionOrderTaskViewComponent implements OnInit {

  @Input() taskWise: any;
  taskStart:boolean;
  taskClosed:boolean;
  constructor() { }
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.taskWise;
    this.taskStart = new Date(this.taskWise.startTime).getFullYear() !== 1970;
    this.taskClosed = new Date(this.taskWise.endTime).getFullYear() !== 1970;
  }
  getDate(date) {
    return new Date(date + 'Z');
  }

}
