import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HiredManPower } from './hired-man-power';

@Injectable({
  providedIn: 'root'
})
export class HiredManPowerService {

  public baseUrl: string;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/hiredmanpower/`;
  }
  getAll() {
    return this.http.get<HiredManPower[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }
  GetAllAssignHiredManPowerById(hiredManpowerId) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllAssignHiredManPowerById/' + hiredManpowerId).pipe(map(response => response));
  }

  get(id) {
    return this.http.get<HiredManPower>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }
  add(hiredManPower: HiredManPower) {
    return this.http.post(this.baseUrl + 'insert', hiredManPower).pipe(map(response => response));
  }

  update(hiredManPower: HiredManPower) {
    return this.http.put<number>(this.baseUrl + 'update', hiredManPower).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
  addSupplier(supplier) {
    return this.http.post(this.baseUrl + 'assignHiredManPowerToSupplier', supplier).pipe(map(response => response));
  }
  editSupplier(supplier) {
    return this.http.put(this.baseUrl + 'UpdateHiredManPowerToSupplier', supplier).pipe(map(response => response));
  }
  deleteSupplier(supplierId) {
    return this.http.delete(this.baseUrl + 'DeleteHiredManPowerToSupplier/' + supplierId).pipe(map(response => response));

  }
  getAssignedSuppliers(hiredManpowerId) {
    return this.http.get<any[]>(this.baseUrl + 'getAllAssignHiredManPowerById/' + hiredManpowerId).pipe(map(response => response));
  }
  getAllPoReference() {
    return of([{ text: 'Po 1', value: 1 }, { text: 'Po 2', value: 2 }]);
  }
  getAllSuppliers() {
    return of([{ text: 'Supplier 1', value: 1 }, { text: 'Supplier2', value: 2 }]);
  }
}
