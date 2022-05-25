import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Operation } from '@features/routing/genericroutingmaster/operation.model';
import { map } from 'rxjs/operators';
import { OperationTimeTrackerModel } from './operation-time-tracker-model';

@Injectable({
  providedIn: 'root'
})
export class OperationTrackerService {

  public baseUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/TimeTracker/operationTimeTracker/`;
  }
  get(id) {
    return this.http.get<OperationTimeTrackerModel>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(productionOrder: OperationTimeTrackerModel) {
    return this.http.post<OperationTimeTrackerModel[]>(this.baseUrl + 'insert', productionOrder).pipe(map(response => response));
  }

  update(productionOrder: OperationTimeTrackerModel) {
    return this.http.put<number>(this.baseUrl + 'update', productionOrder).pipe(map(response => response));
  }
  getOperationToRouting(trackerId: number) {
    return this.http.get<Operation>(this.baseUrl + 'getoperationtoroutingbytimetrackerid/' + trackerId).pipe(map(response => response));
  }
  getByBatch(batchTrackerId: number) {
    return this.http.get<OperationTimeTrackerModel[]>(this.baseUrl + 'GetOperationDetailsByBatchTimeTrackerId/' + batchTrackerId)
      .pipe(map(response => response));
  }
}
