import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ChecklistToTask } from './checklist-to-task.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistToTaskService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/routing/TaskCheckLists/`;
  }
  getAll() {
    return this.http.get<ChecklistToTask[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<ChecklistToTask>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  getByTask(task: number) {
    return this.http.get<ChecklistToTask[]>(this.baseUrl + 'GetAllCheckListByTaskId/' + task).pipe(map(response => response));
  }

  add(checklistToTask: ChecklistToTask) {
    return this.http.post(this.baseUrl + 'insert', checklistToTask).pipe(map(response => response));
  }
  update(checklistToTask: ChecklistToTask) {
    return this.http.put(this.baseUrl + 'update', checklistToTask).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
