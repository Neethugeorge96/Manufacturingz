import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EOCTask } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class EOCTaskService {

  public baseUrl: string;
  public consoleUrl = environment.consoleApiUrl;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/routing/TaskToOperation/`;
    this.consoleUrl = `${this.consoleUrl}Employee/`;
  }

  getAll() {
    return this.http.get<EOCTask[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<EOCTask>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  getTasksByOperation(operationNo: number){
    return this.http.get<EOCTask[]>(this.baseUrl + 'getalltaskbyoperationno/' + operationNo).pipe(map(response => response));
  }

  add(eOCTask: EOCTask) {
    return this.http.post(this.baseUrl + 'insert', eOCTask).pipe(map(response => response));
  }
  update(eOCTask: EOCTask) {
    return this.http.put(this.baseUrl + 'update', eOCTask).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

}
