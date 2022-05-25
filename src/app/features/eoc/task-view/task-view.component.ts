import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html'
})
export class TaskViewComponent implements OnInit {

  @Input() task:any;

  constructor() { }

  ngOnInit(): void {
    console.log("task",this.task)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      // this.routingId = Number(this.route.snapshot.paramMap.get('id'));
      this.task;
      }
  }

}
