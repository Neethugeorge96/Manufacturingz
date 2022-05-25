import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BOMItem, MaintainProduction } from './bom.model';

@Injectable({
  providedIn: 'root'
})
export class BomService {
  public baseUrl: string;
  public tradingUrl: string;
  public tradingItemUrl: string;
  public maintainProductionBaseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/BOM/BOMItem/`;
    this.maintainProductionBaseUrl = `${baseUrl}api/manufacturing/BOM/maintainProduction/`;
    this.tradingUrl = `${environment.tradingApiUrl}`;
  }
  getAllItem() {
    return this.http.get<any[]>(this.tradingUrl + 'Item/getAll').pipe(map(response => { return response; }));
  }
  getAllUOM() {
    return this.http.get<any[]>(this.tradingUrl + 'Uom/getAll').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<MaintainProduction[]>(this.maintainProductionBaseUrl + 'getAll').pipe(map(response => { return response; }));
  }
  getByItemCode(itemcode: string) {
    return this.http.get<any[]>(this.maintainProductionBaseUrl + 'GetBOMItemsByProductionCode/' + itemcode)
      .pipe(map(response => response));

  }
  GetBOMItems(id) {
    return this.http.get<MaintainProduction>(this.maintainProductionBaseUrl + 'GetBOMItems/' + id).pipe(map(response => { return response; }));
  }
  get(id) {
    return this.http.get<BOMItem[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(maintainProductionBOM: any) {
    return this.http.post(this.maintainProductionBaseUrl + 'insert', maintainProductionBOM).pipe(map(response => { return response; }));
  }

  update(bomitem: any) {
    return this.http.put<number>(this.maintainProductionBaseUrl + 'update', bomitem).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.maintainProductionBaseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }
}
