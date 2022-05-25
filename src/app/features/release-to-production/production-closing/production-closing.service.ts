import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
// import { ProductionShift } from './production-shift.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionClosingService {
  public baseUrl: string;
  public baseUrlPO: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/TimeTracker/ProductionTimeTracker/`;
    this.baseUrlPO = `${baseUrl}api/ProductionOrder/PlannedProductionOrder/`;
  }
  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'getAll').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<any[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(prodClode: any) {
    return this.http.post(this.baseUrl + 'insert', prodClode).pipe(map(response => response));
  }

  update(prod: any) {
    return this.http.put<number>(this.baseUrl + 'update', prod).pipe(map(response => response));
  }
  updatePlannedProductionOrderStatus(prodOrderId: number, status: number) {
    return this.http.put<number>(this.baseUrlPO + 'UpdatePlannedProductionOrderStatus/' + prodOrderId + '/' + status, {})
    .pipe(map(response => response));
  }
  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
  getByPO(id: number) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllPOClosingDetailsByPOId/' + id).pipe(map(response => response));

  }
}
