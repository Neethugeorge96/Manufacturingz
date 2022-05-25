import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BatchSize } from './batch-control.model';

@Injectable({
  providedIn: 'root'
})
export class BatchControlService {

  public baseUrl: string;
  public consoleUrl: string;
  public tradingUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/batchProduction/batchSize/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
  }
 
  getUom(id : number){
    return this.http.get<any[]>(this.tradingUrl + 'Item/Config/Get/' + id).pipe(map(response => { return response; }));
  }
  getLastBatchId() {
    return this.http.get<number>(this.baseUrl + 'GetLastBatchSizeRequestId').pipe(map(response => { return response; }));
  }
  getAllItem() {
    return this.http.get<any[]>(this.tradingUrl + 'Item/getAll').pipe(map(response => { return response; }));
  }
  getAllUOM() {
    return this.http.get<any[]>(this.tradingUrl + 'Uom/getAll').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<BatchSize[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }
  add(batch: BatchSize) {
    return this.http.post(this.baseUrl + 'insert', batch).pipe(map(response => { return response; }));
  }
  update(batch: BatchSize) {
    return this.http.put<number>(this.baseUrl + 'update', batch).pipe(map(response => { return response; }));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }
}
