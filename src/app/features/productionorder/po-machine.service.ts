import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class POMachineService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedPOMachine/`;
  }
  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }
  get(id) {
    return this.http.get<any>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  getByTask(task: number) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllMachineByTaskId/' + task).pipe(map(response => response));
  }
  getByWorkCenter(workcenterId) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllByWorkCenterId/' + workcenterId).pipe(map(response => response));
  }

  add(machineToTask: any) {
    return this.http.post(this.baseUrl + 'insert', machineToTask).pipe(map(response => response));
  }
  update(machineToTask: any) {
    return this.http.put(this.baseUrl + 'update', machineToTask).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
