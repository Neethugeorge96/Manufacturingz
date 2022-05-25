import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ReleaseTimesheet } from './time-sheet-updation.model';

@Injectable({
  providedIn: 'root'
})
export class TimeSheetUpdationService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/TimeTracker/ReleaseTimesheet/`;
  }

  getAll() {
    return this.http.get<ReleaseTimesheet[]>(this.baseUrl + 'getAll/').pipe(map(response => response));
  }

  get(id) {
    return this.http.get<ReleaseTimesheet[]>(this.baseUrl + 'get/' + id).pipe(map(response => response));
  }

  add(releaseTimesheet: ReleaseTimesheet) {
    return this.http.post(this.baseUrl + 'insert', releaseTimesheet).pipe(map(response => response));
  }

  update(releaseTimesheet: ReleaseTimesheet) {
    return this.http.put<number>(this.baseUrl + 'update', releaseTimesheet).pipe(map(response => response));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => response));
  }

  getEmployees() {
    return this.http.get<{ employeeid: number; employeename: string }[]>(this.baseUrl + 'GetMappedEmployee/')
    .pipe(map(response => response));
  }

}
