import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EOCMachine } from './machine-to-task.model';

@Injectable({
  providedIn: 'root'
})
export class EOCMachineToTaskService {

  public baseUrl: string;
  public consoleUrl = environment.consoleApiUrl;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/EOC/MachinesEstimatedOperationCost/`;
  }
  
  getAll() {
    return this.http.get<EOCMachine[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  getAllEOCMachineByTaskId(taskId) {
    return this.http.get<EOCMachine>(this.baseUrl + 'GetAllEOCMachineByTaskId/' + taskId).pipe(map(response => response));
  }

  get(id) {
    return this.http.get<EOCMachine>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  
  getByRoutingCode(code: string) {
    return this.http.get<EOCMachine[]>(this.baseUrl + 'GetAllByRoutingcode/' + code).pipe(map(response => response));
  }

  add(eocMachine: EOCMachine) {
    return this.http.post(this.baseUrl + 'insert', eocMachine).pipe(map(response => response));
  }
  update(eocMachine: EOCMachine) {
    return this.http.put(this.baseUrl + 'update', eocMachine).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

}
