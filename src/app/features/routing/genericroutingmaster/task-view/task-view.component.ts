import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styles: [
  ]
})
export class TaskViewComponent implements OnInit, OnChanges {
  @Input() task;
  taskDetail: Task;
  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.getTask();

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.task.previousValue && changes.task.currentValue.id !== changes.task.previousValue.id) {
      this.getTask();
    }
  }
  getTask() {
    this.taskService.get(this.task.id).subscribe(res => {
      this.taskDetail = res;
    });
  }

}
