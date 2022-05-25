import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { WorkCenter } from './work-centers.model';

@Injectable({
  providedIn: 'root'
}) 
export class WorkCentersService {

  public baseUrl: string;
  public http: HttpClient;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = `${baseUrl}api/manufacturing/WorkCenter/`;
  }

  getLastWorkCenterId() {
    return this.http.get<number>(this.baseUrl + 'GetLastWorkCenterRequestId').pipe(map(response => { return response; }));
  }
  getAll() {
    return this.http.get<WorkCenter[]>(this.baseUrl + 'getAll/').pipe(map(response => { return response; }));
  }

  get(id) {
    return this.http.get<WorkCenter[]>(this.baseUrl + 'get/' + id).pipe(map(response => { return response; }));
  }

  add(workCenter: WorkCenter) {
    return this.http.post(this.baseUrl + 'insert', workCenter).pipe(map(response => { return response; }));
  }

  update(workCenter: WorkCenter) {
    return this.http.put<number>(this.baseUrl + 'update', workCenter).pipe(map(response => { return response; }));
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'delete/' + id).pipe(map(response => { return response; }));
  }

}
