import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EOCOperation } from './operation.model';

@Injectable({
  providedIn: 'root'
})
export class EOCOperationService {

  public baseUrl: string;
  public consoleUrl = environment.consoleApiUrl;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/EOC/OperationsEstimatedOperationsCost/`;
  }
  
  getAll() {
    return this.http.get<EOCOperation[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<EOCOperation>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  
  getByRoutingCode(code: string) {
    return this.http.get<EOCOperation[]>(this.baseUrl + 'GetAllByRoutingcode/' + code).pipe(map(response => response));
  }

  add(eOCOperation: EOCOperation) {
    return this.http.post(this.baseUrl + 'insert', eOCOperation).pipe(map(response => response));
  }
  update(eOCOperation: EOCOperation) {
    return this.http.put(this.baseUrl + 'update', eOCOperation).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

}
