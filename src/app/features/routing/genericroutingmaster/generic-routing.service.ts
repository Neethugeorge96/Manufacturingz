import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, } from 'rxjs';
import { flatMap, map, switchMap, tap } from 'rxjs/operators';

import { BasicRouting } from './generic-routing.model';
import { OperationService } from './operation.service';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class GenericRoutingService {
  public baseUrl: string;
  public http: HttpClient;

  constructor(
    http: HttpClient,
    private operationService: OperationService,
    private taskService: TaskService,
    @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/routing/basicrouting/`;
  }
  getAll() {
    return this.http.get<BasicRouting[]>(this.baseUrl + 'getAll/')
      .pipe(
        map(response => response.map(routing => {
          return {
            ...routing,
            value: `${routing.routingName}-${routing.routingCode}`
          };
        }))
      );
  }

  get(id) {
    return this.http.get<BasicRouting>(this.baseUrl + 'get/' + id)
      .pipe(
        map(route => {
          return {
            ...route,
            listID: `RO${route.id}`,
            name: route.routingName
          };
        })
      );
  }
  getList(route) {
    const listItem = [{
      ...route,
      listID: `RO${route.id}`,
      name: route.routingName,
      hasChild: true,
    }];
    return this.operationService.getByRoutingCode(route.id)
      .pipe(
        tap((operations) => {
          operations.forEach(operation => {
            listItem.push({
              ...operation,
              listID: `OP${operation.id}`,
              name: operation.operationName,
              pid: `RO${route.id}`,
              hasChild: true,
            });
          });
        }),
        switchMap(operations => {
          if (operations.length) {
            return this.getTasks(operations);
          }
          return operations;
        }),
        flatMap((task: any) => task),
        tap((tasks: Task[]) => tasks.forEach(task => {
          listItem.push({
            ...task,
            listID: `TA${task.id}`,
            name: task.taskName,
            hasChild: true,
          }, {
            pid: `TA${task.id}`,
            listID: `MC${task.id}`,
            taskId: task.id,
            name: 'Machine'
          }, {
            pid: `TA${task.id}`,
            listID: `MP${task.id}`,
            taskId: task.id,
            name: 'ManPower'
          }, {
            pid: `TA${task.id}`,
            listID: `CL${task.id}`,
            taskId: task.id,
            name: 'CheckList'
          });
        })),
        map(() => listItem)
      );
  }

  getTasks(operations) {
    const taskCalls = [];
    operations.map(op => {
      taskCalls.push(this.taskService.getTasksByOperation(op.id));
    });
    return forkJoin(taskCalls).pipe(
      map(res => res.map((tasks: Task[], i) => tasks.map(task => {
        return {
          ...task,
          pid: `OP${operations[i].id}`,
          hasChild: true,
        };
      })))
    );
  }

  getLastGenericRouteId() {
    return this.http.get<number>(this.baseUrl + 'GetLastBasicRoutingRequestId').pipe(map(response => { return response; }));
  }
  getAllRoutingDetails(id: number) {
    return this.http.get<any>(this.baseUrl + 'GetALLRoutingDetails/' + id).pipe(map(response => response));
  }
  getProductLineDetails() {
    return this.http.get<any[]>(this.baseUrl + 'GetAllProductLineDetails').pipe(map(response => response));
  }

  add(basicRouting: BasicRouting) {
    return this.http.post(this.baseUrl + 'insert', basicRouting).pipe(map(response => response));
  }
  update(basicRouting: BasicRouting) {
    return this.http.put(this.baseUrl + 'update', basicRouting).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
