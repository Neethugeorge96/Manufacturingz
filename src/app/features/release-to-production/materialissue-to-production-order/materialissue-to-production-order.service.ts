
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MaterialIssueToProductionOrder, PlannedPOBillOfMaterial } from './materialissue-production-order-model';

@Injectable({
  providedIn: 'root'
})
export class MaterialissuetoproductionorderService {
  public baseUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/Release/TileOne/MaterialIssueToProductionOrder/`;
  }

  getAll() {
    return this.http.get<MaterialIssueToProductionOrder[]>(this.baseUrl + 'getAll').pipe(map(response => { return response; }));
  }

  getMaterialIssueToProductionOrderByPOId(productionOrderId) {
    return this.http.get<MaterialIssueToProductionOrder[]>(this.baseUrl + 'GetMaterialIssueToProductionOrderByPOId/' + productionOrderId).pipe(map(response => { return response; }));
  }
  getPlannedPOBOMDetailsByPOId(productionOrderId) {
    return this.http.get<PlannedPOBillOfMaterial>(this.baseUrl + 'GetPlannedPOBOMDetailsByPOId/' + productionOrderId).pipe(map(response => { return response; }));
  }
  add(materialissuePO: MaterialIssueToProductionOrder) {
    return this.http.post(this.baseUrl + 'insert', materialissuePO).pipe(map(response => { return response; }));
  }

  update(materialissuePO: MaterialIssueToProductionOrder[]) {
    return this.http.put<number>(this.baseUrl + 'update', materialissuePO).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

}

















