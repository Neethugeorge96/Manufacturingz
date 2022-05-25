import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { env } from 'process';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OwnManPower } from './own-man-power';

@Injectable({
  providedIn: 'root'
})
export class OwnManPowerService {

  public baseUrl: string;
  public consoleUrl = environment.consoleApiUrl;
  public http: HttpClient;
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/ownmanpower/`;
    this.consoleUrl = `${this.consoleUrl}Employee/`;
  }
  getAll() {
    return this.http.get<OwnManPower[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<OwnManPower[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(ownManPower: OwnManPower) {
    return this.http.post(this.baseUrl + 'insert', ownManPower).pipe(map(response => response));
  }

  update(ownManPower: OwnManPower) {
    return this.http.put<number>(this.baseUrl + 'update', ownManPower).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }
  getAllEmployeesByCompany(id) {
    return this.http.get<any[]>(this.consoleUrl + 'GetEmployeeDetailsByCompanyId/' + id)
      .pipe(
        map(response => response.map(employee => {
          return {
            ...employee,
            name: `${employee.firstName || ''} ${employee.middleName || ''} ${employee.lastName || ''}`.replace(/ +(?= )/g, ''),
            text: `${employee.firstName || ''} ${employee.middleName || ''} ${employee.lastName || ''} - ${employee.employeeCode}`.replace(/ +(?= )/g, ''),
          }
        })));
  }
}
