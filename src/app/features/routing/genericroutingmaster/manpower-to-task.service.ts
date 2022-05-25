import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ManpowerToTask } from './manpower-to-task.model';

@Injectable({
  providedIn: 'root'
})
export class ManpowerToTaskService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/routing/ManPowerToTask/`;
  }
  getAll() {
    return this.http.get<ManpowerToTask[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<ManpowerToTask>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  getByTask(task: number) {
    return this.http.get<ManpowerToTask[]>(this.baseUrl + 'GetAllManPowerByTaskId/' + task).pipe(map(response => response));
  }

  add(manpowerToTask: ManpowerToTask) {
    return this.http.post(this.baseUrl + 'insert', manpowerToTask).pipe(map(response => response));
  }
  update(manpowerToTask: ManpowerToTask) {
    return this.http.put(this.baseUrl + 'update', manpowerToTask).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
