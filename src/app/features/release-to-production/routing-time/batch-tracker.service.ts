import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Operation } from '@features/routing/genericroutingmaster/operation.model';
import { map } from 'rxjs/operators';
import { BatchTimeTrackerModel } from './batch-time-tracker-model';

@Injectable({
  providedIn: 'root'
})
export class BatchTrackerService {
  public baseUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/TimeTracker/BatchTimeTracker/`;
  }
  get(id) {
    return this.http.get<BatchTimeTrackerModel>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(productionOrder: any) {
    return this.http.post<BatchTimeTrackerModel>(this.baseUrl + 'insert', productionOrder).pipe(map(response => response));
  }

  update(productionOrder: BatchTimeTrackerModel) {
    return this.http.put<number>(this.baseUrl + 'update', productionOrder).pipe(map(response => response));
  }
  getOperations(batchTrackerId: number) {
    return this.http.get<Operation[]>(this.baseUrl + 'GetBatchBackFlushByTimeTrackerId/' + batchTrackerId)
      .pipe(map(response => response));
  }

}
