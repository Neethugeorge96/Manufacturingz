import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class POManpowerService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedPOManpower/`;
  }
  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<any>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  getByTask(task: number) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllManPowerByTaskId/' + task).pipe(map(response => response));
  }

  add(manpowerToTask: any) {
    return this.http.post(this.baseUrl + 'insert', manpowerToTask).pipe(map(response => response));
  }
  update(manpowerToTask: any) {
    return this.http.put(this.baseUrl + 'update', manpowerToTask).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
