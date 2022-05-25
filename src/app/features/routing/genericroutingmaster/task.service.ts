import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/routing/TaskToOperation/`;
  }
  getAll() {
    return this.http.get<Task[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<Task>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  getTasksByOperation(operationId: number) {
    return this.http.get<Task[]>(this.baseUrl + 'getalltaskbyoperationid/' + operationId).pipe(map(response => response));
  }
  getLastTaskId() {
    return this.http.get<number>(this.baseUrl + 'GetLastTaskToOperationRequestId').pipe(map(response => response));
  }

  getByTaskCode(code: string) {
    return this.http.get<any>(this.baseUrl + 'GetAllByTaskCode/' + code).pipe(map(response => response));
  }

  add(task: Task) {
    return this.http.post(this.baseUrl + 'insert', task).pipe(map(response => response));
  }
  update(task: Task) {
    return this.http.put(this.baseUrl + 'update', task).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
