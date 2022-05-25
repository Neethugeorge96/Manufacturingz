import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Task } from '@features/routing/genericroutingmaster/task.model';
import { TaskService } from '@features/routing/genericroutingmaster/task.service';

@Component({
  selector: 'app-po-task-view',
  templateUrl: './po-task-view.component.html',
  styles: [
  ]
})
export class POTaskViewComponent implements OnInit, OnChanges {
  @Input() task;
  taskFromRouting: Task;
  cost: number;
  constructor(
    private taskService: TaskService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task.currentValue.operationCode !== changes.task.previousValue.operationCode) {
      this.taskService.getByTaskCode(this.task.taskCode).subscribe(res => {
        this.taskFromRouting = res;
        const machineCost = res.machineList.reduce((sum, machine) => sum + machine.costRatePerHour, 0);
        const manpowerCost = res.manpowerList.reduce((sum, manpower) => sum + manpower.costPerHour, 0);
        this.cost = machineCost + manpowerCost;
      });
    }
  }

  ngOnInit(): void {
    this.taskService.getByTaskCode(this.task.taskCode).subscribe(res => {
      this.taskFromRouting = res;
      const machineCost = res.machineList.reduce((sum, machine) => sum + machine.costRatePerHour, 0);
      const manpowerCost = res.manpowerList.reduce((sum, manpower) => sum + manpower.costPerHour, 0);
      this.cost = machineCost + manpowerCost;
    });
  }

}
