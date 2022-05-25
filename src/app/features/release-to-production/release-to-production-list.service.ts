import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PlannedProductionOrder } from './release-to-production.model';

@Injectable({
  providedIn: 'root'
})
export class ReleaseToProductionListService {
  public baseUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedProductionOrder/`;
  }

  getAll() {
    return this.http.get<PlannedProductionOrder[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<PlannedProductionOrder[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(productionOrder: PlannedProductionOrder) {
    return this.http.post(this.baseUrl + 'insert', productionOrder).pipe(map(response => { return response; }));
  }

  update(productionOrder: PlannedProductionOrder) {
    return this.http.put<number>(this.baseUrl + 'update', productionOrder).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

}



