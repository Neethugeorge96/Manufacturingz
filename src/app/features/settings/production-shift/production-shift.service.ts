import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductionShift } from './production-shift.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionShiftService {
  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/shift/productionshift/`;
  }

  getLastPrductionshiftId() {
    return this.http.get<number>(this.baseUrl + 'GetLastProductionShiftRequestId').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<ProductionShift[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<ProductionShift[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(prod: ProductionShift) {
    return this.http.post(this.baseUrl + 'insert', prod).pipe(map(response => { return response; }));
  }

  update(prod: ProductionShift) {
    return this.http.put<number>(this.baseUrl + 'update', prod).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }
}
