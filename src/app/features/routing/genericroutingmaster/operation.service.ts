import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Operation } from './operation.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/routing/operationstorouting/`;
  }
  getAll() {
    return this.http.get<Operation[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<Operation>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  getByRoutingCode(id: number) {
    return this.http.get<Operation[]>(this.baseUrl + 'GetAllByRoutingId/' + id).pipe(map(response => response));
  }
  getLastId() {
    return this.http.get<number>(this.baseUrl + 'GetLastOperationsToRoutingRequestId/').pipe(map(response => response));
  }
  getByNumber(code: string) {
    return this.http.get<Operation>(this.baseUrl + 'GetAllByOperationCode/' + code).pipe(map(response => response));
  }

  add(operation: Operation) {
    return this.http.post(this.baseUrl + 'insert', operation).pipe(map(response => response));
  }
  update(operation: Operation) {
    return this.http.put(this.baseUrl + 'update', operation).pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}

