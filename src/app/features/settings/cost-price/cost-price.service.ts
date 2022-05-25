import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CostPriceComponet } from './cost-price.model';

@Injectable({
  providedIn: 'root'
})
export class CostPriceService {

  public baseUrl: string; 
  public consoleUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/CPC/`;
    this.consoleUrl = `${environment.consoleApiUrl}Branch/`;
  }

  getLastCPCId() {
    return this.http.get<number>(this.baseUrl + 'GetLastCostPriceComponentRequestId').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<CostPriceComponet[]>(this.baseUrl + 'getAll/').pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<CostPriceComponet[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(costPriceComponent: CostPriceComponet) {
    return this.http.post(this.baseUrl + 'insert', costPriceComponent).pipe(map(response => { return response; }));
  }

  update(costPriceComponent: CostPriceComponet) {
    return this.http.put<number>(this.baseUrl + 'update', costPriceComponent).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

  updateCpcIsAssigned(id : any) {
    return this.http.put(this.baseUrl + 'UpdateIsAssigned', id).pipe(map(response => { return response; }));
  }

}
