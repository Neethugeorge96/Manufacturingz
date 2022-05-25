import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EOCBasicModel } from './eoc.model';
import { EOCOperationService } from './operation.service';
import { EOCTaskService } from './task.service';

import { forkJoin, of } from 'rxjs';
import { flatMap, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EOCTask } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class EocService {

  public baseUrl: string;
  public routeUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient,
    private operationService: EOCOperationService,
    private taskService: EOCTaskService,
    @Inject('BASE_URL') baseUrl: string
  ) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/EOC/BasicEstimatedOperationsCost/`;
  }


  getAll() {
    return this.http.get<EOCBasicModel[]>(this.baseUrl + 'getAll/').pipe(map(response => { return response; }));
  }

  getEOCBOMDetails(id) {
    return this.http.get<EOCBasicModel[]>(this.baseUrl + 'GetEOCBOMDetails/' + id).pipe(map(response => { return response; }));
  }

  getRoutingcode(id) {
    return this.http.get<EOCBasicModel[]>(this.baseUrl + 'GetRoutingcode/' + id).pipe(map(response => { return response; }));
  }

  // getAllRoutingDetails(id) {
  //   return this.http.get<any[]>(this.routeUrl + 'GetALLRoutingDetails/' + id).pipe(map(response => { return response; }));
  // }

  getEocRoutingDetails(id) {
    return this.http.get<any[]>(this.baseUrl + 'GetEOCRoutingDetails/' + id).pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<EOCBasicModel>(this.baseUrl + 'get/' + id)
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
    return this.operationService.getByRoutingCode(route.routingCode)
      .pipe(
        // tap((route) => listItem.push({
        //   ...route,
        //   listID: `RO${route.id}`,
        //   name: route.routingName,
        //   hasChild: true,
        // })),
        // switchMap((results) => this.operationService.getByRoutingCode(results.routingCode)),
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
        switchMap(operations => this.getTasks(operations)),
        flatMap(task => task),
        tap((tasks: EOCTask[]) => tasks.forEach(task => {
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
    console.log(operations);
    const taskCalls = [];
    operations.map(op => {
      taskCalls.push(this.taskService.getTasksByOperation(op.operationNo));
    });
    return forkJoin(taskCalls).pipe(
      map(res => res.map((tasks: EOCTask[], i) => tasks.map(task => {
        return {
          ...task,
          pid: `OP${operations[i].id}`,
          hasChild: true,
        };
      })))
    );
  }

  add(eOCBasicModel: any) {
    return this.http.post<number>(this.baseUrl + 'insert', eOCBasicModel).pipe(map(response => { return response; }));
  }

  update(eOCBasicModel: any) {
    return this.http.put<number>(this.baseUrl + 'update', eOCBasicModel).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

}
