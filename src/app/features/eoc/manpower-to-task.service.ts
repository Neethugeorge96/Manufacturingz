import { EOCManpower } from './manpower-to-task.model';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EOCManpowerToTaskService {

  public baseUrl: string;
  public consoleUrl = environment.consoleApiUrl;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/EOC/ManPowersEstimatedOperationsCost/`;
  }
  
  getAll() {
    return this.http.get<EOCManpower[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  getAllEOCManpowerByTaskId(taskId) {
    return this.http.get<EOCManpower>(this.baseUrl + 'GetAllEOCManpowerByTaskId/' + taskId).pipe(map(response => response));
  }

  get(id) {
    return this.http.get<EOCManpower>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  
  getByRoutingCode(code: string) {
    return this.http.get<EOCManpower[]>(this.baseUrl + 'GetAllByRoutingcode/' + code).pipe(map(response => response));
  }

  add(eocManpower: EOCManpower) {
    return this.http.post(this.baseUrl + 'insert', eocManpower).pipe(map(response => response));
  }
  update(eocManpower: EOCManpower) {
    return this.http.put(this.baseUrl + 'update', eocManpower).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

}
