import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ManPowerCategory } from './man-power-category.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManPowerCategoryService {

  public baseUrl: string;
  public consoleUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/ManpowerCategory/`;
    this.consoleUrl = `${environment.consoleApiUrl}currency/`;
  }

  getLastManpowerCategoryId() {
    return this.http.get<number>(this.baseUrl + 'GetLastManpowerCategoryRequestId').pipe(map(response => { return response; }));
  }
  getAllCurrency() {
    return this.http.get<any[]>(this.consoleUrl + 'getAll/').pipe(map(response => response));
  }

  getAll() {
    return this.http.get<ManPowerCategory[]>(this.baseUrl + 'getAll/')
      .pipe(
        map(response => response.map(category => {
          return {
            ...category,
            name: category.categoryName
          }
        })));
  }

  get(id) {
    return this.http.get<ManPowerCategory[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(manPowerCategory: ManPowerCategory) {
    return this.http.post(this.baseUrl + 'insert', manPowerCategory).pipe(map(response => response));
  }

  update(manPowerCategory: ManPowerCategory) {
    return this.http.put<number>(this.baseUrl + 'update', manPowerCategory).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

}
