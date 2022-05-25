import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachineWorkCenterService {

  public baseUrl: string;
  public http: HttpClient;
  consoleUrl: string;
  tradingUrl: string;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/mapper/machinetoworkcenter/`;
    this.consoleUrl = environment.consoleApiUrl;
    this.tradingUrl = environment.tradingApiUrl;
  }
  getAllCurrencies() {
    return this.http.get<any[]>(this.consoleUrl + 'currency/getAll')
      .pipe(map(response => response.map(currency => {
        return {
          text: currency.code,
          value: currency.id
        }
      })));
  }
  getMachines() {
    return this.http.get<any[]>(this.tradingUrl + 'item/getAll')
      .pipe(
        map(response => response.map(machine => {
          return {
            ...machine,
            text: `${machine.itemCommodityName}-${machine.itemCode}`,
            value: machine.id
          };
        }))
      );
  }
  getAll() {
    return this.http.get<any[]>(this.baseUrl + 'getAll/')
    .pipe(
      map(response => response.map(machine => {
        return {
          ...machine,
          text: `${machine.machineName}-${machine.machineId}`,
          value: machine.id
        };
      }))
    );
  }

  // get(id) {
  //   return this.http.get<ManPower[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  // }
  getByWorkCenter(workcenterId) {
    return this.http.get<any[]>(this.baseUrl + 'GetAllByWorkCenterId/' + workcenterId).pipe(map(response => response));
  }
  add(mapping: any) {
    return this.http.post(this.baseUrl + 'insert', mapping).pipe(map(response => response));
  }

  update(mapping: any) {
    return this.http.put<number>(this.baseUrl + 'update', mapping).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
}
