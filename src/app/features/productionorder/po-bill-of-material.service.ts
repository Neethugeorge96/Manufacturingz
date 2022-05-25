import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class POBillOfMaterialService {

  public baseUrl: string;
  public tradingUrl: string;
  public tradingItemUrl: string;
  public batchUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedPOBillOfMaterial/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'api/ProductionOrder/PlannedPORouting/').pipe(map(response => response));
  }
  getByProductionOrderBatch(productionOrder: number, batch: number) {
    return this.http.get<any[]>(this.baseUrl + 'GetPlannedPOBillOfMaterialsByProductOrder/' + productionOrder + '/' + batch)
    .pipe(map(response => response));
  }
  getAllMappedMaintainProductionId() {
    return this.http.get<number[]>(this.baseUrl + 'GetAllMappedMaintainProductionId').pipe(map(response => { return response; }));
  }
  add(data: any) {
    return this.http.post(this.baseUrl + 'insert', data).pipe(map(response => response));
  }

  update(data: any) {
    return this.http.put<number>(this.baseUrl + 'update', data).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
