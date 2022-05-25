import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductionLine } from './production-line.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionLineService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/ProductionLine/`;
  }
  
  getLastPrductionLineId() {
    return this.http.get<number>(this.baseUrl + 'GetLastProductionLineRequestId').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<ProductionLine[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }
  getAllProductionLine(id: number) {
    return this.http.get<ProductionLine[]>(this.baseUrl + 'getAllProductionLine/' + id).pipe(map(response => response));
  }

  get(id) {
    return this.http.get<ProductionLine[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(productionLine: ProductionLine) {
    return this.http.post(this.baseUrl + 'insert', productionLine).pipe(map(response => response));
  }

  update(productionLine: ProductionLine) {
    return this.http.put<number>(this.baseUrl + 'update', productionLine).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

  isAssigned(productionLineCode: string, status: boolean) {
    return this.http.put<number>(this.baseUrl + 'UpdateIsAssigned/' + productionLineCode + '/' + status, { productionLineCode, status }).pipe(map(response => response));

  }

}
