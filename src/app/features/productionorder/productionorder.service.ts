
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { POheader } from './productionorder.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionorderService {
  public baseUrl: string;
  public tradingUrl: string;
  public tradingItemUrl: string;
  public batchUrl: string;
  public routrUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedProductionOrder/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
    this.routrUrl = `${baseUrl}api/ProductionOrder/PlannedPORouting/`;

  }

  getAll() {
    return this.http.get<POheader[]>(this.baseUrl + 'getAll').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<any>(this.baseUrl + 'get/' + id).pipe(map(response => response));
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
  updatePlannedProductionOrderStatus(prodOrderId: number, status: number) {
    return this.http.put<number>(this.baseUrl + 'UpdatePlannedProductionOrderStatus/' + prodOrderId + '/' + status, {})
      .pipe(map(response => response));
  }
  getLastNumber() {
    return this.http.get<any>(this.baseUrl + 'GetLastPlannedProductionOrderRequestId').pipe(map(response => response));
  }
  getAllUOM() {
    return this.http.get<any[]>(this.tradingUrl + 'Uom/getAll').pipe(map(response => response));
  }
  getAllItem() {
    return this.http.get<any[]>(this.tradingUrl + 'Item/getAll')
      .pipe(map(response => response.filter(item => item.itemType === 'Manufactured')));;
  }

  getPlannedPORoutingDetails(id, batch) {
    return this.http.get<any>(this.routrUrl + 'GetPlannedPORoutingDetails/' + id + '/' + batch).pipe(map(response => response));
  }

  getTaskDetails(taskId: number) {
    return this.http.get<any>(this.routrUrl + 'GetPlannedPOTaskDetails/' + taskId).pipe(map(response => response));
  }
  getAllRoutingDetailsById(poId: number) {
    return this.http.get<any>(this.routrUrl + 'GetPlannedPORoutingDetailsById/' + poId).pipe(map(response => response));
  }

}
