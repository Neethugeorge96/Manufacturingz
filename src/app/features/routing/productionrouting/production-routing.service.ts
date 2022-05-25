import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ProductionRouting } from './production-routing.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductionRoutingService {

  public baseUrl: string;
  public http: HttpClient;
  public tradingUrl: string;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/Routing/ProductionRouting/`;
    this.tradingUrl = `${environment.tradingApiUrl}Item/`;
  }

  getAll() {
    return this.http.get<ProductionRouting[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  getItemMaster() {
    return this.http.get<any[]>(this.tradingUrl + 'getAll/')
      .pipe(
        map(response => response.filter(item => item.itemTypeName == "Manufactured")));
  }

  get(id) {
    return this.http.get<ProductionRouting[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(productionRouting: ProductionRouting) {
    return this.http.post(this.baseUrl + 'insert', productionRouting).pipe(map(response => response));
  }

  update(productionRouting: ProductionRouting) {
    return this.http.put<number>(this.baseUrl + 'update', productionRouting).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

}
