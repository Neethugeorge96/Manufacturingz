import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { TaskTimeTrackerModel } from './task-time-tracker-model';

@Injectable({
  providedIn: 'root'
})
export class TaskTrackerService {

  public baseUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/TimeTracker/taskTimeTracker/`;
  }
  get(id) {
    return this.http.get<TaskTimeTrackerModel>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(productionOrder ) {
    return this.http.post<TaskTimeTrackerModel[]>(this.baseUrl + 'insert', productionOrder).pipe(map(response => response));
  }

  update(productionOrder ) {
    return this.http.put<number>(this.baseUrl + 'update', productionOrder).pipe(map(response => response));
  }
  getByOperaton(operationTrackerId: number) {
    return this.http.get<TaskTimeTrackerModel[]>(this.baseUrl + 'GetTaskDetailsByOperationTimeTrackerId/' + operationTrackerId)
      .pipe(map(response => response));
  }
}
