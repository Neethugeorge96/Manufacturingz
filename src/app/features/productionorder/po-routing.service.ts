import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { POheader } from './productionorder.model';

@Injectable({
  providedIn: 'root'
})
export class PORoutingService {

  public baseUrl: string;
  public tradingUrl: string;
  public tradingItemUrl: string;
  public batchUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/ProductionOrder/PlannedPORouting/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
    // this.batchUrl =

  }

  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'api/ProductionOrder/PlannedPORouting/').pipe(map(response => response));
  }

  getByRoute(id) {
    return this.http.get<any>(this.baseUrl + 'GetPlannedPORoutingDetails/' + id)
      .pipe(map(response => {
        return response.map((route: any) => {
          let batch: number;
          if (route.plannedPOManpowerCollection.length) {
            batch = route.plannedPOManpowerCollection[0].batchNumber;
          }
          return {
            ...route,
            batch
          }
        });
      }));
  }
  getRoutingDetails(poId, batch) {
    return this.http.get<any>(this.baseUrl + 'GetPlannedPORoutingDetails/' + poId + '/' + batch).pipe(map(response => response));
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
